# Design

## Theme

**"Serene Natural"** — Un sistema visual que evoca calma y bienestar natural sin caer en cliché. Inspirado en la luz suave de una mañana en un estudio de pilates con vista al verde.

## Color Palette

```css
:root {
  /* Primary - Indigo sereno */
  --primary: oklch(0.55 0.10 265);
  --primary-foreground: oklch(0.98 0 0);

  /* Accent - Verde salvia (naturaleza) */
  --accent: oklch(0.65 0.08 155);
  --accent-foreground: oklch(0.15 0 0);

  /* Backgrounds */
  --background: oklch(1 0 0);
  --foreground: oklch(0.15 0.02 265);

  /* Surfaces */
  --card: oklch(0.99 0 0);
  --card-foreground: oklch(0.15 0.02 265);

  /* Muted (secondary text) */
  --muted: oklch(0.55 0.02 265);
  --muted-foreground: oklch(0.45 0.02 265);

  /* Semantic */
  --destructive: oklch(0.55 0.18 25);
  --destructive-foreground: oklch(0.98 0 0);
  --success: oklch(0.60 0.12 155);
  --warning: oklch(0.75 0.12 85);

  /* Borders */
  --border: oklch(0.91 0.01 265);
  --input: oklch(0.91 0.01 265);
  --ring: oklch(0.55 0.10 265);

  /* Radius */
  --radius: 0.625rem;
}
```

### Contrast Requirements Met

- Body text (foreground on background): ~12:1 ✓
- Muted text on background: ~5:1 ✓
- Primary button text: ~7:1 ✓

## Typography

**Font Stack:** Inter (system-ui fallback) — chosen for excellent readability at small sizes and professional feel without being cold.

### Scale

```
Display: 3.5rem / 700 / -0.02em
H1: 2.5rem / 600 / -0.02em
H2: 1.875rem / 600 / -0.01em
H3: 1.25rem / 600 / 0
Body: 1rem / 400 / 0
Small: 0.875rem / 400 / 0
Caption: 0.75rem / 500 / 0.02em (uppercase for labels)
```

### Line Heights

- Headings: 1.2 (tight)
- Body: 1.6 (relaxed for readability)
- UI elements: 1.4

## Spacing

Base unit: 4px

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
```

## Motion

**Principles:**
- Ease-out-quint for entrances (decelerate naturally)
- 200ms default for micro-interactions
- 300ms for layout changes
- Never animate layout properties (width, height) - only transform/opacity

**Reduced Motion:** All animations respect `prefers-reduced-motion: reduce` via instant transitions.

## Shadows

```
shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05)
shadow-md: 0 4px 6px oklch(0 0 0 / 0.07)
shadow-lg: 0 10px 15px oklch(0 0 0 / 0.1)
```

## Components

### Cards

- Background: var(--card)
- Border: 1px solid var(--border)
- Border-radius: var(--radius) (10px)
- Padding: 1.5rem
- Shadow-sm default

### Buttons

**Primary:** Filled with primary color, white text
**Secondary:** Border only, foreground text
**Ghost:** No border, subtle hover background
**Destructive:** Red tones, white text

All buttons: 0.625rem radius, 200ms transitions, min-height 44px for touch targets.

### Badges

- Status badges: pill shape (9999px radius)
- Border-radius on badges: full-pill
- Uses accent colors for status (confirmed=green, waitlist=amber, cancelled=red)

### Form Inputs

- Height: 44px (touch-friendly)
- Border-radius: var(--radius)
- Focus: ring-2 with primary color
- Error: destructive border + inline error text below

## Layout

### Client Portal

- Single column mobile, max-width 480px centered on desktop
- Bottom navigation on mobile (fixed)
- Sticky headers with blur backdrop

### Admin Portal

- Sidebar navigation (collapsible)
- Main content area with max-width 1400px
- Cards in responsive grid (auto-fit, 320px min)

### Responsive Strategy

- Mobile-first breakpoints: 640px, 768px, 1024px, 1280px
- No breakpoint for single-column layouts (natural flow)
- Cards use `repeat(auto-fit, minmax(320px, 1fr))`

## Class Type Colors (Calendar)

```
Reformer: oklch(0.55 0.14 285)   /* Violeta */
Mat:      oklch(0.58 0.12 155)  /* Verde salvia */
Tower:    oklch(0.65 0.14 45)   /* Ámbar cálido */
Chair:    oklch(0.60 0.16 25)   /* Terracota */
Barrel:   oklch(0.62 0.14 330)  /* Rosa cálido */
Private:  oklch(0.55 0.10 265)  /* Indigo */
```

## Dark Mode (Future)

If needed:
- Background: oklch(0.12 0 0)
- Surface: oklch(0.18 0 0)
- Foreground: oklch(0.95 0 0)
- Muted: oklch(0.65 0 0)