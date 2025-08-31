import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import clientPromise from "@/lib/mongodb";
import Invoice from "@/lib/models/Invoice";
import { NextRequest, NextResponse } from "next/server";
import { invoiceSchema } from "@/lib/validations";

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
    
    // Validate with Zod schema
    const validatedData = invoiceSchema.parse(body);
    
    // Create new invoice
    const invoice = new Invoice({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await invoice.save();

    return NextResponse.json({ 
      success: true, 
      invoice: invoice.toObject() 
    });
  } catch (error) {
    console.error('MongoDB save error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: "Validation error", 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save invoice" }, { status: 500 });
  }
}
