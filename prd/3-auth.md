# Authentication & Security Implementation Guide

## Overview
InvoicePDF is designed as a no-signup required application, but includes several security and authentication mechanisms for API access, subscription management, and admin features.

## 1. Environment Variables Setup

Create a `.env.local` file in your project root with these variables:

```bash
# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/easyinvoicepdf
# For production: mongodb+srv://username:password@cluster.mongodb.net/easyinvoicepdf

# API Authentication
AUTH_TOKEN=your-secure-auth-token

# Email Services (Resend)
RESEND_API_KEY=your-resend-api-key
RESEND_AUDIENCE_ID=your-resend-audience-id

# Rate Limiting & Caching (Upstash Redis)
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

# Notifications (Telegram)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Default Invoice Data (Optional)
SELLER_NAME=Your Company Name
SELLER_ADDRESS=Your Company Address
SELLER_VAT_NO=Your VAT Number
SELLER_EMAIL=your@email.com
SELLER_ACCOUNT_NUMBER=Your Account Number
SELLER_SWIFT_BIC=Your SWIFT/BIC

BUYER_NAME=Default Buyer Name
BUYER_ADDRESS=Default Buyer Address
BUYER_VAT_NO=Default Buyer VAT
BUYER_EMAIL=default@buyer.com

INVOICE_NET_PRICE=100.00
INVOICE_EMAIL_RECIPIENT=recipient@email.com
INVOICE_EMAIL_COMPANY_TO=company@email.com

# Google Drive Integration (Optional)
GOOGLE_DRIVE_PARENT_FOLDER_ID=your-google-drive-folder-id
GOOGLE_DRIVE_CLIENT_EMAIL=your-service-account@email.com
GOOGLE_DRIVE_PRIVATE_KEY=your-private-key

# Error Monitoring (Sentry)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## 2. MongoDB Security & Connection

### MongoDB Connection Security
```typescript
// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10, // Limit connection pool
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
  socketTimeoutMS: 45000, // Close sockets after 45s
  bufferMaxEntries: 0, // Disable mongoose buffering
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Validate MongoDB URI format
const isValidMongoURI = (uri: string): boolean => {
  try {
    new URL(uri);
    return uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
  } catch {
    return false;
  }
};

if (!isValidMongoURI(uri)) {
  throw new Error('Invalid MongoDB URI format');
}

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

### MongoDB Data Validation
```typescript
// src/lib/models/Invoice.ts
import mongoose from 'mongoose';

// Sanitize input data
const sanitizeString = (str: string): string => {
  return str.replace(/[<>]/g, '').trim();
};

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { 
    type: String, 
    required: true, 
    unique: true,
    set: sanitizeString,
    validate: {
      validator: (v: string) => v.length > 0 && v.length <= 50,
      message: 'Invoice number must be between 1 and 50 characters'
    }
  },
  issueDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: (v: Date) => v <= new Date(),
      message: 'Issue date cannot be in the future'
    }
  },
  dueDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(this: any, v: Date) {
        return v >= this.issueDate;
      },
      message: 'Due date must be after or equal to issue date'
    }
  },
  currency: { 
    type: String, 
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    default: 'USD'
  },
  language: { 
    type: String, 
    required: true,
    enum: ['en', 'es', 'fr', 'de', 'it'],
    default: 'en'
  },
  seller: {
    name: { 
      type: String, 
      required: true,
      set: sanitizeString,
      maxlength: 100
    },
    address: { 
      type: String, 
      required: true,
      set: sanitizeString,
      maxlength: 200
    },
    vatNumber: { 
      type: String,
      set: sanitizeString,
      maxlength: 20
    },
    email: { 
      type: String, 
      required: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format'
      }
    },
    accountNumber: { 
      type: String,
      set: sanitizeString,
      maxlength: 34
    },
    swiftBic: { 
      type: String,
      set: sanitizeString,
      maxlength: 11
    },
  },
  buyer: {
    name: { 
      type: String, 
      required: true,
      set: sanitizeString,
      maxlength: 100
    },
    address: { 
      type: String, 
      required: true,
      set: sanitizeString,
      maxlength: 200
    },
    vatNumber: { 
      type: String,
      set: sanitizeString,
      maxlength: 20
    },
    email: { 
      type: String, 
      required: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format'
      }
    },
  },
  items: [{
    description: { 
      type: String, 
      required: true,
      set: sanitizeString,
      maxlength: 200
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 0.01,
      max: 999999
    },
    unitPrice: { 
      type: Number, 
      required: true,
      min: 0,
      max: 999999
    },
    vatRate: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100
    },
  }],
  template: { 
    type: String, 
    enum: ['default', 'stripe'], 
    default: 'default' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add indexes for better performance
InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ createdAt: -1 });
InvoiceSchema.index({ 'seller.email': 1 });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
```

