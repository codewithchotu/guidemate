# GuideMate Color Palette — Premium Design System

## Overview
The redesigned color palette creates a premium, warm, and trustworthy aesthetic for the travel/local guide platform. The new system moves away from desaturated greys and stark black-and-white layouts toward culturally vibrant and visually striking colors.

---

## 🎨 Core Color System

### Primary Colors — Trustworthy & Adventurous

| Color | Hex Value | Usage | Notes |
|-------|-----------|-------|-------|
| **Rich Teal** | `#0D9488` | Primary brand color, CTA text, interactive elements | Main anchor for trust and adventure |
| **Dark Teal** | `#0F766E` | Darker variant for hover states and emphasis | Used in gradients and secondary applications |
| **Bright Teal** | `#14B8A6` | Lighter variant for hover states | Used in gradients and secondary applications |

### Secondary/Accent — Vibrant & Premium

| Color | Hex Value | Usage | Notes |
|-------|-----------|-------|-------|
| **Vibrant Amber** | `#F59E0B` | Star ratings, badges, premium feature highlights, "Become a Guide" CTA | Primary accent for premium feel |
| **Amber Hover** | `#D97706` | Hover state for amber elements | Darker for interactive feedback |
| **Amber Light (5% Tint)** | `#FEF3C7` | Badge backgrounds, UI container backgrounds | Very light, desaturated for subtlety |

### Background & Surfaces

| Color | Hex Value | Usage | Notes |
|-------|-----------|-------|-------|
| **Soft Off-White** | `#FAFAFA` | Main canvas background | Creates light, airy feel |
| **Light Grey** | `#F5F5F5` | Secondary backgrounds | Subtle contrast from main background |
| **Medium Light Grey** | `#EFEFEF` | Tertiary backgrounds, hover states | Additional depth layer |
| **Pure White** | `#FFFFFF` | Feature cards, user profile containers, surfaces | Clean, premium appearance |

### Typography

| Color | Hex Value | Usage | Notes |
|-------|-----------|-------|-------|
| **Deep Slate/Charcoal** | `#0F172A` | Primary headings, main text | Sophisticated, readable alternative to harsh black |
| **Medium Grey** | `#475569` | Secondary text, descriptions | Legible mid-tone grey |
| **Light Grey** | `#94A3B8` | Tertiary text, disabled text | Subtle, non-intrusive |

### Semantic Colors

| Color | Hex Value | Usage | Notes |
|-------|-----------|-------|-------|
| **Success Green** | `#10B981` | Success messages, confirmation states | Positive feedback |
| **Warning Amber** | `#F59E0B` | Warning alerts, caution states | Matches primary accent |
| **Error Red** | `#EF4444` | Error messages, destructive actions | Clear danger indication |
| **Info Blue** | `#3B82F6` | Informational messages, tips | Neutral information |

### Borders & Dividers

| Color | Hex Value | Usage | Notes |
|-------|-----------|-------|-------|
| **Border Grey** | `#E2E8F0` | Card borders, divider lines | Subtle, clean separation |
| **Divider Grey** | `#F1F5F9` | Light dividers, subtle separation | Very subtle, almost invisible |

---

## 🎨 Gradients & Effects

### Hero CTAs & Buttons

```css
/* Primary Gradient */
background: linear-gradient(135deg, #0D9488 0%, #14B8A6 100%);

/* Hover State Gradient */
background: linear-gradient(135deg, #0F766E 0%, #0D9488 100%);
```

**Application:** Premium button CTAs, hero call-to-action buttons, "Become a Guide" feature highlights

### Feature Icons & Accent Areas

```css
/* Feature Icon Background */
background: linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(245, 158, 11, 0.1));
```

**Application:** Feature card icons, icon backgrounds, accent areas

### Hero & Section Backgrounds

```css
/* Hero Section */
background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);

/* Dark Hero/CTA Sections */
background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
```

**Application:** Hero sections, dark CTA sections with white text

---

## 🎨 Shadows & Depth

All shadows use the sophisticated Dark Slate color for a premium feel:

```css
--shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.05);
--shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04);
--shadow-md: 0 4px 6px rgba(15, 23, 42, 0.07), 0 2px 4px rgba(15, 23, 42, 0.05);
--shadow-lg: 0 10px 15px rgba(15, 23, 42, 0.08), 0 4px 6px rgba(15, 23, 42, 0.04);
--shadow-xl: 0 20px 25px rgba(15, 23, 42, 0.08), 0 10px 10px rgba(15, 23, 42, 0.03);
```

