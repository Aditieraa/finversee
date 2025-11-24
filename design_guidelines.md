# Finverse - Design Guidelines

## Design Approach
**Reference-Based Hybrid**: Drawing inspiration from futuristic fintech apps (Robinhood's clarity + crypto dashboard aesthetics) with a distinctive neon gaming overlay. This is a gamified financial education platform requiring both utility and visual impact.

## Visual Aesthetic
**Cyber-Finance Neon Theme**
- Deep black base (#0A0F1F) with atmospheric depth
- Glowing neon accents create futuristic gaming ambiance
- Glassmorphic panels with blur effects and subtle transparency
- Soft neon shadows using rgba for ethereal glow
- High contrast for readability against dark background
- Minimal clutter with purposeful use of space

## Color System

**Primary Palette:**
- Background: `#0A0F1F` (deep black-blue base)
- Neon Cyan: `#00E5FF` (primary actions, highlights, borders)
- Neon Purple: `#9D4BFF` (headers, AI chat, secondary accents)
- Electric Pink: `#FF2DAE` (alerts, losses, critical events)
- Neon Lime: `#C6FF00` (success states, gains, achievements)
- Soft White: `#E6F1FF` (primary text)

**Functional Applications:**
- Profit/Gain indicators → Lime glow
- Loss/Warning indicators → Pink/Red glow
- AI mentor elements → Purple glow
- Interactive elements → Cyan glow
- Success states → Lime pulse

## Typography
- Futuristic, tech-inspired font families (Space Grotesk or similar)
- Bold weights for financial figures and headings
- Medium weights for body text
- Tabular numbers for currency displays
- High contrast white (#E6F1FF) on dark backgrounds

## Layout Structure

### Desktop (3-Column Grid)
**Left Panel (25% width)**: Aura Twin AI Chat
- Fixed height scrollable area
- Chat bubbles with neon outlines
- Input docked at bottom
- Auto-scroll to latest message

**Center Panel (45% width)**: Dashboard & Decision Making
- Month/Year display with neon border
- Cash balance and net worth cards with glowing edges
- Investment decision forms (SIP, Stocks, Gold, Real Estate, Savings)
- Confirm button with pulsing neon effect
- Monthly summary card

**Right Panel (30% width)**: Portfolio & Progress
- Real-time portfolio values
- Neon animated bar charts
- Achievement badges with glow animations
- Milestone tracker
- Leaderboard rankings

### Mobile (Vertical Stack)
- Collapsible sections with smooth transitions
- Floating action buttons (bottom-right)
- Sticky header with essential stats
- Touch-friendly targets (minimum 48px)

## Component Specifications

### Cards/Panels
- Glassmorphic effect: `backdrop-blur` with dark transparent backgrounds
- Neon borders with rgba glow shadows
- Rounded corners (12-16px)
- Subtle hover state with increased glow intensity

### Buttons
- Primary: Cyan background with intense glow
- Secondary: Outline style with neon border
- Pulsing animation on important CTAs
- Hover state: Increased glow + slight scale
- Active state: Compressed scale

### Charts & Data Visualization
- Neon bar charts with gradient fills
- Percentage indicators with circular progress
- Animated transitions on value changes
- Color-coded by performance (lime/pink)

### Modals & Overlays
- Dark backdrop with blur
- Glassmorphic modal panels
- Neon border accent
- Smooth fade-in animations

### Toast Notifications
- Float from top-right
- Neon border matching alert type
- Auto-dismiss with progress bar
- Icon + message layout

### Input Fields
- Dark background with neon border on focus
- Glow effect when active
- Label above input
- Validation states with color-coded borders

## Spacing System
Use Tailwind spacing units consistently:
- Micro spacing: `p-2`, `gap-2` (cards, buttons)
- Standard spacing: `p-4`, `p-6`, `gap-4` (sections)
- Large spacing: `p-8`, `py-12` (panel padding, section dividers)

## Interactions & Animations

### Minimal, Purposeful Motion
- Glow pulse on achievement unlocks
- Smooth slide-in for random events
- Number count-up for financial updates
- Confetti explosion on milestones
- Screen subtle shake on bankruptcy
- Progress bar animations
- Hover state glow intensity increase

### Sound Effects (Toggle-able)
- Success chime (investments, achievements)
- Loss rumble (negative events)
- Button click pulse
- Notification ping

## Special States

### Win Condition
- Full-screen celebration overlay
- Confetti animation
- Intense lime glow throughout UI
- "Financial Freedom Achieved" message

### Loss Condition
- Screen flicker effect
- Pink/red glow intensifies
- "Bankruptcy" modal with reset option

## Accessibility
- High contrast ratios maintained
- Focus states with visible neon outlines
- Keyboard navigation support
- Screen reader-friendly labels
- Toggle for motion/sound preferences

## Responsive Breakpoints
- Mobile: < 768px (stacked layout)
- Tablet: 768px - 1024px (2-column hybrid)
- Desktop: > 1024px (3-column full layout)

## Images
No hero images required. This is a dashboard/game interface focused on data visualization, chat interaction, and financial metrics. All visual interest comes from neon effects, charts, and UI components.