## 3. API Route Protection

### Rate Limiting Implementation
```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
  analytics: true,
});
```

### API Route Protection Pattern
```typescript
// src/app/api/generate-invoice/route.tsx
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.limit(ip);
    
    if (!success) {
      return new Response("Too Many Requests", { status: 429 });
    }

    // Auth token validation (for admin features)
    const authHeader = headers().get("authorization");
    if (authHeader && !authHeader.includes(process.env.AUTH_TOKEN!)) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Process request...
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
```

### MongoDB API Route Protection
```typescript
// src/app/api/invoices/route.ts
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import clientPromise from "@/lib/mongodb";
import Invoice from "@/lib/models/Invoice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    // Connect to MongoDB
    await clientPromise;
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const skip = (page - 1) * limit;

    // Query invoices with pagination
    const invoices = await Invoice.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Invoice.countDocuments({});

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('MongoDB query error:', error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    // Connect to MongoDB
    await clientPromise;
    
    // Parse and validate request body
    const body = await request.json();
    
    // Create new invoice
    const invoice = new Invoice(body);
    await invoice.save();

    return NextResponse.json({ 
      success: true, 
      invoice: invoice.toObject() 
    });
  } catch (error) {
    console.error('MongoDB save error:', error);
    return NextResponse.json({ error: "Failed to save invoice" }, { status: 500 });
  }
}
```

```typescript
// src/app/api/invoices/[id]/route.ts
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import clientPromise from "@/lib/mongodb";
import Invoice from "@/lib/models/Invoice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    // Validate ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(params.id)) {
      return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
    }

    // Connect to MongoDB
    await clientPromise;
    
    // Find invoice by ID
    const invoice = await Invoice.findById(params.id).lean();
    
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error('MongoDB query error:', error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    // Validate ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(params.id)) {
      return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
    }

    // Connect to MongoDB
    await clientPromise;
    
    // Parse and validate request body
    const body = await request.json();
    
    // Update invoice
    const invoice = await Invoice.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      invoice 
    });
  } catch (error) {
    console.error('MongoDB update error:', error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    // Validate ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(params.id)) {
      return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
    }

    // Connect to MongoDB
    await clientPromise;
    
    // Delete invoice
    const invoice = await Invoice.findByIdAndDelete(params.id);
    
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Invoice deleted successfully" 
    });
  } catch (error) {
    console.error('MongoDB delete error:', error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
```

## 3. Subscription Management

### Email Subscription Flow
```typescript
// src/actions/subscribe-action.ts
import { resend } from "@/lib/resend";
import { redis } from "@/lib/redis";

export async function subscribeAction(email: string) {
  try {
    // Validate email
    if (!email || !email.includes("@")) {
      return { error: "Invalid email address" };
    }

    // Check if already subscribed
    const existing = await redis.get(`subscriber:${email}`);
    if (existing) {
      return { error: "Already subscribed" };
    }

    // Add to subscription list
    await redis.set(`subscriber:${email}`, Date.now());
    
    // Send confirmation email
    await resend.emails.send({
      from: "InvoicePDF <noreply@easyinvoicepdf.com>",
      to: email,
      subject: "Welcome to InvoicePDF!",
      react: ConfirmSubscriptionEmail(),
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to subscribe" };
  }
}
```

