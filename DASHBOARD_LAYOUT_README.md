# Dashboard Layout System

This document explains how to use the shared dashboard layout components in the MyWaterCloset Nuxt 4 application.

## Overview

The dashboard layout system consists of:

1. **Main Layout** (`app/layouts/dashboard.vue`) - The container layout
2. **Sidebar** (`app/components/dashboard/Sidebar.vue`) - Desktop navigation sidebar with collapse functionality
3. **Header** (`app/components/dashboard/Header.vue`) - Top header with search, notifications, and user menu
4. **MobileNav** (`app/components/dashboard/MobileNav.vue`) - Bottom tab navigation for mobile devices

## Features

### Sidebar
- Collapsible on desktop (collapses to icon-only mode)
- Slide-out drawer on mobile
- Logo with brand gradient
- Navigation items with icons, labels, and optional badges
- Active state highlighting with gradient background
- User profile section at bottom with logout
- Smooth transitions and animations
- Tooltips in collapsed state

### Header
- Mobile hamburger menu toggle
- Search bar (hideable on mobile)
- Notifications dropdown with badge counter
- User avatar dropdown menu
- Sticky positioning
- Click-outside-to-close functionality

### Mobile Navigation
- Fixed bottom tab bar
- Shows top 4 navigation items
- Badge indicators
- Active state with gradient top border
- Touch-friendly tap targets
- iOS safe area support

## Basic Usage

### 1. Using the Default Layout

The simplest way to use the dashboard layout is with the default navigation items:

```vue
<template>
  <div>
    <h1>My Dashboard Page</h1>
    <!-- Your content here -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>
```

This will use the default user navigation items:
- Dashboard
- Bookings
- Messages
- Profile
- Settings

### 2. Custom Navigation Items

To customize navigation items for different user roles, you'll need to pass props to the layout. In Nuxt, this is typically done by creating a custom layout or using page-level configuration.

#### Example: Provider Dashboard

Create a custom layout file `app/layouts/provider-dashboard.vue`:

```vue
<template>
  <DashboardLayout
    :navigation-items="providerNavigation"
    :user="user"
  >
    <slot />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { LayoutDashboard, Building2, Calendar, DollarSign, Star, MessageSquare, Settings } from 'lucide-vue-next'
import DashboardLayout from './dashboard.vue'

const providerNavigation = [
  { name: 'Dashboard', href: '/manage', icon: LayoutDashboard },
  { name: 'Properties', href: '/manage/properties', icon: Building2, badge: 2 },
  { name: 'Bookings', href: '/manage/bookings', icon: Calendar, badge: 5 },
  { name: 'Earnings', href: '/manage/earnings', icon: DollarSign },
  { name: 'Reviews', href: '/manage/reviews', icon: Star },
  { name: 'Messages', href: '/manage/messages', icon: MessageSquare, badge: 3 },
  { name: 'Settings', href: '/manage/settings', icon: Settings },
]

// In a real app, this would come from your auth store
const user = {
  name: 'Provider Name',
  email: 'provider@example.com',
  initials: 'PN',
  role: 'provider'
}
</script>
```

Then use it in your page:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'provider-dashboard'
})
</script>
```

#### Example: Admin Dashboard

Create `app/layouts/admin-dashboard.vue`:

```vue
<template>
  <DashboardLayout
    :navigation-items="adminNavigation"
    :user="user"
  >
    <slot />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { LayoutDashboard, Users, Building2, Calendar, FileText, DollarSign, Settings } from 'lucide-vue-next'
