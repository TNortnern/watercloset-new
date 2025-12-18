# Dashboard Component Structure

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header Component (Sticky Top)                               │
│ ┌─────────┬──────────────────────┬─────────────────────┐   │
│ │ ☰ Menu  │   Search Bar         │  🔔 👤 Notifications│   │
│ └─────────┴──────────────────────┴─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
┌──────────┐┌──────────────────────────────────────────────┐
│ Sidebar  ││ Main Content Area                             │
│          ││                                               │
│ [Logo]   ││  <slot> Your Page Content Here </slot>       │
│          ││                                               │
│ 🏠 Home  ││  Cards, tables, forms, etc.                  │
│ 📅 Books ││                                               │
│ 💬 Msgs  ││                                               │
│ 👤 Prof  ││                                               │
│ ⚙️  Set  ││                                               │
│          ││                                               │
│ [User]   ││                                               │
│ [Logout] ││                                               │
└──────────┘└──────────────────────────────────────────────┘

Mobile View:
┌─────────────────────────────────────────────────────────────┐
│ Header                                                       │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  Main Content (Full Width)                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ Mobile Bottom Nav (Fixed)                                   │
│  🏠 Home  │  📅 Books  │  💬 Msgs  │  👤 Profile            │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
app/layouts/dashboard.vue
├── components/dashboard/Sidebar.vue
│   ├── Logo Section
│   ├── Navigation Items
│   │   ├── Icon
│   │   ├── Label
│   │   └── Badge (optional)
│   └── User Profile Section
│       ├── Avatar
│       ├── Name/Email
│       └── Logout Button
│
├── components/dashboard/Header.vue
│   ├── Mobile Menu Toggle
│   ├── Search Bar
│   ├── Notifications Dropdown
│   │   ├── Notification List
│   │   └── Actions
│   └── User Menu Dropdown
│       ├── User Info
│       ├── Menu Items
│       └── Sign Out
│
├── components/dashboard/MobileNav.vue (lg:hidden)
│   └── Navigation Items (max 4)
│       ├── Icon
│       ├── Label
│       └── Badge (optional)
│
└── Main Content Area
    └── <slot /> (Your page content)
```

## Component Responsibilities

### Dashboard Layout (`layouts/dashboard.vue`)
**Purpose**: Main container and state management

**Responsibilities**:
- Manage sidebar open/collapsed state
- Provide navigation items (default or custom)
- Provide user information
- Handle logout events
- Coordinate child components

**Key State**:
```typescript
const sidebarOpen = ref(false)          // Mobile drawer state
const sidebarCollapsed = ref(false)     // Desktop collapse state
```

---

### Sidebar Component (`components/dashboard/Sidebar.vue`)
**Purpose**: Main navigation on desktop, drawer on mobile

**Features**:
- Logo with brand identity
- Navigation menu with active states
- Collapsible (desktop) / slide-out (mobile)
- User profile section at bottom
- Tooltips in collapsed state
- Badge indicators

**Responsive Behavior**:
- Desktop (≥1024px): Fixed sidebar, can collapse to icon-only
- Mobile (<1024px): Hidden by default, slides in as drawer

**Props**:
```typescript
{
  isOpen: boolean                  // Mobile drawer open
  isCollapsed: boolean             // Desktop collapsed
  navigationItems: NavigationItem[] // Nav menu
  user: UserInfo                   // User data
}
```

**Emits**:
```typescript
{
  close: []                        // Close mobile drawer
  'toggle-collapse': []            // Toggle desktop collapse
  logout: []                       // User logout
}
```

---

### Header Component (`components/dashboard/Header.vue`)
**Purpose**: Top navigation bar with utilities

**Features**:
- Mobile menu toggle (hamburger)
- Search bar with mobile expansion
- Notifications dropdown
  - Badge counter
  - Notification list
  - Mark all read
  - Click outside to close
- User menu dropdown
  - User info display
  - Menu items (Profile, Settings, etc.)
  - Sign out button

**Slots**:
```typescript
{
  title: slot                      // Custom page title
}
```

**Props**:
```typescript
{
  user: UserInfo                   // User data
}
```

**Emits**:
```typescript
{
  'toggle-sidebar': []             // Open mobile sidebar
  logout: []                       // User logout
}
```

---

### Mobile Nav Component (`components/dashboard/MobileNav.vue`)
**Purpose**: Bottom tab bar for mobile devices

**Features**:
- Fixed at bottom (lg:hidden)
- Shows top 4 navigation items
- Active state highlighting
- Badge indicators
- Touch-friendly tap targets
- iOS safe area support

**Props**:
```typescript
{
  navigationItems: NavigationItem[] // Max 4 items
}
```

---

## Data Flow

```
User Action → Component Event → Layout Handler → State Update → UI Update