## 4. Security Headers

### Next.js Security Configuration
```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
          },
        ],
      },
    ];
  },
};
```

## 5. Error Monitoring

### Sentry Integration
```typescript
// src/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
```

## 6. Data Validation

### Zod Schemas for Form Validation
```typescript
// src/lib/validations.ts
import { z } from "zod";

export const invoiceSchema = z.object({
  general: z.object({
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    issueDate: z.date(),
    dueDate: z.date(),
    currency: z.string().min(1),
    language: z.string().min(1),
  }),
  seller: z.object({
    name: z.string().min(1, "Seller name is required"),
    address: z.string().min(1, "Seller address is required"),
    vatNumber: z.string().optional(),
    email: z.string().email("Invalid email format"),
    accountNumber: z.string().optional(),
    swiftBic: z.string().optional(),
  }),
  buyer: z.object({
    name: z.string().min(1, "Buyer name is required"),
    address: z.string().min(1, "Buyer address is required"),
    vatNumber: z.string().optional(),
    email: z.string().email("Invalid email format"),
  }),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    vatRate: z.number().min(0).max(100),
  })).min(1, "At least one item is required"),
});
```

## 7. File Upload Security

### PDF Generation Security
```typescript
// src/app/api/generate-invoice/route.tsx
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validatedData = invoiceSchema.parse(body);
    
    // Sanitize inputs
    const sanitizedData = sanitizeInvoiceData(validatedData);
    
    // Generate PDF
    const pdfBuffer = await generatePDF(sanitizedData);
    
    // Set secure headers
    const response = new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
    
    return response;
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}
```

## 8. Environment Validation

### Runtime Environment Check
```typescript
// src/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MONGODB_URI: z.string().url("Invalid MongoDB URI"),
    AUTH_TOKEN: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    TELEGRAM_CHAT_ID: z.string().optional(),
    // ... other environment variables
  },
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z.string(),
  },
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
});
```

## 9. Testing Security

### Security Test Examples
```typescript
// e2e/security.test.ts
import { test, expect } from "@playwright/test";

test("should not expose sensitive data in response headers", async ({ request }) => {
  const response = await request.post("/api/generate-invoice", {
    data: { /* test invoice data */ }
  });
  
  expect(response.headers()).not.toHaveProperty("x-auth-token");
  expect(response.headers()).not.toHaveProperty("x-api-key");
});

test("should rate limit excessive requests", async ({ request }) => {
  const promises = Array(15).fill(null).map(() => 
    request.post("/api/generate-invoice", {
      data: { /* test data */ }
    })
  );
  
  const responses = await Promise.all(promises);
  const rateLimited = responses.filter(r => r.status() === 429);
  
  expect(rateLimited.length).toBeGreaterThan(0);
});
```

## Important Notes:

- **No User Authentication**: This application is designed to work without user registration
- **API Token Protection**: Admin features use AUTH_TOKEN for protection
- **Rate Limiting**: All API endpoints are rate-limited to prevent abuse
- **Input Validation**: All user inputs are validated using Zod schemas
- **Error Monitoring**: Sentry integration for production error tracking
- **Security Headers**: Comprehensive security headers for all routes
- **Data Privacy**: No user data is stored permanently (except email subscriptions)
- **PDF Security**: Generated PDFs are validated and sanitized

## Verification Checklist:

- [ ] Environment variables are properly configured
- [ ] MongoDB connection is established and secure
- [ ] MongoDB data validation is working correctly
- [ ] Rate limiting is working on API routes
- [ ] Input validation is implemented for all forms
- [ ] Security headers are set correctly
- [ ] Error monitoring is configured
- [ ] PDF generation is secure
- [ ] Subscription flow works correctly
- [ ] No sensitive data is exposed in responses
- [ ] Rate limiting tests pass
- [ ] Input validation tests pass
- [ ] MongoDB CRUD operations work correctly
- [ ] MongoDB ObjectId validation is working
- [ ] Database indexes are created for performance