import DashboardLayout from './dashboard.vue'

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Providers', href: '/admin/providers', icon: Building2, badge: 5 },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Refunds', href: '/admin/refund-requests', icon: DollarSign, badge: 3 },
  { name: 'Reports', href: '/admin/reports', icon: FileText, badge: 12 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

const user = {
  name: 'Admin User',
  email: 'admin@example.com',
  initials: 'AU',
  role: 'admin'
}
</script>
```

## Component Props

### Dashboard Layout Props

```typescript
interface NavigationItem {
  name: string        // Display name
  href: string        // Route path
  icon: any          // Lucide icon component
  badge?: number     // Optional badge count
}

interface UserInfo {
  name: string        // User's full name
  email: string       // User's email
  avatar?: string     // Optional avatar URL
  initials: string    // Initials for avatar placeholder
  role?: 'user' | 'provider' | 'admin'  // User role
}

interface Props {
  navigationItems?: NavigationItem[]  // Custom nav items
  user?: UserInfo                     // User information
}
```

### Default Values

If no props are provided, the layout uses these defaults:

```typescript
// Default User Info
{
  name: 'John Doe',
  email: 'john@example.com',
  initials: 'JD',
  role: 'user'
}

// Default Navigation Items (User Dashboard)
[
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar, badge: 3 },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: 5 },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]
```

## Styling & Design

### Color Scheme
- Primary: Cyan/Teal gradient (`from-cyan-500 to-teal-600`)
- Background: Slate 50 (`bg-slate-50`)
- Cards: White with rounded-2xl corners
- Borders: Slate 200
- Text: Slate 900 (primary), Slate 600 (secondary)

### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px
- Desktop: > 1024px (lg)

### Layout Spacing
- Sidebar width: 256px (64 on desktop when collapsed, 80px icon-only)
- Header height: 64px (h-16)
- Mobile nav height: 64px + safe area
- Content padding: 16px (mobile), 24px (tablet), 32px (desktop)

## Icons

The layout uses `lucide-vue-next` for icons. Available icons include:

- Navigation: `Home`, `LayoutDashboard`, `Building2`, `Calendar`, `MessageSquare`, `User`, `Settings`
- Actions: `Search`, `Bell`, `ChevronDown`, `LogOut`, `Plus`, `ChevronRight`
- Stats: `DollarSign`, `Star`, `Users`, `FileText`, `Clock`, `Heart`
- Status: `ShieldCheck`, `AlertCircle`, `CheckCircle`

## Example Pages

Three example pages are included to demonstrate different dashboard types:

1. **User Dashboard** - `/examples/user-dashboard`
   - Shows user-focused features (bookings, favorites, reviews)

2. **Provider Dashboard** - `/examples/provider-dashboard`
   - Shows provider-focused features (properties, earnings, reviews)

3. **Admin Dashboard** - `/examples/admin-dashboard`
   - Shows admin-focused features (users, providers, refunds, system stats)

## Mobile Considerations

### Bottom Navigation
- Only shows top 4 navigation items
- Settings and less-used items are hidden
- Accessible via hamburger menu

### Touch Targets
- Minimum 44x44px tap targets
- Increased spacing on mobile
- Active state feedback

### Safe Areas
- iOS notch/home indicator support
- Proper padding for safe areas

## Integration with Auth

To integrate with your authentication system:

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const user = computed(() => ({
  name: authStore.user?.name || 'Guest',
  email: authStore.user?.email || '',
  initials: authStore.user?.initials || 'G',
  role: authStore.user?.role || 'user',
  avatar: authStore.user?.avatar
}))

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/login')
}
</script>
```

## Notifications

The header includes a notifications dropdown. To customize:

```typescript
// In your Header component or composable
const notifications = ref([
  {
    id: 1,
    message: 'New booking request',
    time: '5 minutes ago',
    read: false,
    icon: Calendar,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  }
])
```

## Best Practices

1. **Navigation Items**: Keep 5-7 main items max for best UX
2. **Badges**: Use sparingly, only for actionable items
3. **User Menu**: Include Profile, Settings, Help, and Logout
4. **Search**: Provide context-appropriate placeholder text
5. **Mobile**: Test on actual devices, not just browser DevTools
6. **Performance**: Icons are tree-shakeable, only import what you use
7. **Accessibility**: All interactive elements have proper ARIA labels

## Troubleshooting

### Sidebar not showing on mobile
- Check that `sidebarOpen` state is being toggled
- Verify z-index values aren't conflicting

### Navigation items not active
- Ensure `href` matches your route exactly
- Check `isActive` function logic

### Layout shifts
- Add `pb-16 lg:pb-0` to main content for mobile nav spacing
- Use sticky positioning for header

### Icons not displaying
- Verify lucide-vue-next is installed
- Check icon import names (case-sensitive)

## Future Enhancements

Potential improvements:

1. Dark mode support
2. Customizable themes
3. Saved sidebar state (localStorage)
4. Real-time notification updates
5. Advanced search with filters
6. Keyboard shortcuts
7. Breadcrumb navigation
8. Multi-level navigation support
