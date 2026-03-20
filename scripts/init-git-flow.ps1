[CmdletBinding()]
param(
    [string]$ProductionBranch = "main",
    [string]$DevelopBranch = "develop",
    [string]$Remote = "origin",
    [switch]$Push,
    [switch]$ConfigureGitFlow,
    [switch]$AllowDirty
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Invoke-Git {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Args
    )

    & git @Args
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Args -join ' ') failed with exit code $LASTEXITCODE."
    }
}

function Test-GitRef {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Ref
    )

    & git show-ref --verify --quiet $Ref
    return $LASTEXITCODE -eq 0
}

function Test-GitRepository {
    & git rev-parse --is-inside-work-tree *> $null
    return $LASTEXITCODE -eq 0
}

if (-not (Test-GitRepository)) {
    throw "Current directory is not inside a Git repository."
}

$workingTreeStatus = (& git status --porcelain)
if (-not $AllowDirty -and $workingTreeStatus) {
    throw "Working tree is dirty. Commit, stash, or rerun with -AllowDirty if that is intentional."
}

$remoteNames = @(& git remote)
$hasRemote = $remoteNames -contains $Remote
if ($hasRemote) {
    Invoke-Git -Args @("fetch", $Remote, "--prune")
}

$currentBranch = (& git branch --show-current).Trim()
if (-not $currentBranch) {
    throw "Detached HEAD is not supported for initialization."
}

$productionLocal = Test-GitRef -Ref "refs/heads/$ProductionBranch"
$productionRemote = $hasRemote -and (Test-GitRef -Ref "refs/remotes/$Remote/$ProductionBranch")

if (-not $productionLocal) {
    if ($productionRemote) {
        Invoke-Git -Args @("switch", "--track", "-c", $ProductionBranch, "$Remote/$ProductionBranch")
        $productionLocal = $true
        $currentBranch = $ProductionBranch
    }
    else {
        throw "Production branch '$ProductionBranch' was not found locally or on remote '$Remote'."
    }
}

$developLocal = Test-GitRef -Ref "refs/heads/$DevelopBranch"
$developRemote = $hasRemote -and (Test-GitRef -Ref "refs/remotes/$Remote/$DevelopBranch")
$developCreated = $false

if (-not $developLocal) {
    if ($developRemote) {
        Invoke-Git -Args @("switch", "--track", "-c", $DevelopBranch, "$Remote/$DevelopBranch")
    }
    else {
        if ($currentBranch -ne $ProductionBranch) {
            Invoke-Git -Args @("switch", $ProductionBranch)
        }

        Invoke-Git -Args @("switch", "-c", $DevelopBranch)
        $developCreated = $true
    }
}
else {
    if ($currentBranch -ne $DevelopBranch) {
        Invoke-Git -Args @("switch", $DevelopBranch)
    }
}

if ($Push) {
    if (-not $hasRemote) {
        throw "Remote '$Remote' does not exist, so -Push cannot be used."
    }

    $developHasUpstream = $false
    & git rev-parse --abbrev-ref "$DevelopBranch@{upstream}" *> $null
    if ($LASTEXITCODE -eq 0) {
        $developHasUpstream = $true
    }

    if ($developCreated -or -not $developHasUpstream) {
        Invoke-Git -Args @("push", "-u", $Remote, $DevelopBranch)
    }
    else {
        Invoke-Git -Args @("push", $Remote, $DevelopBranch)
    }
}

if ($ConfigureGitFlow) {
    # git-flow uses the historic "master" config key even when the branch is named "main".
    Invoke-Git -Args @("config", "gitflow.branch.master", $ProductionBranch)
    Invoke-Git -Args @("config", "gitflow.branch.develop", $DevelopBranch)
    Invoke-Git -Args @("config", "gitflow.prefix.feature", "feature/")
    Invoke-Git -Args @("config", "gitflow.prefix.release", "release/")
    Invoke-Git -Args @("config", "gitflow.prefix.hotfix", "hotfix/")
    Invoke-Git -Args @("config", "gitflow.prefix.bugfix", "bugfix/")
    Invoke-Git -Args @("config", "gitflow.prefix.support", "support/")
}

$summary = [ordered]@{
    production_branch   = $ProductionBranch
    develop_branch      = $DevelopBranch
    current_branch      = (& git branch --show-current).Trim()
    develop_created     = $developCreated
    remote              = if ($hasRemote) { $Remote } else { "" }
    pushed              = [bool]$Push
    gitflow_configured  = [bool]$ConfigureGitFlow
}

$summary.GetEnumerator() | ForEach-Object {
    "{0}={1}" -f $_.Key, $_.Value
}
