# Dashboard Layout - Quick Start Guide

## Files Created

```
app/
├── layouts/
│   └── dashboard.vue                    # Main dashboard layout
├── components/
│   └── dashboard/
│       ├── Sidebar.vue                  # Desktop sidebar with collapse
│       ├── Header.vue                   # Top header with notifications
│       └── MobileNav.vue                # Bottom mobile navigation
└── pages/
    └── examples/
        ├── user-dashboard.vue           # Example: User dashboard
        ├── provider-dashboard.vue       # Example: Provider dashboard
        └── admin-dashboard.vue          # Example: Admin dashboard
```

## Quick Usage

### 1. Basic Usage (Default Navigation)

```vue
<template>
  <div>
    <h1>My Page</h1>
    <!-- Your content -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>
```

### 2. Custom Navigation (Provider Example)

Create `app/layouts/provider.vue`:

```vue
<template>
  <DashboardLayout
    :navigation-items="providerNav"
    :user="currentUser"
  >
    <slot />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { Building2, Calendar, DollarSign, Settings } from 'lucide-vue-next'
import DashboardLayout from './dashboard.vue'

const providerNav = [
  { name: 'Properties', href: '/manage/properties', icon: Building2 },
  { name: 'Bookings', href: '/manage/bookings', icon: Calendar, badge: 5 },
  { name: 'Earnings', href: '/manage/earnings', icon: DollarSign },
  { name: 'Settings', href: '/manage/settings', icon: Settings },
]

const currentUser = {
  name: 'Provider Name',
  email: 'provider@example.com',
  initials: 'PN'
}
</script>
```

Then use it:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'provider'
})
</script>
```

## Available Icons

Import from `lucide-vue-next`:

```typescript
// Common navigation icons
Home, LayoutDashboard, Building2, Calendar, MessageSquare,
User, Settings, Search, Bell, Menu

// Feature icons
DollarSign, Star, Users, FileText, Clock, Heart, MapPin,
ShieldCheck, AlertCircle, CheckCircle, Plus, ChevronRight
```

## Component Props

```typescript
// Navigation Item
{
  name: string       // "Dashboard"
  href: string       // "/dashboard"
  icon: any         // Home (from lucide-vue-next)
  badge?: number    // 5 (optional)
}

// User Info
{
  name: string       // "John Doe"
  email: string      // "john@example.com"
  initials: string   // "JD"
  avatar?: string    // URL (optional)
  role?: string      // "user", "provider", "admin"
}
```

## Key Features

✅ **Responsive Design**
- Desktop: Collapsible sidebar (full width or icon-only)
- Mobile: Hamburger menu + bottom tab navigation

✅ **Modern UI**
- Slate color scheme matching existing auth pages
- Rounded corners (rounded-2xl)
- Smooth transitions and animations
- Gradient accents (cyan to teal)

✅ **Components Included**
- Sidebar with logo, navigation, and user profile
- Header with search, notifications, and user menu
- Mobile bottom navigation bar
- All components use shadcn-nuxt UI primitives

✅ **Smart Navigation**
- Active state highlighting
- Badge indicators for counts
- Icon-only mode with tooltips
- Mobile-optimized (top 4 items only)

## View Examples

Visit these pages to see the dashboard in action:

- **User Dashboard**: `/examples/user-dashboard`
- **Provider Dashboard**: `/examples/provider-dashboard`
- **Admin Dashboard**: `/examples/admin-dashboard`

## Styling Classes

The dashboard uses these key Tailwind classes:

```css
/* Background */
.bg-slate-50          /* Page background */
.bg-white             /* Cards and sidebar */

/* Primary Colors */
.from-cyan-500        /* Gradient start */
.to-teal-600          /* Gradient end */
.text-cyan-600        /* Active state */

/* Borders & Shadows */
.border-slate-200     /* Subtle borders */
.rounded-2xl          /* Rounded corners */
.shadow-xl            /* Card shadows */

/* Spacing */
.p-4 sm:p-6 lg:p-8   /* Responsive padding */
```

## Mobile Navigation

The mobile nav automatically:
- Shows at bottom on screens < 1024px
- Displays top 4 navigation items
- Hides on desktop
- Includes iOS safe area support

To adjust which items appear on mobile, modify the `mobileNavigationItems` computed property in `dashboard.vue`.

## Next Steps

1. **Integrate with Auth**: Connect user data from your auth store
2. **Customize Colors**: Adjust gradient and accent colors if needed
3. **Add Notifications**: Implement real notification fetching
4. **Create Role Layouts**: Make layouts for user/provider/admin roles
5. **Add Middleware**: Protect routes based on user role

## Need Help?

See the full documentation: `DASHBOARD_LAYOUT_README.md`
