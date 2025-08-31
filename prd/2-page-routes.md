Set up the page structure according to the following prompt:
   
<page-structure-prompt>
Next.js route structure based on navigation menu items (excluding main route). Make sure to wrap all routes with the component:

Routes:
- /about
- /changelog
- /confirm-subscription
- /[locale]/about
- /api/generate-invoice
- /api/invoices
- /api/invoices/[id]

Page Implementations:
/about:
Core Purpose: Landing page showcasing EasyInvoicePDF features and benefits
Key Components:
- Hero section with main value proposition
- Feature highlights grid
- Screenshots of invoice templates
- Call-to-action buttons
- Testimonials section
- Pricing information
- FAQ section
Layout Structure:
- Full-width hero section
- Grid layout for features
- Responsive card design
- Sticky navigation

/changelog:
Core Purpose: Display project updates and version history
Key Components:
- Version timeline
- Feature updates
- Bug fixes
- Breaking changes
- Release dates
- Download links
Layout Structure:
- Timeline layout
- Version cards
- Search/filter functionality
- Responsive design

/confirm-subscription:
Core Purpose: Handle email subscription confirmation flow
Key Components:
- Confirmation message
- Success/error states
- Email verification
- Subscription management
- Unsubscribe options
Layout Structure:
- Centered card layout
- Single column design
- Clear messaging
- Action buttons

/[locale]/about:
Core Purpose: Internationalized about page with language support
Key Components:
- Localized content
- Language switcher
- Translated features
- Regional pricing
- Local testimonials
Layout Structure:
- Same as /about but with i18n
- Language-specific content
- RTL support for certain languages
- Localized CTAs

/api/generate-invoice:
Core Purpose: Server-side PDF generation endpoint
Key Components:
- PDF generation logic
- Template rendering
- File compression
- Error handling
- Rate limiting
- Response formatting
Layout Structure:
- API endpoint (no UI)
- JSON responses
- Error status codes
- File downloads

/api/invoices:
Core Purpose: MongoDB CRUD operations for invoice management
Key Components:
- GET: Retrieve all invoices with pagination
- POST: Create new invoice and save to MongoDB
- PUT: Update existing invoice
- DELETE: Remove invoice from database
- Search and filtering capabilities
- Data validation with Mongoose schemas
Layout Structure:
- RESTful API endpoint (no UI)
- JSON responses with MongoDB ObjectIds
- Error handling for database operations
- Pagination support

/api/invoices/[id]:
Core Purpose: Individual invoice operations by MongoDB ObjectId
Key Components:
- GET: Retrieve specific invoice by ID
- PUT: Update specific invoice
- DELETE: Remove specific invoice
- Data validation and sanitization
- Error handling for invalid IDs
Layout Structure:
- Dynamic API route (no UI)
- JSON responses with invoice data
- Proper HTTP status codes
- MongoDB ObjectId validation

Layouts:
MainLayout:
- Applicable routes: /, /about, /changelog
- Core components: Header, Footer, Navigation
- Responsive behavior: Full-width design, mobile-first

AppLayout:
- Applicable routes: /(app)/* (main invoice generator)
- Core components: Sidebar, Main content, PDF preview
- Responsive behavior: Two-column desktop, single-column mobile

AuthLayout:
- Applicable routes: /confirm-subscription
- Core components: Centered container, Minimal navigation
- Responsive behavior: Centered content, focused design

LocaleLayout:
- Applicable routes: /[locale]/*
- Core components: Language switcher, Localized content
- Responsive behavior: Same as parent layout with i18n support

API Layout:
- Applicable routes: /api/*
- Core components: No UI components
- Responsive behavior: JSON responses only
</page-structure-prompt>