Example: Opening Mobile Sidebar
1. User taps hamburger in Header
2. Header emits 'toggle-sidebar'
3. Layout handles: sidebarOpen = !sidebarOpen
4. Sidebar receives :is-open="sidebarOpen"
5. Sidebar slides in from left
```

## State Management

### Sidebar State (Layout Level)
```typescript
// Desktop collapse state (persists across navigation)
const sidebarCollapsed = ref(false)

// Mobile drawer state (resets on navigation)
const sidebarOpen = ref(false)
```

### Local State (Component Level)
```typescript
// Header.vue
const notificationsOpen = ref(false)  // Notifications dropdown
const userMenuOpen = ref(false)       // User menu dropdown
const mobileSearchOpen = ref(false)   // Mobile search expansion

// Sidebar.vue
const userMenuOpen = ref(false)       // User profile menu
```

## Styling Architecture

### Layout Spacing
```css
/* Sidebar widths */
.w-64                  /* 256px - Full sidebar */
.w-20                  /* 80px - Collapsed sidebar */

/* Content padding */
.lg:pl-64              /* Desktop: Push content right of sidebar */
.lg:pl-20              /* Desktop collapsed: Less push */
.pb-16                 /* Mobile: Space for bottom nav */
.lg:pb-0               /* Desktop: No bottom space */

/* Header height */
.h-16                  /* 64px - Consistent header height */
```

### Color System
```css
/* Primary Gradient */
.from-cyan-500 .to-teal-600        /* Brand gradient */
.from-cyan-50 .to-teal-50          /* Light active background */

/* Backgrounds */
.bg-slate-50                       /* Page background */
.bg-white                          /* Cards, sidebar, header */

/* Text Colors */
.text-slate-900                    /* Primary text */
.text-slate-600                    /* Secondary text */
.text-slate-400                    /* Tertiary text */
.text-cyan-600                     /* Active/accent text */

/* Borders */
.border-slate-200                  /* Subtle borders */
```

### Interactive States
```css
/* Hover */
.hover:bg-slate-50                 /* Light hover */
.hover:bg-slate-100                /* Stronger hover */
.hover:border-cyan-300             /* Accent border hover */

/* Active/Selected */
.bg-gradient-to-r.from-cyan-50     /* Active nav item */
.text-cyan-600                     /* Active text */
.shadow-sm                         /* Active elevation */

/* Focus */
.focus:border-cyan-300             /* Focus border */
.focus:ring-cyan-200               /* Focus ring */
```

## Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: 640px      // Small tablets
md: 768px      // Tablets
lg: 1024px     // Desktop (sidebar visible)
xl: 1280px     // Large desktop
2xl: 1400px    // Extra large (container max-width)
```

### Behavior by Breakpoint

**Mobile (< 1024px)**:
- Sidebar hidden by default, drawer on demand
- Bottom tab navigation visible
- Hamburger menu in header
- Search collapses to icon
- Full-width content

**Desktop (≥ 1024px)**:
- Sidebar always visible (can collapse to icons)
- Bottom nav hidden
- No hamburger menu
- Search always visible
- Content has left margin for sidebar

## Accessibility Features

- Proper ARIA labels on buttons
- Keyboard navigation support
- Focus management in dropdowns
- Screen reader announcements
- Color contrast compliance (WCAG AA)
- Touch target sizes (min 44x44px)

## Performance Optimizations

- Lazy-loaded icons (tree-shaking)
- Transition GPU acceleration
- Debounced resize handlers
- Click-outside with event delegation
- Computed properties for derived state
- Minimal re-renders with proper reactivity
