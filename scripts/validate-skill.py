#!/usr/bin/env python3
"""
Validate the public skill repository without depending on external skill repos.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

MAX_SKILL_NAME_LENGTH = 64
ALLOWED_FRONTMATTER_KEYS = {"name", "description", "license", "allowed-tools", "metadata"}
ALLOWED_INTERFACE_KEYS = {
    "display_name",
    "short_description",
    "icon_small",
    "icon_large",
    "brand_color",
    "default_prompt",
}


def fail(message: str) -> tuple[bool, str]:
    return False, message


def load_yaml_file(path: Path):
    try:
        return yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        raise ValueError(f"Invalid YAML in {path}: {exc}") from exc


def validate_skill_md(repo_root: Path) -> tuple[bool, str]:
    skill_md = repo_root / "SKILL.md"
    if not skill_md.exists():
        return fail("SKILL.md not found")

    content = skill_md.read_text(encoding="utf-8")
    if not content.startswith("---"):
        return fail("No YAML frontmatter found in SKILL.md")

    match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return fail("Invalid frontmatter format in SKILL.md")

    try:
        frontmatter = yaml.safe_load(match.group(1))
    except yaml.YAMLError as exc:
        return fail(f"Invalid YAML frontmatter in SKILL.md: {exc}")

    if not isinstance(frontmatter, dict):
        return fail("SKILL.md frontmatter must be a YAML dictionary")

    unexpected = set(frontmatter.keys()) - ALLOWED_FRONTMATTER_KEYS
    if unexpected:
        return fail(
            "Unexpected key(s) in SKILL.md frontmatter: "
            + ", ".join(sorted(unexpected))
        )

    name = frontmatter.get("name")
    description = frontmatter.get("description")
    if not isinstance(name, str) or not name.strip():
        return fail("SKILL.md frontmatter must include a non-empty string name")
    if not re.fullmatch(r"[a-z0-9-]+", name) or name.startswith("-") or name.endswith("-") or "--" in name:
        return fail(f"Invalid skill name '{name}'")
    if len(name) > MAX_SKILL_NAME_LENGTH:
        return fail(f"Skill name is too long ({len(name)} > {MAX_SKILL_NAME_LENGTH})")

    if not isinstance(description, str) or not description.strip():
        return fail("SKILL.md frontmatter must include a non-empty string description")
    if "<" in description or ">" in description:
        return fail("Description cannot contain angle brackets")
    if len(description) > 1024:
        return fail("Description is too long")

    return True, "SKILL.md is valid"


def validate_openai_yaml(repo_root: Path) -> tuple[bool, str]:
    config_path = repo_root / "agents" / "openai.yaml"
    if not config_path.exists():
        return fail("agents/openai.yaml not found")

    try:
        data = load_yaml_file(config_path)
    except ValueError as exc:
        return fail(str(exc))

    if not isinstance(data, dict):
        return fail("agents/openai.yaml must be a YAML dictionary")

    interface = data.get("interface")
    if not isinstance(interface, dict):
        return fail("agents/openai.yaml must include an interface section")

    unexpected = set(interface.keys()) - ALLOWED_INTERFACE_KEYS
    if unexpected:
        return fail("Unexpected interface key(s): " + ", ".join(sorted(unexpected)))

    for required_key in ("display_name", "short_description", "default_prompt"):
        value = interface.get(required_key)
        if not isinstance(value, str) or not value.strip():
            return fail(f"interface.{required_key} must be a non-empty string")

    for icon_key in ("icon_small", "icon_large"):
        icon_path = interface.get(icon_key)
        if icon_path:
            resolved = (config_path.parent.parent / icon_path.replace("./", "", 1)).resolve()
            if not resolved.exists():
                return fail(f"{icon_key} points to a missing file: {icon_path}")

    brand_color = interface.get("brand_color")
    if brand_color and not re.fullmatch(r"#[0-9A-Fa-f]{6}", brand_color):
        return fail("interface.brand_color must be a 6-digit hex value like #112233")

    return True, "agents/openai.yaml is valid"


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate-skill.py <repo-root>")
        return 1

    repo_root = Path(sys.argv[1]).resolve()
    if not repo_root.exists():
        print(f"Repository root not found: {repo_root}")
        return 1

    checks = [validate_skill_md(repo_root), validate_openai_yaml(repo_root)]
    failures = [message for ok, message in checks if not ok]
    if failures:
        for message in failures:
            print(message)
        return 1

    for _, message in checks:
        print(message)
    print("Repository skill validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
