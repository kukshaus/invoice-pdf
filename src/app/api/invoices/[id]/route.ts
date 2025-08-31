import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import clientPromise from "@/lib/mongodb";
import Invoice from "@/lib/models/Invoice";
import { NextRequest, NextResponse } from "next/server";
import { invoiceSchema } from "@/lib/validations";

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
    
    // Validate with Zod schema
    const validatedData = invoiceSchema.parse(body);
    
    // Update invoice
    const invoice = await Invoice.findByIdAndUpdate(
      params.id,
      { ...validatedData, updatedAt: new Date() },
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
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: "Validation error", 
        details: error.errors 
      }, { status: 400 });
    }
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
