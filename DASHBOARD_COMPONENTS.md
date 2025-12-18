# Dashboard Components Documentation

## Overview

This document describes the dashboard layout system for MyWaterCloset, a modern SaaS-style dashboard built with Nuxt 4, Vue 3, and Tailwind CSS.

## Components

### 1. Dashboard Layout (`app/layouts/dashboard.vue`)

The main dashboard layout wrapper that provides the overall structure.

**Features:**
- Responsive sidebar (collapsible on mobile)
- Top navigation bar
- Content area for pages
- Mobile-first design
- Teal/cyan color scheme

**Usage:**

```vue
<template>
  <NuxtLayout name="dashboard">
    <h1>Your Dashboard Content</h1>
    <!-- Your page content goes here -->
  </NuxtLayout>
</template>
```

Or use page meta:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})
</script>
```

---

### 2. DashboardSidebar (`app/components/dashboard/DashboardSidebar.vue`)

A collapsible sidebar with navigation links and user profile section.

**Features:**
- Animated logo
- Navigation with active states
- Badge support for notification counts
- User profile section at bottom
- Mobile overlay with smooth transitions
- Auto-detects mobile/desktop viewport

**Props:**

```typescript
interface Props {
  isOpen: boolean           // Controls sidebar visibility (mobile)
  navigationItems: Array<{
    name: string           // Display name
    href: string           // Route path
    icon: Component        // Lucide icon component
    badge?: number         // Optional notification badge
  }>
}
```

**Example:**

```vue
<DashboardSidebar
  :is-open="sidebarOpen"
  :navigation-items="[
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar, badge: 3 },
  ]"
  @close="sidebarOpen = false"
/>
```

---

### 3. DashboardNavbar (`app/components/dashboard/DashboardNavbar.vue`)

Top navigation bar with search, notifications, and user menu.

**Features:**
- Global search bar (desktop)
- Mobile search toggle
- Notifications dropdown with badge
- User avatar menu dropdown
- Mobile menu toggle button
- Click-outside directive for dropdowns

**Events:**

```typescript
@toggle-sidebar  // Emitted when mobile menu button is clicked
```

**Example:**

```vue
<DashboardNavbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
```

---

### 4. DashboardCard (`app/components/dashboard/DashboardCard.vue`)

Reusable stat card for displaying metrics and KPIs.

**Features:**
- Icon with customizable colors
- Large value display
- Trend indicators (up/down/neutral)
- Optional badge
- Hover effects
- Footer slot for additional content

**Props:**

```typescript
interface Props {
  title: string                 // Card title
  value: string | number        // Main value to display
  icon: Component               // Lucide icon component
  iconBackground?: string       // Tailwind classes for icon bg
  iconColor?: string            // Tailwind classes for icon color
  trend?: {
    value: number              // Percentage change (+/-)
    label?: string             // Optional label (default: "vs last month")
  }
  badge?: string               // Optional badge text
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  prefix?: string              // Prefix for value (e.g., "$")
  suffix?: string              // Suffix for value (e.g., "/5")
}
```

**Example:**

```vue
<DashboardCard
  title="Total Revenue"
  :value="3420"
  prefix="$"
  :icon="DollarSign"
  icon-background="bg-gradient-to-br from-green-100 to-emerald-100"
  icon-color="text-green-600"
  :trend="{ value: 23.1, label: 'vs last month' }"
  badge="Live"
  badge-variant="success"
>
  <template #footer>
    <button class="text-sm text-cyan-600 hover:text-cyan-700">
      View details
    </button>
  </template>
</DashboardCard>
```

---

## Complete Page Example

See `app/pages/dashboard/overview.vue` for a complete implementation example.

```vue
<template>
  <NuxtLayout name="dashboard">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p class="text-slate-600">Overview of your metrics</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Total Bookings"
        :value="127"
        :icon="Calendar"
        :trend="{ value: 12.5 }"
      />

      <DashboardCard
        title="Revenue"
        :value="3420"
        prefix="$"
        :icon="DollarSign"
        :trend="{ value: 23.1 }"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Calendar, DollarSign } from 'lucide-vue-next'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
</script>
```

---

## Design System

### Color Scheme

- **Primary**: Cyan/Teal gradient (`from-cyan-500 to-teal-600`)
- **Grays**: Slate scale (`slate-50` through `slate-900`)
- **Accents**:
  - Success: `green-*`
  - Warning: `yellow-*`
  - Danger: `red-*`
  - Info: `cyan-*`

### Typography

- **Page Headings**: `text-3xl font-bold text-slate-900`
- **Section Headings**: `text-lg font-semibold text-slate-900`
- **Body Text**: `text-slate-600`
- **Small Text**: `text-sm text-slate-500`

### Spacing

- **Page Padding**: `p-4 sm:p-6 lg:p-8`
- **Card Padding**: `p-6`
- **Grid Gaps**: `gap-6`

### Responsive Breakpoints

- **Mobile**: Default (< 640px)
- **Tablet**: `sm:` (640px+)
- **Desktop**: `lg:` (1024px+)

---

## Icons

All icons are from `lucide-vue-next`. Common imports:

```vue
import {
  Home,
  Calendar,
  MessageSquare,
  User,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Building2,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  Plus
} from 'lucide-vue-next'
```

---

## File Structure

```
app/
├── layouts/
│   └── dashboard.vue                    # Main layout wrapper
├── components/
│   └── dashboard/
│       ├── DashboardSidebar.vue        # Left sidebar navigation
│       ├── DashboardNavbar.vue         # Top navigation bar
│       └── DashboardCard.vue           # Stat card component
└── pages/
    └── dashboard/
        ├── index.vue                    # Main dashboard page
        └── overview.vue                 # Example implementation
```

---

## Best Practices

1. **Use DashboardCard for metrics**: Consistent styling across all stat displays
2. **Keep sidebar items between 4-8**: Avoid overwhelming users
3. **Use trend indicators**: Help users understand changes at a glance
4. **Mobile-first**: Test on mobile viewports regularly
5. **Consistent spacing**: Use the Tailwind spacing scale (4, 6, 8)
6. **Semantic HTML**: Use proper heading hierarchy
7. **Accessibility**: Ensure keyboard navigation works

---

## Customization

### Changing the Primary Color

To change from cyan/teal to another color:

1. Update the logo gradient in `DashboardSidebar.vue`:
   ```vue
   bg-gradient-to-br from-cyan-500 to-teal-600
   ```

2. Update active states in sidebar:
   ```vue
   bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-700
   ```

3. Update navbar and card colors as needed

### Adding New Navigation Items

Edit the `navigationItems` array in `dashboard.vue`:

```vue
const navigationItems = ref([
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart, badge: 2 },
  // Add more items...
])
```

---

## Performance Considerations

- **Lazy loading**: Components auto-import via Nuxt
- **Tree shaking**: Only imported icons are bundled
- **CSS**: Tailwind purges unused styles
- **Transitions**: CSS-based for 60fps animations
- **Mobile optimization**: Sidebar hidden by default on mobile

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

---

## Dependencies

- **Nuxt 4**: Framework
- **Vue 3**: Composition API
- **Tailwind CSS**: Styling
- **lucide-vue-next**: Icons
- **@/components/ui/***: shadcn-vue components (Button, Input, etc.)
