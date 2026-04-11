# EduOrg Website - Project TODO

## Core Features

### Home Page
- [x] Hero section with background image and CTA button
- [x] Programs grid (6 cards: Bootcamp, Sports, Clubs, Library, Outreach, Day-in)
- [x] About section with organization description
- [x] Contact form with validation
- [x] Team section (Teachers, Managers, Club Coordinators)
- [x] Footer with links and contact info

### Program Pages (6 pages)
- [x] Bootcamp page with statistics, updates, gallery
- [x] Sports page with statistics, updates, gallery
- [x] Clubs page with statistics, updates, gallery
- [x] Library page with statistics, updates, gallery
- [x] Day-in page with statistics, updates, gallery
- [x] Outreach page with statistics, updates, gallery

### Team Section
- [x] Display 5 teacher profile cards
- [x] Display 6 manager profile cards
- [x] Display 4 club coordinator profile cards
- [x] Profile card design with images and roles

### Admin Dashboard
- [x] Admin page layout with form and posts display
- [x] Post creation form with page selector
- [x] Title input field
- [x] Content textarea
- [x] Visit date picker
- [x] Tags input (comma-separated)
- [x] Image URL input
- [x] Local file upload with base64 encoding
- [x] Save button with local state management
- [x] Posts display with real-time updates
- [x] Delete post functionality
- [x] Date-based sorting (newest first)

### Navigation & Layout
- [x] Sticky header with blue branding
- [x] Navigation menu with links to all pages
- [x] Responsive mobile navigation
- [x] Footer component reusable across pages

### Firebase Integration
- [ ] Firebase Firestore setup (client-side ready)
- [ ] Real-time post loading
- [ ] Post creation with Firestore
- [ ] Post deletion with Firestore
- [ ] Date-based query ordering

### Design & Styling
- [x] Tailwind CSS responsive layout
- [x] Card-based layouts with hover effects
- [x] Blue color scheme for branding
- [x] Mobile-first responsive design
- [x] Smooth transitions and animations
- [x] Zambian student and educational images integrated

### Testing & Optimization
- [x] Unit tests for Home page data
- [x] Unit tests for Admin page functionality
- [x] Test all page navigation
- [x] Test admin dashboard CRUD operations
- [ ] Test image upload (URL and file) in browser
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Test contact form validation
- [ ] Optimize performance

## Completed Items
- All core pages and components built
- All routes configured
- Responsive design implemented
- Admin dashboard with local state management
- Unit tests created and passing


## New Features - Firebase & Admin Integration

### Image Replacement
- [ ] Replace all remaining placeholder images with Zambian images
- [ ] Ensure all updates gallery images use Zambian images
- [ ] Update coordinator profile images

### Firebase Integration
- [x] Set up Firebase Firestore for posts collection
- [x] Implement real-time post loading from Firestore
- [x] Create posts with page/program association
- [x] Delete posts from Firestore
- [x] Sort posts by date (newest first)

### Admin Panel Enhancements
- [x] Add statistics update form for each program
- [x] Store program statistics in Firestore
- [x] Load statistics from Firestore on program pages
- [x] Edit statistics from admin panel
- [x] Display latest updates from Firestore on program pages

### Program Page Sync
- [x] Bootcamp page loads posts from Firestore
- [x] Sports page loads posts from Firestore
- [x] Clubs page loads posts from Firestore
- [x] Library page loads posts from Firestore
- [x] Day-in page loads posts from Firestore
- [x] Outreach page loads posts from Firestore
- [x] Real-time updates when admin creates posts


## Image Organization by Program

### Image Mapping
- [x] Main page image → Home hero, Bootcamp hero, Bootcamp gallery
- [x] Sports images → Sports hero, Sports gallery
- [x] Chess club image → Clubs hero, Clubs gallery
- [x] Library image → Library hero, Library gallery
- [x] Day in images (1 & 2) → Day-in hero, Day-in gallery
- [x] Manager images → Outreach hero, Outreach gallery, Team section
- [x] Ensure all gallery images match program theme
- [x] Update Home page program cards with correct images
- [x] Update team member profile images appropriately


## Outreach Program Image Update
- [ ] Replace Outreach hero image with appropriate image
- [ ] Update Outreach gallery images with corresponding images
- [ ] Ensure Outreach page displays unique images distinct from other programs


