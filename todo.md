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
