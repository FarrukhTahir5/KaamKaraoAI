---
name: Celestial Command
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#4ae176'
  on-secondary: '#003915'
  secondary-container: '#00b954'
  on-secondary-container: '#004119'
  tertiary: '#d5c3ff'
  on-tertiary: '#3c0091'
  tertiary-container: '#bda2ff'
  on-tertiary-container: '#520fbb'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
  data-point:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-desktop: 48px
  container-padding-mobile: 20px
  gutter: 24px
  component-gap: 16px
---

## Brand & Style
The design system is a high-performance, futuristic interface designed to evoke the feeling of an **AI Mission Control**. It targets power users who require high-density information presented with immersive, cinematic clarity. 

The aesthetic is a sophisticated blend of **Glassmorphism** and **Minimalist High-Tech**. It utilizes deep atmospheric gradients to create a sense of infinite depth, while UI elements appear as suspended glass panes. The emotional response is one of total control, intelligence, and absolute reliability. Every interaction should feel like a whisper—smooth, instantaneous, and premium.

## Colors
This design system operates exclusively in a **Deep Dark Mode**. 

- **Primary (Electric Blue):** Used for primary actions, focus states, and critical data pathways.
- **Secondary (Glowing Green):** Reserved for success states, active AI processes, and "go" signals.
- **Backgrounds:** A layered gradient approach starting from `#020617` (Void) at the bottom to `#0F172A` (Surface) near the top.
- **Functional Accents:** High-vibrancy tints are used sparingly to guide the eye through complex data visualizations.

## Typography
Typography is structured to balance futuristic personality with technical precision. 

**Sora** provides a geometric, wide-stanced presence for headlines, giving the interface its "command center" authority. **Geist** is the workhorse for body content, offering exceptional legibility in low-light environments. **JetBrains Mono** is introduced for metadata, labels, and AI-generated outputs to reinforce the "Mission Control" and "System Process" narrative. All text should maintain high contrast against dark backgrounds, using `#F9FAFB` for primary content and `#94A3B8` for secondary descriptions.

## Layout & Spacing
The layout follows a **fluid 12-column grid** on desktop and a **4-column grid** on mobile. 

We employ a "Space-First" philosophy, using generous margins and gutters to prevent information density from becoming overwhelming. Content should be grouped into logical "Modules" or "Pods" that float within the layout. On desktop, sidebars are persistently visible but utilize backdrop blurs to maintain a sense of environmental depth. Spacing increments are strictly mathematical, based on an 8px scale to ensure technical alignment.

## Elevation & Depth
Depth is not communicated through traditional drop shadows, but through **Backdrop Blurs** and **Luminance**. 

1.  **Base Layer:** The deepest background gradient.
2.  **Middle Layer (Glass Panes):** Semi-transparent surfaces with a 20px - 40px `backdrop-filter: blur()`. These panels feature a 1px solid border using `rgba(255, 255, 255, 0.14)`.
3.  **Top Layer (Active Components):** Floating elements that use subtle internal glows (box-shadow: inset) rather than external shadows. 

Interactive elements should appear to "light up" rather than "lift up" when hovered, using primary-colored outer glows to signify focus.

## Shapes
The design system uses a **Refined Rounded** language. A base radius of `0.5rem (8px)` is applied to standard components like input fields and buttons. Larger containers and cards utilize `1rem (16px)` to create a softer, more premium feel that contrasts against the sharp, technical typography. All glass panels must have perfectly synchronized corner radii to maintain the "milled glass" aesthetic.

## Components

### Buttons
Primary buttons use a solid gradient fill of the Primary Accent, while secondary buttons use a "Ghost Glass" style: transparent center with a Primary-colored border and a subtle hover glow. All buttons have a high-tracking label for a cinematic look.

### Cards (Glass Pods)
The signature component. Cards must use `backdrop-filter: blur(12px)` and a thin `1px` border. For "featured" AI cards, add a subtle top-down linear gradient border that fades from the Primary color to transparent.

### Input Fields
Inputs are dark and recessed. On focus, the border transitions from neutral to the Primary accent with a soft "glow" effect. Placeholder text is rendered in a dimmed monospaced font.

### Status Badges & Glow Rings
Status indicators are never flat. They utilize a "Pulse" animation and a blurred glow. Score visualizations (e.g., AI confidence) are rendered as circular rings with a neon-stroke gradient that animates on load.

### Lists & Navigation
List items are separated by low-opacity "scanning lines" rather than solid borders. Navigation items should use a vertical "active line" in the Primary accent to indicate the current section.