## Branding Update
- [x] Upload logo from shared folder to CDN
- [x] Update website name from "EduOrg" to "Baraka learning center" across all pages
- [x] Update text colors to match home page styling (orange #e07f10, green #95ba12, etc.)
- [x] Update Navbar styling on all program pages
- [x] Update Footer styling on all pages
- [x] Update button colors and links to match branding
- [x] Add logo to Navbar on all pages
- [x] Update Admin page styling to match branding


## Photo Gallery Reorganization
- [x] Remove gallery sections from all program pages
- [x] Add "Photo Gallery" tab to admin dashboard
- [x] Create unified photo gallery interface with program filtering
- [x] Display photos with title, caption, and date posted
- [x] Filter gallery by program (Bootcamp, Sports, Clubs, Library, Day-in, Outreach)
- [x] Test gallery filtering and display on all programs


## Admin Route Separation
- [x] Create dedicated /admin route
- [x] Move Admin.tsx to separate route
- [x] Remove Admin link from main navigation
- [x] Test admin route is accessible at /admin
- [x] Verify main pages work without admin access


## Logo and Text Sizing Updates
- [x] Increase logo size in Navbar (h-10 w-10 → h-16 w-16)
- [x] Reduce website name text size in Navbar (text-2xl → text-lg)
- [x] Update Home page navbar logo size and text
- [x] Add logo to Footer component
- [x] Verify all pages display updated logo and text
- [x] All tests passing


## Admin Login Page
- [x] Create AdminLogin.tsx component
- [x] Add login form with username and password fields
- [x] Implement authentication logic (username: admin, password: Keonlabs2024)
- [x] Add background image to login page
- [x] Redirect to admin dashboard on successful login
- [x] Store login state in localStorage
- [x] Redirect to login if accessing /admin without authentication
- [x] Add logout functionality
- [x] Test login flow


## Contact Form Messaging System
- [x] Create Messages collection in Firebase Firestore
- [x] Update Home.tsx contact form to save messages to Firestore
- [x] Add "Messages" tab to admin dashboard
- [x] Display all contact form submissions in admin panel
- [x] Add reply functionality to send emails to users
- [x] Show message status (new, replied, archived)
- [x] Test message submission and admin response flow


## Header and Post Sync Fixes
- [x] Reduce header size (logo and padding)
- [x] Remove background image from header
- [x] Fix post real-time sync to program pages
- [x] Test posts appear immediately when created in admin




## Email Notification Feature
- [x] Set up email service configuration
- [x] Create email sending endpoint (keon202508@gmail.com)
- [x] Add confirmation message to contact form
- [x] Verify messages appear in admin panel
- [x] Test email delivery to inbox
- [x] Verify message sync between admin panel and email


## Facebook Feed Integration
- [x] Set up Facebook API credentials (App ID, Access Token) - Framework ready, credentials can be added later
- [x] Create Facebook feed component
- [x] Add Facebook feed page/section
- [x] Integrate Facebook feed into home page
- [ ] Add admin settings for Facebook configuration
- [x] Test Facebook feed display
- [ ] Verify real-time post updates - Will work once credentials are provided


## Student Testimonials Feature
- [x] Create database schema for testimonials
- [x] Add tRPC endpoints for testimonials (create, read, update, delete)
- [x] Create testimonials component with carousel/grid display
- [x] Add testimonials section to home page
- [ ] Create admin panel for managing testimonials
- [ ] Add image upload for student photos
- [x] Write and run tests
- [ ] Verify testimonials display on live site


## Stories Feature (User Submissions)
- [x] Create stories database schema with categories
- [x] Add admin key validation system
- [x] Create stories submission form with media upload
- [ ] Build stories display page with filtering
- [x] Add Stories navigation button to navbar
- [ ] Create admin panel for managing stories
- [x] Implement media storage (images, videos, audio)
- [x] Write and run tests
- [ ] Verify stories display on live site


## Stories Gallery Feature (Public Display)
- [x] Create stories gallery component with grid layout
- [x] Add category filter buttons
- [x] Implement search functionality
- [x] Build story card component with preview
- [x] Create story detail modal/page
- [x] Add view count tracking
- [ ] Implement pagination or infinite scroll
- [x] Write and run tests
- [ ] Verify gallery displays on live site


## Admin Moderation Dashboard Feature
- [x] Update Stories submission form with file upload from device
- [x] Create admin moderation dashboard component
- [x] Add pending stories list with status indicators
- [x] Build approve/reject buttons with confirmation
- [ ] Implement file upload to S3 storage
- [x] Add bulk actions (approve all, reject all, delete)
- [x] Create story detail view for admins
- [x] Add filtering by category and status
- [x] Write and run tests
- [ ] Verify dashboard functionality on live site


## Page Redesign with Animations and Theme Consistency
- [x] Create design system with animations and motion library
- [x] Redesign Bootcamp page with home page theme
- [x] Redesign Sports page with animations
- [x] Redesign Clubs page with smooth transitions
- [x] Redesign DayIn page with engaging animations
- [x] Redesign Outreach page with theme
- [x] Redesign Library page with animations
- [ ] Redesign Stories submission page with animations
- [ ] Redesign Stories Gallery page with smooth transitions
- [ ] Update Admin dashboard styling to match theme
- [ ] Test animations on different devices
- [ ] Verify all pages have consistent branding


## Scroll-Triggered Animations Feature
- [x] Create useScrollReveal hook with Intersection Observer
- [x] Create ScrollReveal component wrapper
- [x] Update Bootcamp page with scroll animations
- [x] Update Sports page with scroll animations
- [x] Update Clubs page with scroll animations
- [ ] Update DayIn page with scroll animations
- [x] Update Outreach page with scroll animations
- [ ] Update Library page with scroll animations
- [x] Add animation variants (fade, slide, scale, zoom)
- [x] Write tests for scroll animations
- [ ] Test on different devices and browsers


## Hover Effects Feature
- [x] Create hover effect CSS utilities and animations
- [x] Add hover effects to program cards on home page
- [x] Add hover effects to statistics cards on all program pages
- [x] Add hover effects to update cards on all program pages
- [ ] Add hover effects to testimonial cards
- [ ] Add hover effects to story cards in gallery
- [x] Write tests for hover effects
- [ ] Test hover effects on different devices and browsers
