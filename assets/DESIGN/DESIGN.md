# Design System Specification: Parchment-Ledger Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Master Archivist"**

This design system reimagines technical version control not as a cold, digital terminal, but as a prestigious, living ledger. It rejects the "disposable" aesthetic of modern SaaS in favor of **Digital Permanence**. By combining the tactile authority of 19th-century accounting with the precision of modern git-flow logic, we create an experience that feels documented rather than just "displayed."

To break the "template" look, this system utilizes **Intentional Asymmetry**. Navigation elements may sit off-axis, and content cards mimic the slight imperfections of hand-laid paper. We prioritize wide gutters and generous margins (using our custom spacing scale) to allow the technical complexity of git-flow to breathe.

---

## 2. Colors & Surface Logic

The palette is rooted in organic, historical pigments. We move away from digital pure-blacks and vibrant neons to favor "Ink," "Copper," and "Moss."

### The "No-Line" Rule
Traditional UI relies on borders to separate sections. In this system, we prohibit 1px solid borders for general sectioning. Instead, boundaries are defined by **Background Color Shifts**. For example, a main content area using `surface` (#fff9ed) might transition into a side-bar using `surface-container-low` (#fcf3d8). The eye should perceive the change in "paper weight" rather than a hard stroke.

### Surface Hierarchy & Nesting
Treat the UI as a physical desk.
- **Base Canvas:** `surface` (#fff9ed) — The primary desk surface.
- **Secondary Workspaces:** `surface-container-low` (#fcf3d8) — Used for less critical side panels.
- **The "Ledger Sheet" (Active Cards):** `surface-container-lowest` (#ffffff) — Reserved for the most readable, high-focus content areas (the "Paper" token).
- **Depth via Tonal Stacking:** To highlight a specific git branch, place a `surface-container-highest` (#ebe2c8) header inside a `surface-container-high` (#f1e8cd) container.

### Signature Textures
While we avoid modern neon gradients, we utilize **Tonal Bleeds**. For primary CTAs or state headers, use a subtle transition from `primary` (#4f2800) to `primary-container` (#6f3b00). This mimics the way ink saturates old paper, providing a "soulful" depth that flat digital hex codes lack.

---

## 3. Typography: The Editorial Scale

We pair a high-contrast Serif with a utilitarian Mono-Sans to create a "Technical Manual" aesthetic.

*   **Display & Headlines (Newsreader):** Use for page titles and major branch headers. The serif nature conveys authority and history.
    *   `display-lg`: 3.5rem (The Archive Title)
    *   `headline-md`: 1.75rem (The Ledger Entry)
*   **Technical & Body (Work Sans):** Despite the "Parchment" theme, readability is paramount. Work Sans provides a clean, neutral counter-balance to the Serif headings.
    *   `title-md`: 1.125rem (The Action Label)
    *   `body-md`: 0.875rem (The Git Log/Description)
*   **The Monospace Exception:** Code snippets, commit hashes, and CLI commands should always utilize a high-legibility monospace font (not explicitly in the token set, but integrated into the `body` styling) to maintain technical accuracy.

---

## 4. Elevation & Depth: Tonal Layering

We reject the standard "Drop Shadow" in favor of **Natural Ambient Occlusion**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card sitting on a `surface-dim` background creates a natural lift.
*   **Ambient Shadows:** If a floating element (like a merge popover) is required, use an extra-diffused shadow.
    *   *Specification:* Blur: 24px, Opacity: 6%, Color: Tinted with `on-surface` (#1f1c0b).
*   **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use the `outline-variant` token at **15% opacity**. It should look like a light pencil mark, not a digital line.
*   **Glassmorphism:** For overlays or sticky headers, use `surface` colors with a 0.8 opacity and a 12px backdrop-blur. This allows the "parchment" texture of the underlying layer to bleed through, maintaining the illusion of physical paper.

---

## 5. Components

### Buttons (The "Seal" of Approval)
*   **Primary (Copper Merge):** Uses `primary` (#4f2800) with `on-primary` (#ffffff) text. No rounded corners (0px). High-contrast.
*   **Secondary (Ink Blue):** Uses `secondary` (#406180). Styled as a "Ghost Button" with a 1px `outline` (#73777e).
*   **Tertiary:** Text-only in `secondary` with a classic underline that appears on hover, mimicking a handwritten note.

### Cards & Lists
*   **No Dividers:** Prohibit the use of horizontal lines between list items. Use 1.4rem (`spacing-4`) of vertical white space to separate entries.
*   **Branch Indicators:** Use `tertiary` (#263800) for "Feature" branches and `surface-tint` (#8c4f10) for "Hotfix" highlights. These should appear as solid vertical color-blocks on the left edge of a card.

### Input Fields
*   **Style:** Lower-border only (Ink Blue, 1px). When focused, the background shifts to `surface-container-highest` (#ebe2c8).
*   **Labels:** Always use `label-md` in `on-surface-variant` (#42474d), positioned above the input to mimic a ledger's field-header.

### Git-Flow Specific Components
*   **Commit Nodes:** Small, 8px squares (0px radius) in `secondary`. Connected by 1px "Ink" lines to mimic a technical drawing.
*   **Merge Conflict Callouts:** Large, asymmetrical blocks using `error_container` (#ffdad6) with a heavy left-margin to draw the eye immediately to the instability.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. A 4rem margin on the left and a 7rem margin on the right can make a technical dashboard feel like a high-end magazine.
*   **Do** lean into the 0px border-radius. Everything is a sharp, cut sheet of paper.
*   **Do** use `newsreader` for numbers. Commits counts and version numbers should feel like archival data.

### Don't
*   **Don't** use 100% black. Always use `on-background` (#1f1c0b) for text to maintain the "Ink" feel.
*   **Don't** use standard "Material" shadows. If it looks like a floating app, you've lost the "Ledger" soul.
*   **Don't** use icons with fills. Use 1px or 1.5px stroke-based icons only—they must look like they were drawn with a fine-tip technical pen.