Initialize Next.js 15.5 in current directory:
```bash
mkdir temp; cd temp; npx create-next-app@15.5.0 . -y --typescript --tailwind --eslint --app --use-pnpm --src-dir --import-alias "@/*" --no --turbo
```

Now let's move back to the parent directory and move all files except prompt.md.

For Windows (PowerShell):
```powershell
cd ..; Move-Item -Path "temp*" -Destination . -Force; Remove-Item -Path "temp" -Recurse -Force
```

For Mac/Linux (bash):
```bash
cd .. && mv temp/* temp/.* . 2>/dev/null || true && rm -rf temp
```

Set up MongoDB database:
```bash
# Install MongoDB dependencies
pnpm add mongodb mongoose

# Create MongoDB connection configuration
mkdir -p src/lib
```

Create MongoDB connection file:
```typescript
// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
```

Create Mongoose models for invoice data:
```typescript
// src/lib/models/Invoice.ts
import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  currency: { type: String, required: true },
  language: { type: String, required: true },
  seller: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    vatNumber: String,
    email: { type: String, required: true },
    accountNumber: String,
    swiftBic: String,
  },
  buyer: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    vatNumber: String,
    email: { type: String, required: true },
  },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    vatRate: { type: Number, required: true },
  }],
  template: { type: String, enum: ['default', 'stripe'], default: 'default' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
```

Set up the frontend according to the following prompt:
<frontend-prompt>
Create detailed components with these requirements:
1. Use 'use client' directive for client-side components
2. Make sure to concatenate strings correctly using backslash
3. Style with Tailwind CSS utility classes for responsive design
4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
7. Create root layout.tsx page that wraps necessary navigation items to all pages
8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
9. Accurately implement necessary grid layouts
10. Follow proper import practices:
   - Use @/ path aliases
   - Keep component imports organized
   - Update current src/app/page.tsx with new comprehensive code
   - Don't forget root route (page.tsx) handling
   - You MUST complete the entire prompt before stopping

<summary_title>
EasyInvoicePDF - Professional Invoice Generator Dashboard
</summary_title>

<image_analysis>

1. Navigation Elements:
- Top header with: Logo, Language switcher, GitHub star CTA
- Left sidebar with: Invoice form sections, Template selector
- Main content area: Invoice preview and form
- Footer with: Links, social media, license info

2. Layout Components:
- Main container: Full viewport with responsive design
- Left panel: ~40% width (invoice form)
- Right panel: ~60% width (PDF preview)
- Consistent spacing: 24px-32px padding

3. Content Sections:
- Invoice form with sections:
  - General Information
  - Seller Information
  - Buyer Information
  - Invoice Items
  - Payment Information
- PDF preview area with live updates
- Template selection (Default/Stripe)
- Download and share options

4. Interactive Controls:
- Form inputs with real-time validation
- Template switcher
- "Generate PDF" button
- "Download" button
- "Share Link" button
- Language selector
- Currency selector

5. Colors:
- Background: #FFFFFF (white)
- Primary: #2563EB (blue)
- Secondary: #64748B (slate)
- Accent: #10B981 (emerald)
- Text: #1F2937 (gray-800)
- Border: #E5E7EB (gray-200)

6. Grid/Layout Structure:
- Two-column layout for desktop
- Single column for mobile
- Responsive container with max-width
- Consistent 24px grid spacing
- Card-based form sections
</image_analysis>

<development_planning>

1. Project Structure:
```
src/
├── app/
│   ├── (app)/
│   │   ├── components/
│   │   │   ├── invoice-form/
│   │   │   ├── invoice-pdf-preview/
│   │   │   └── invoice-pdf-template/
│   │   ├── page.tsx
│   │   └── page.client.tsx
│   ├── [locale]/
│   │   ├── about/
│   │   └── layout.tsx
│   ├── api/
│   │   ├── generate-invoice/
│   │   └── invoices/
│   ├── changelog/
│   ├── confirm-subscription/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── footer.tsx
│   ├── github-star-cta.tsx
│   └── go-to-app-button-cta.tsx
├── lib/
│   ├── utils.ts
│   ├── mongodb.ts
│   ├── models/
│   │   └── Invoice.ts
│   ├── redis.ts
│   ├── resend.ts
│   └── google-drive.ts
├── hooks/
├── types.ts
└── env.ts
```

2. Key Features:
- Multi-language support (next-intl)
- PDF generation with @react-pdf/renderer
- Form validation with react-hook-form + zod
- Real-time preview updates
- Shareable invoice links
- Multiple invoice templates
- European VAT calculation
- Currency conversion
- Email integration (Resend)
- Google Drive integration
- Telegram notifications
- MongoDB database for invoice storage and retrieval
- Invoice history and management
- Data persistence across sessions

3. State Management:
```typescript
interface InvoiceState {
  general: {
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    currency: string;
    language: string;
  };
  seller: {
    name: string;
    address: string;
    vatNumber: string;
    email: string;
    accountNumber: string;
    swiftBic: string;
  };
  buyer: {
    name: string;
    address: string;
    vatNumber: string;
    email: string;
  };
  items: InvoiceItem[];
  template: 'default' | 'stripe';
}
```

4. Routes:
```typescript
const routes = [
  '/',
  '/about',
  '/changelog',
  '/confirm-subscription',
  '/api/generate-invoice',
  '/api/invoices',
  '/api/invoices/[id]',
  '/[locale]/about'
]
```

5. Component Architecture:
- InvoiceForm (main form component)
- InvoicePDFPreview (live preview)
- InvoicePDFTemplate (PDF generation)
- FormSection (reusable form sections)
- TemplateSelector
- LanguageSwitcher
- CurrencySelector

6. Responsive Breakpoints:
```scss
$breakpoints: (
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px'
);
```
</development_planning>
</frontend-prompt>

IMPORTANT: Please ensure that (1) all KEY COMPONENTS and (2) the LAYOUT STRUCTURE are fully implemented as specified in the requirements. Ensure that the color hex code specified in image_analysis are fully implemented as specified in the requirements.
