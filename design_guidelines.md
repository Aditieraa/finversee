# Finverse - UI/UX Design Guidelines 2026

## Design Vision
**Sleek, Modern Financial Dashboard** - A premium, intuitive financial platform combining sophisticated Navy/Blue color scheme with vibrant accents for actionable items and semantic status indicators.

## Color Palette

### Primary Colors (Dark Mode First)
- **Primary Background**: `#0E142F` (Very Dark Indigo/Navy) - Main canvas
- **Card Background**: `#1A237E` (Core Navy/Blue) - Elevated card surfaces
- **Text Primary**: `#FFFFFF` (Pure White) - Main text
- **Text Secondary**: `#A0B4CC` (Light Cool Gray) - Labels and helper text

### Accent & Action Colors
- **Primary Accent (CTA)**: `#42A5F5` (Vibrant Sky Blue) - Buttons, primary actions
- **Positive/Growth**: `#4CAF50` (Vibrant Green) - Gains, positive metrics
- **Negative/Decline**: `#E53935` (Warning Red) - Losses, alerts
- **Caution**: `#FFC107` (Warm Amber) - Warnings, action required

### HSL Variables (for Tailwind)
```
--primary-bg: 220 50% 10%        /* #0E142F */
--card-bg: 221 60% 20%           /* #1A237E */
--text-primary: 0 0% 100%        /* #FFFFFF */
--text-secondary: 216 30% 67%    /* #A0B4CC */
--accent-blue: 207 89% 61%       /* #42A5F5 */
--success: 122 39% 49%           /* #4CAF50 */
--error: 354 84% 58%             /* #E53935 */
--warning: 45 100% 50%           /* #FFC107 */
```

## Visual Hierarchy & Layout

### Dashboard Structure (Desktop)
1. **Header** - Logo, Navigation, Gamified Status Bar (Avatar, Level, Net Worth)
2. **KPI Row** - 4-5 large cards showing: Cash Available, Total Net Worth, Monthly Growth %, Financial Health
3. **Primary Charts** - Monthly Cash Flow (Area Chart, center-dominant), Portfolio Breakdown (Donut, side)
4. **Key Insights** - Persistent right-hand panel with actionable recommendations
5. **Quick Actions** - Floating action buttons or persistent side panel for frequent actions

### Cards & Components
- **Border Radius**: 10-12px (subtle, modern)
- **Elevation**: Subtle drop-shadow, light inner stroke for depth
- **Spacing**: Generous negative space (p-6, gap-4)
- **Typography**: Sans-serif (Inter/Rubik), large bold numbers, smaller labels

## Chart Specifications

### Monthly Cash Flow (Area Chart)
- Semi-transparent gradient fill (Accent Blue)
- Interactive hover: vertical line + tooltip showing Income, Expenses, Savings
- Smooth curves, minimalist gridlines
- Color: `#42A5F5` with gradient to transparent

### Portfolio Breakdown (Donut Chart)
- **Center Display**: Total Portfolio Value (large, bold)
- **Slice Colors**: 
  - SIP: `#4CAF50` (Green)
  - Stocks: `#42A5F5` (Blue)
  - Gold: `#FFB74D` (Amber)
  - Real Estate: `#CE93D8` (Purple)
  - Savings: `#80DEEA` (Cyan)
- **Interactivity**: Slices slightly pop/lift on hover with value tooltip

## Animations & Micro-Interactions

### State Transitions
- **Tab Switching**: Smooth horizontal slide (150ms)
- **Card Hover**: 2px lift + subtle shadow increase
- **Button Click**: Minimal scale (0.98x) + glow

### Micro-Animations
- **Number Counter**: Count-up effect for financial metrics (KPI cards)
- **Progress Bars**: Smooth fill animation on load (wave effect)
- **Achievement Unlock**: Pop + scale animation with celebratory feedback
- **Notifications**: Slide in from top-right, auto-dismiss with fade

### Gamification
- **Level Up**: Full-screen celebration overlay, glowing status bar, confetti
- **Milestone Reached**: Highlighted achievement card with animation
- **Status Bar Glow**: Pulsing glow on important gamification elements

## Typography
- **Font Family**: Inter, Rubik, or Roboto (clean, modern)
- **Heading**: Bold (700), Large (28-32px)
- **Body Text**: Regular (400), Medium (16px)
- **Labels**: Regular (400), Small (12-14px)
- **Numbers (KPI)**: Bold (700), Extra Large (32-48px)

## Spacing System
- **Micro**: 2px (borders, gaps)
- **Small**: 4px (internal padding)
- **Standard**: 6px (card padding, component gaps)
- **Large**: 8px (section dividers, panel margins)
- **Extra Large**: 12px+ (page-level spacing)

## Accessibility
- **Contrast**: WCAG AA (4.5:1 minimum for text)
- **Focus States**: Visible neon outline
- **Keyboard Navigation**: Full support
- **Motion**: Optional toggle for animations
- **Screen Reader**: Semantic HTML, ARIA labels

## Special States

### Win Condition
- Full-screen celebration overlay
- Intense green glow throughout UI
- "Financial Freedom Achieved" banner

### Loss Condition / Alert
- Red/orange glow intensifies
- Alert modal with reset option
- Subtle screen flicker effect

## Responsive Breakpoints
- **Mobile**: < 768px (stacked layout, single column)
- **Tablet**: 768px - 1024px (2-column hybrid)
- **Desktop**: > 1024px (3-column full layout with sidebars)

## Implementation Notes
- Use `bg-gradient-to-br` for subtle depth
- Apply `backdrop-blur-sm` for glassmorphism effect
- Use `border-opacity` for softer borders
- Implement smooth transitions on all interactive elements
- Keep animations under 400ms for responsiveness
