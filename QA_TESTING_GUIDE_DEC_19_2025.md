# MyWaterCloset - Comprehensive QA Testing Guide
## December 19, 2025

---

## Table of Contents
1. [Test Environment Setup](#1-test-environment-setup)
2. [Authentication & User Management](#2-authentication--user-management)
3. [Home Page Functionality](#3-home-page-functionality)
4. [Search & Discovery](#4-search--discovery)
5. [Property Details & Booking](#5-property-details--booking)
6. [Stripe Payments & Checkout](#6-stripe-payments--checkout)
7. [Webhook Verification](#7-webhook-verification)
8. [Provider Dashboard (/manage)](#8-provider-dashboard-manage)
9. [Frontend Admin Panel (/admin)](#9-frontend-admin-panel-admin)
10. [Payload CMS Admin (/payload-admin)](#10-payload-cms-admin-payload-admin)
11. [Mobile Responsiveness](#11-mobile-responsiveness)
12. [Performance & Error Handling](#12-performance--error-handling)
13. [Security Testing](#13-security-testing)

---

## 1. Test Environment Setup

### Deployed URLs
- **Frontend**: [YOUR_DEPLOYED_FRONTEND_URL]
- **API/Admin**: [YOUR_DEPLOYED_API_URL]/admin

### Test Credentials

#### Super Admin Account (for /admin access)
```
Email: foodeater563@gmail.com
Password: Test1234!
Role: admin
```

#### Test Provider Account (for /manage access)
```
Email: testprovider@gmail.com
Password: Test1234!
Role: provider
```

#### Legacy Provider Account
```
Email: provider@provider.provider
Password: provider123
Role: provider
```

#### Test Customer Account
```
Email: enjoyer@enjoyer.enjoyer
Password: enjoyer123
Role: user
```

### Stripe Test Mode
- **Test Card (Success)**: `4242 4242 4242 4242`
- **Test Card (Decline)**: `4000 0000 0000 0002`
- **Test Card (Requires Auth)**: `4000 0025 0000 3155`
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

---

## 2. Authentication & User Management

### 2.1 Registration Flow
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Email Registration | 1. Click "Get Started" → 2. Fill registration form → 3. Submit | Account created, redirected to dashboard | [ ] |
| Duplicate Email | Try registering with existing email | Error message shown | [ ] |
| Invalid Email Format | Enter invalid email format | Validation error shown | [ ] |
| Weak Password | Enter password < 8 chars | Validation error shown | [ ] |
| Password Confirmation | Mismatched passwords | Validation error shown | [ ] |

### 2.2 Login Flow
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Valid Login | Enter valid credentials → Click Sign In | Redirected to dashboard | [ ] |
| Invalid Credentials | Enter wrong password | Error message shown | [ ] |
| Remember Me | Check "Remember Me" → Login → Close/reopen browser | Session persisted | [ ] |
| Logout | Click logout button | Session cleared, redirected to home | [ ] |

### 2.3 Password Reset
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Request Reset | Click "Forgot Password" → Enter email → Submit | Reset email sent | [ ] |
| Reset Link | Click reset link in email | Redirected to reset form | [ ] |
| Set New Password | Enter new password → Confirm → Submit | Password updated, can login | [ ] |

### 2.4 OAuth/Social Login (if implemented)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Google Login | Click "Sign in with Google" | OAuth flow completes | [ ] |
| New Google User | First-time Google login | Account created automatically | [ ] |

---

## 3. Home Page Functionality

### 3.1 Hero Section
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Page Load | Navigate to homepage | Hero text, map loads correctly | [ ] |
| CTA Buttons | Click "Find a Restroom" / "Become a Provider" | Correct navigation | [ ] |
| Stats Display | Check "12,400+ restrooms available" | Stats rendered correctly | [ ] |

### 3.2 Location Detection
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Auto-detect on Load | Load page with location enabled | Browser prompts for location | [ ] |
| Grant Permission | Click "Allow" on browser prompt | Location detected, map updates | [ ] |
| Deny Permission | Click "Block" on browser prompt | Shows "Enable location" message | [ ] |
| Manual Detect Button | Click "Detect My Location" button | Browser prompts for location | [ ] |
| Re-request after Deny | Previously denied → Click detect | Shows browser settings message | [ ] |

### 3.3 Location Search
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Search Input | Type location in search box | Autocomplete suggestions appear | [ ] |
| Select Suggestion | Click on autocomplete suggestion | Location updates, map centers | [ ] |
| Clear Search | Click X button in search | Input cleared | [ ] |
| Search with Enter | Type location → Press Enter | Searches for location | [ ] |

### 3.4 Interactive Map (Hero)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Map Loads | Wait for map to load | Google Map renders with markers | [ ] |
| Price Markers | Check markers on map | Shows prices like "$0.19" | [ ] |
| Marker Hover | Hover over a marker | Tooltip shows property preview | [ ] |
| Marker Click | Click on a marker | Property drawer opens | [ ] |
| User Location | Check blue marker | Shows pulsing user location dot | [ ] |
| Bathroom Count Badge | Check top-left badge | Shows "X bathrooms found" | [ ] |

### 3.5 Properties Near Me Section
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Section Display | Scroll below hero | "Properties Near You" section visible | [ ] |
| Property Count | Check heading | Shows "Found X bathrooms near [location]" | [ ] |
| Property Cards | View cards in carousel | Shows image, name, price, rating, distance | [ ] |
| Distance Format | Check distance on cards | Shows in miles (e.g., "0.6 mi", "1.2 mi") | [ ] |
| Price Format | Check price on cards | Shows in dollars (e.g., "$11.40/hour") | [ ] |
| Carousel Scroll | Click arrow buttons | Carousel scrolls smoothly | [ ] |
| See All Link | Click "See All →" | Navigates to /search | [ ] |
| Card Click | Click on property card | Navigates to property details | [ ] |

### 3.6 Other Home Sections
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| How It Works | Check tabs section | 3 tabs: Find, Book, Enjoy | [ ] |
| Tab Switching | Click each tab | Content updates correctly | [ ] |
| Features Section | Scroll to features | Feature cards display correctly | [ ] |
| Accessibility | Check accessibility section | Icons and text render | [ ] |
| Footer | Scroll to footer | Links, social icons visible | [ ] |

---

## 4. Search & Discovery

### 4.1 Search Page Layout
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Page Load | Navigate to /search | Page loads with map and listings | [ ] |
| Filter Sidebar | Check left sidebar | Filters visible on desktop | [ ] |
| Property Grid | Check center section | Property cards in grid | [ ] |
| Map View | Check right side | Map with markers visible | [ ] |

### 4.2 Search Functionality
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Location Search | Enter location in search | Results update for area | [ ] |
| Search This Area | Pan map → Click "Search this area" | Results update for new area | [ ] |
| URL Params | Check URL after search | Contains lat, lng, location params | [ ] |
| Shareable URL | Copy URL → Open in new tab | Same search results shown | [ ] |

### 4.3 Map Interactions (Search Page)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Map Markers | Check markers on map | Blue pills with "$X.XX/min" prices | [ ] |
| Marker Click | Click a marker | Info window shows, card highlights | [ ] |
| Marker Hover | Hover over marker | Marker scales up | [ ] |
| Map Pan/Zoom | Pan and zoom map | "Search this area" button appears | [ ] |
| Fit to Markers | Load results | Map fits to show all markers | [ ] |

### 4.4 Filter Functionality
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Price Range | Adjust price slider | Results filtered by price | [ ] |
| Property Type | Select type checkboxes | Results filtered by type | [ ] |
| Amenities | Select amenity checkboxes | Results filtered by amenities | [ ] |
| Minimum Rating | Select star rating | Results filtered by rating | [ ] |
| Filter Count Badge | Apply filters | Badge shows active filter count | [ ] |
| Clear Filters | Reset all filters | All results shown | [ ] |
| Mobile Filters | Click filter icon (mobile) | Filter drawer opens | [ ] |

### 4.5 View Modes
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Grid View | Click grid icon | Properties in grid layout | [ ] |
| List View | Click list icon | Properties in list layout | [ ] |
| Mobile Map Toggle | Click map/list toggle (mobile) | Switches between views | [ ] |

### 4.6 Results Display
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Results Count | Check count text | Shows "X bathrooms available" | [ ] |
| Loading State | Trigger new search | Loading spinner shown | [ ] |
| Empty State | Search remote area | "No bathrooms found" message | [ ] |
| Property Card Info | Check card content | Image, name, price, rating, type | [ ] |

---

## 5. Property Details & Booking

### 5.1 Property Detail Page
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Page Load | Click on property → View details | Full property page loads | [ ] |
| Photo Gallery | View property photos | Images display correctly | [ ] |
| Property Info | Check name, description, amenities | All info renders correctly | [ ] |
| Location Map | Check embedded map | Shows property location | [ ] |
| Availability Calendar | Check calendar | Shows available time slots | [ ] |
| Reviews Section | Scroll to reviews | Reviews display with ratings | [ ] |

### 5.2 Booking Flow
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Select Date | Click on calendar date | Date selected, times shown | [ ] |
| Select Time Slot | Click available time slot | Slot selected/highlighted | [ ] |
| Book Now Button | Click "Book Now" | Proceeds to checkout | [ ] |
| Price Calculation | Check booking summary | Correct price shown | [ ] |
| Guest Checkout | Complete booking without account | Booking completes | [ ] |
| Logged-in Booking | Complete booking while logged in | Booking linked to account | [ ] |

---

## 6. Stripe Payments & Checkout

### 6.1 Checkout Page
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Checkout Load | Proceed to checkout | Stripe Elements loads | [ ] |
| Order Summary | Check booking details | Correct property, time, price | [ ] |
| Payment Form | View payment form | Card input fields visible | [ ] |

### 6.2 Payment Processing
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Successful Payment | Use test card 4242... | Payment succeeds, confirmation shown | [ ] |
| Declined Card | Use test card 4000...0002 | Decline error shown | [ ] |
| 3D Secure | Use test card 4000...3155 | 3DS modal appears, complete auth | [ ] |
| Invalid Card | Enter invalid card number | Validation error shown | [ ] |
| Expired Card | Enter past expiry date | Validation error shown | [ ] |

### 6.3 Post-Payment
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Success Page | Complete payment | Redirected to success page | [ ] |
| Booking Confirmation | Check confirmation details | Correct booking info shown | [ ] |
| Email Confirmation | Check email inbox | Confirmation email received | [ ] |
| Booking in Dashboard | Login → View bookings | New booking appears | [ ] |

---

## 7. Webhook Verification

### 7.1 Stripe Webhooks
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| payment_intent.succeeded | Complete test payment | Webhook received, booking created | [ ] |
| payment_intent.failed | Use decline card | Webhook received, logged | [ ] |
| checkout.session.completed | Complete Checkout Session | Booking status updated | [ ] |

### 7.2 Webhook Logs
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Stripe Dashboard | Check Stripe → Developers → Webhooks | Events show 200 responses | [ ] |
| API Logs | Check server logs | Webhook processing logged | [ ] |
| Database Update | Check bookings in admin | Booking status correct | [ ] |

### 7.3 Manual Webhook Test
```bash
# Test webhook endpoint (use Stripe CLI for local/staging)
stripe listen --forward-to YOUR_API_URL/api/webhooks/stripe

# Trigger test event
stripe trigger payment_intent.succeeded
```

---

## 8. Provider Dashboard (/manage)

**URL**: `/manage`
**Required Role**: `provider`
**Test Account**: Login with a provider account

### 8.1 Dashboard Access
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Dashboard Load | Login as provider → Navigate to /manage | Provider dashboard loads | [ ] |
| Sidebar Navigation | Check sidebar menu | Properties, Bookings, Earnings, Reviews, Settings | [ ] |
| Stats Overview | View dashboard home | Total Earned, This Month, Pending Payouts | [ ] |
| Performance Stats | Check stats section | Total Bookings, Active Listings, Average Rating | [ ] |
| Quick Actions | Check quick action buttons | Add Property, View Earnings, Manage Availability | [ ] |

### 8.2 Stripe Connect Integration
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Stripe Alert (No Account) | View dashboard without Stripe | Blue alert: "Connect Stripe to Get Paid" | [ ] |
| Stripe Alert (Incomplete) | Partially set up Stripe | Yellow alert: "Complete Your Stripe Setup" | [ ] |
| Dismiss Alert | Click "Dismiss" button | Alert hidden, preference saved | [ ] |
| Connect Stripe | Click "Connect Stripe Now" | Redirects to /manage/settings?tab=payouts | [ ] |

### 8.3 Property Management
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View Properties | Click "Properties" in sidebar | List of properties shown | [ ] |
| Add Property | Click "Add Property" → /manage/properties/new | Property creation form opens | [ ] |
| Edit Property | Click property → /manage/properties/[id] | Edit form with existing data | [ ] |
| Property Cards | View property grid | Image, title, price, rating, bookings count | [ ] |
| Property Status Badge | Check property status | "Active" badge on active properties | [ ] |
| Upload Photos | Add photos to property | Photos upload and display | [ ] |

### 8.4 Booking Management
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View Bookings | Click "Bookings" in sidebar → /manage/bookings | Booking list with table shown | [ ] |
| Recent Bookings | Check dashboard recent section | Last 5 bookings in table | [ ] |
| Booking Table Columns | Check table headers | Guest, Property, Date & Time, Duration, Amount, Status, Actions | [ ] |
| Booking Status Badges | Check status colors | Confirmed=blue, Pending=yellow, Completed=green, Cancelled=red | [ ] |
| View Booking | Click "View" action | Full booking details displayed | [ ] |

### 8.5 Earnings & Payouts
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View Earnings | Navigate to /manage/earnings | Revenue summary shown | [ ] |
| Earnings Cards | Check dashboard earnings | Total Earned, This Month, Pending Payouts | [ ] |
| Payout History | View payout history | Past payouts listed | [ ] |
| Stripe Connect | Check Stripe account link | Account connected/setup | [ ] |

### 8.6 Reviews & Ratings
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View Reviews | Navigate to /manage/reviews | Customer reviews shown | [ ] |
| Respond to Review | Add response to review | Response saved and displayed | [ ] |
| Average Rating | Check rating on dashboard | Correct average shown | [ ] |

### 8.7 Provider Settings
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Settings Page | Navigate to /manage/settings | Settings page loads | [ ] |
| Payout Settings | Click payouts tab | Stripe Connect settings | [ ] |
| Profile Settings | Update business info | Changes saved | [ ] |

---

## 9. Frontend Admin Panel (/admin)

**URL**: `/admin`
**Required Role**: `admin`
**Test Account**: `foodeater563@gmail.com` / `Test1234!`

> **Note**: This is the simplified frontend admin interface for non-technical users. For the full Payload CMS admin, see Section 10.

### 9.1 Admin Dashboard Access
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Admin Login | Login with admin account → Navigate to /admin | Admin dashboard loads | [ ] |
| Non-Admin Redirect | Login as user/provider → Navigate to /admin | Redirected to home page | [ ] |
| Unauthenticated Access | Navigate to /admin without login | Redirected to /login | [ ] |
| Dashboard Layout | View admin dashboard | Red-themed sidebar, stats, charts | [ ] |

### 9.2 Admin Dashboard Stats
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Total Users Stat | Check stats cards | Shows total user count | [ ] |
| Total Providers Stat | Check stats cards | Shows provider count | [ ] |
| Total Bookings Stat | Check stats cards | Shows booking count | [ ] |
| Platform Revenue Stat | Check stats cards | Shows revenue in dollars | [ ] |
| Stats Loading | Refresh page | Stats load from API | [ ] |

### 9.3 Alerts & Notifications
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Pending Properties Alert | Have pending properties | Orange alert: "X properties pending approval" | [ ] |
| Alert Click | Click alert link | Navigates to /admin/properties?status=pending | [ ] |
| No Alerts | No pending items | Alert section hidden | [ ] |

### 9.4 Quick Actions
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Manage Users | Click "Manage Users" | Navigates to /admin/users | [ ] |
| Review Properties | Click "Review Properties" | Navigates to /admin/properties | [ ] |
| View Bookings | Click "View Bookings" | Navigates to /admin/bookings | [ ] |
| Analytics | Click "Analytics" | Navigates to /admin/analytics | [ ] |
| Platform Settings | Click "Platform Settings" | Navigates to /admin/settings | [ ] |

### 9.5 Admin Sidebar Navigation
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Dashboard Link | Click "Dashboard" | Navigates to /admin | [ ] |
| Users Link | Click "Users" | Navigates to /admin/users | [ ] |
| Properties Link | Click "Properties" | Navigates to /admin/properties | [ ] |
| Bookings Link | Click "Bookings" | Navigates to /admin/bookings | [ ] |
| Provider Requests Link | Click "Provider Requests" | Navigates to /admin/provider-requests | [ ] |
| Refund Requests Link | Click "Refund Requests" | Navigates to /admin/refund-requests | [ ] |
| Analytics Link | Click "Analytics" | Navigates to /admin/analytics | [ ] |
| Settings Link | Click "Settings" | Navigates to /admin/settings | [ ] |
| Badge Counts | Check sidebar badges | Shows counts for pending items | [ ] |

### 9.6 Users Management (/admin/users)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Users List | Navigate to /admin/users | User list with table | [ ] |
| User Details | Click on user | Navigates to /admin/users/[id] | [ ] |
| Filter by Role | Filter users by role | Results filtered correctly | [ ] |
| Search Users | Search by name/email | Results filtered correctly | [ ] |

### 9.7 Properties Management (/admin/properties)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Properties List | Navigate to /admin/properties | Property list displayed | [ ] |
| Property Details | Click on property | Navigates to /admin/properties/[id] | [ ] |
| Approve Property | Approve pending property | Status changes to active | [ ] |
| Reject Property | Reject pending property | Status changes to inactive | [ ] |
| Toggle Featured | Toggle featured status | Featured badge updates | [ ] |
| Suspend Property | Suspend active property | Status changes to suspended | [ ] |
| Filter by Status | Filter pending/active/suspended | Results filtered correctly | [ ] |

### 9.8 Bookings Management (/admin/bookings)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Bookings List | Navigate to /admin/bookings | Booking list with table | [ ] |
| Booking Details | Click on booking | Full booking details | [ ] |
| Filter by Status | Filter by status | Results filtered correctly | [ ] |

### 9.9 Provider Requests (/admin/provider-requests)
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Requests List | Navigate to /admin/provider-requests | Provider request list | [ ] |
| Approve Request | Approve provider request | User role updated to provider | [ ] |
| Reject Request | Reject provider request | Request marked as rejected | [ ] |

### 9.10 Mobile Admin
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Mobile Sidebar | Toggle sidebar on mobile | Sidebar slides in/out | [ ] |
| Mobile Bottom Nav | Check mobile bottom nav | Dashboard, Users, Properties, Bookings | [ ] |
| Responsive Layout | Resize to mobile | Layout adapts correctly | [ ] |

---

## 10. Payload CMS Admin (/payload-admin)

**URL**: `/payload-admin` or `API_URL/admin`
**Required Role**: Payload admin user

> **Note**: This is the full Payload CMS admin interface for developers/technical users.

### 10.1 Admin Access
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Admin Login | Navigate to /payload-admin → Login | Payload admin dashboard loads | [ ] |
| Dashboard View | View admin home | Stats and quick actions | [ ] |
| Sidebar Collections | Check sidebar | All collections listed | [ ] |

### 10.2 Collections Management
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Users | View/Edit users | CRUD operations work | [ ] |
| Properties | View/Edit properties | CRUD operations work | [ ] |
| Bookings | View/Edit bookings | CRUD operations work | [ ] |
| Reviews | View/Edit reviews | CRUD operations work | [ ] |
| Media | View/Upload media | File uploads work | [ ] |

### 10.3 Content Management
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Create Property | Admin creates property | Property appears in listings | [ ] |
| Edit Property | Modify property details | Changes reflected | [ ] |
| Delete Property | Remove property | No longer in listings | [ ] |
| Bulk Actions | Select multiple → Action | Bulk operation succeeds | [ ] |

### 10.4 User Management
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| View All Users | Navigate to Users | User list displayed | [ ] |
| Create User | Create new user | User can login | [ ] |
| Edit User Role | Change user role | Permissions updated | [ ] |
| Disable User | Deactivate account | User cannot login | [ ] |

---

## 11. Mobile Responsiveness

### 11.1 Breakpoints
| Screen Size | Test Steps | Expected Result | Status |
|-------------|------------|-----------------|--------|
| Mobile (375px) | Resize to 375px | Mobile layout, hamburger menu | [ ] |
| Tablet (768px) | Resize to 768px | Tablet layout adjustments | [ ] |
| Desktop (1024px+) | Resize to 1024px+ | Full desktop layout | [ ] |

### 11.2 Mobile Navigation
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Hamburger Menu | Tap menu icon | Mobile menu opens | [ ] |
| Menu Links | Tap menu items | Correct navigation | [ ] |
| Close Menu | Tap X or outside | Menu closes | [ ] |

### 11.3 Mobile-Specific Features
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Map/List Toggle | Tap toggle (search) | Switches views correctly | [ ] |
| Filter Drawer | Tap filter icon | Drawer slides in | [ ] |
| Bottom Sheet | View map (search) | Property cards in bottom sheet | [ ] |
| Touch Gestures | Swipe carousel | Smooth scrolling | [ ] |

---

## 12. Performance & Error Handling

### 12.1 Load Times
| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| Home Page Load | < 3 seconds | | [ ] |
| Search Page Load | < 3 seconds | | [ ] |
| Property Details Load | < 2 seconds | | [ ] |
| Map Markers Load | < 2 seconds | | [ ] |

### 12.2 Error States
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| 404 Page | Navigate to /nonexistent | 404 page shown | [ ] |
| API Error | Simulate API failure | Error message shown | [ ] |
| Network Offline | Disable network | Offline message shown | [ ] |
| Invalid Property | Navigate to /properties/invalid | 404 or error page | [ ] |

### 12.3 Edge Cases
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Empty Search | Search in ocean | "No results" message | [ ] |
| Special Characters | Search "New York's Best" | Handles correctly | [ ] |
| Very Long Address | Enter extremely long address | Truncates gracefully | [ ] |
| Rapid Clicks | Click button multiple times | No duplicate actions | [ ] |

---

## 13. Security Testing

### 13.1 Authentication Security
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Session Timeout | Leave idle for timeout period | Session expires, login required | [ ] |
| Invalid Token | Use expired/invalid JWT | Rejected, redirected to login | [ ] |
| Protected Routes | Access /dashboard without login | Redirected to login | [ ] |

### 13.2 Input Validation
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| XSS Prevention | Enter `<script>` in inputs | Sanitized, not executed | [ ] |
| SQL Injection | Enter SQL in search | No database exposure | [ ] |
| CSRF Protection | Check form tokens | CSRF tokens present | [ ] |

### 13.3 API Security
| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Rate Limiting | Send many requests quickly | Rate limit error returned | [ ] |
| CORS | Check API CORS headers | Correct origins allowed | [ ] |
| Sensitive Data | Check API responses | No sensitive data exposed | [ ] |

---

## Test Execution Log

### Session Information
- **Tester Name**: _______________
- **Test Date**: _______________
- **Environment**: _______________
- **Browser/Device**: _______________

### Summary
- **Total Test Cases**: ___
- **Passed**: ___
- **Failed**: ___
- **Blocked**: ___

### Issues Found
| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|
| | | | |
| | | | |
| | | | |

### Sign-off
- **QA Tester**: _______________  Date: _______________
- **Developer**: _______________  Date: _______________
- **PM**: _______________  Date: _______________

---

## Appendix

### A. Test Data Setup
```sql
-- Sample test data (if needed for testing)
-- Run these in development/staging only
```

### B. Environment Variables Required
```env
# Frontend
NUXT_PUBLIC_API_URL=
NUXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Backend
DATABASE_URI=
PAYLOAD_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
GOOGLE_MAPS_API_KEY=
```

### C. Useful Commands
```bash
# Start local dev
pnpm dev

# Run tests
pnpm test

# Check Stripe webhooks
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# View logs
tail -f logs/app.log
```