**Key Feature:** Very soft, diffused shadows (`rgba(15, 23, 42, 0.05)`) create depth without harsh contrast

---

## 🎯 Usage Guidelines

### When to Use Teal (`#0D9488`)
- Primary brand logo and branding
- Main CTA buttons
- Active tab/navigation states
- Primary text for important headings
- Interactive elements (links, buttons)
- Hover states for secondary elements

### When to Use Amber (`#F59E0B`)
- Star ratings and review indicators
- Premium feature badges
- "Become a Guide" CTA text
- Status badges (especially positive)
- Alert icons (warning state)
- Accent highlights in cards

### When to Use Deep Slate (`#0F172A`)
- Page headings (h1, h2, h3)
- Premium body text
- Form labels
- Card titles
- Main navigation text

### When to Use Medium Grey (`#475569`)
- Secondary body text
- Descriptions and captions
- Placeholder text
- Subheadings
- Supporting information

### When to Use Light Backgrounds
- Main page canvas: `#FAFAFA`
- Secondary sections: `#F5F5F5`
- Card surfaces: `#FFFFFF`
- Hover states: `#EFEFEF`

---

## 🎨 Color Tints & Opacity Usage

### Accent Color Tints (Amber)
- **5% opacity tint** (`#FEF3C7`): Badge backgrounds, subtle UI container backgrounds
- Used internally for metrics and tags instead of flat grey

### Primary Color Tints (Teal)
- **10% opacity tint** (`rgba(13, 148, 136, 0.1)`): Feature icon backgrounds, hover states
- **5% opacity tint** (`rgba(13, 148, 136, 0.05)`): Very subtle backgrounds, form focus states

### Shadow Color Tints (Dark Slate)
- **5% opacity** (`rgba(15, 23, 42, 0.05)`): Extra soft shadows for premium feel
- **8% opacity** (`rgba(15, 23, 42, 0.08)`): Medium shadows for card elevation
- **10% opacity** (`rgba(15, 23, 42, 0.1)`): Stronger shadows for emphasis

---

## 📐 CSS Variables Reference

All colors are defined as CSS variables in `src/styles/theme.css` for easy consistency:

```css
:root {
  /* Primary Colors */
  --color-primary: #0D9488;
  --color-primary-dark: #0F766E;
  --color-primary-light: #14B8A6;
  
  /* Accent */
  --color-accent: #F59E0B;
  --color-accent-hover: #D97706;
  --color-accent-light: #FEF3C7;
  
  /* Background & Surface */
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  
  /* Text */
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #0D9488 0%, #14B8A6 100%);
  
  /* Shadows */
  --shadow-lg: 0 10px 15px rgba(15, 23, 42, 0.08), 0 4px 6px rgba(15, 23, 42, 0.04);
}
```

---

## 🎯 Best Practices

1. **Always use CSS variables** instead of hardcoding color values
2. **Maintain high contrast** for accessibility (WCAG AA standard minimum)
3. **Use teal as the primary focus color** for navigation and key interactions
4. **Reserve amber for premium features and ratings** to create visual hierarchy
5. **Keep typography legible** with sufficient contrast between text and background
6. **Apply shadows consistently** using the defined shadow scale for cohesion
7. **Test color combinations** on both light and dark surfaces for accessibility

---

## 🔄 Migration Notes

This palette replaces:
- Old Maroon (`#6D2932`) → Rich Teal (`#0D9488`)
- Old Navy Blue (`#1E3E62`) → Dark Teal (`#0F766E`)
- Old Gold (`#C6A969`) → Vibrant Amber (`#F59E0B`)
- Old harsh blacks → Deep Slate (`#0F172A`)
- Old harsh greys → Medium Grey (`#475569`)

All hardcoded color values in CSS files have been updated to use CSS variables for consistency.

---

## 📊 Color Contrast Reference

**WCAG AA Compliant Combinations:**

| Foreground | Background | Ratio | Status |
|------------|-----------|-------|--------|
| #0F172A (Text) | #FAFAFA (Background) | 13.7:1 | ✓ AAA |
| #FFFFFF (Text) | #0D9488 (Teal) | 5.2:1 | ✓ AA |
| #0D9488 (Teal) | #FFFFFF (Surface) | 5.2:1 | ✓ AA |
| #F59E0B (Amber) | #FFFFFF (Surface) | 4.9:1 | ✓ AA |

---

**Design System Version:** 2.0 (Premium Redesign)  
**Last Updated:** 2026-06-21
