import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import mongoose from "mongoose";
import Invoice from "@/lib/models/Invoice";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }

    // Connect to MongoDB using Mongoose
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    
    const body = await request.json();
    const { invoiceData, password, expiryDays } = body;

    // Generate unique link ID
    const linkId = crypto.randomBytes(16).toString('hex');
    
    // Hash password if provided
    let hashedPassword = null;
    if (password && password.trim()) {
      hashedPassword = await bcrypt.hash(password.trim(), 12);
    }

    // Set expiry date (default 30 days if not specified)
    const expiryDate = expiryDays ? 
      new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000) : 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Create or update invoice with shareable link
    const invoiceNumber = `${invoiceData.general.invoiceNumberPrefix}${invoiceData.general.invoiceNumberValue}`;
    
    // Parse dates carefully to avoid timezone issues
    console.log('Raw invoice data dates:');
    console.log('Issue Date Raw:', invoiceData.general.issueDate);
    console.log('Due Date Raw:', invoiceData.general.dueDate);
    
    // Create dates using UTC to avoid timezone issues
    const issueDateStr = invoiceData.general.issueDate || new Date().toISOString().split('T')[0];
    const dueDateStr = invoiceData.general.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Use simple Date constructor - let Mongoose handle validation
    const issueDate = new Date(issueDateStr);
    const dueDate = new Date(dueDateStr);
    
    // Debug: Log dates to understand the issue
    console.log('Issue Date Parsed:', issueDate, 'Valid:', !isNaN(issueDate.getTime()));
    console.log('Due Date Parsed:', dueDate, 'Valid:', !isNaN(dueDate.getTime()));
    
    // Check if dates are valid before proceeding
    if (isNaN(issueDate.getTime()) || isNaN(dueDate.getTime())) {
      console.error('Invalid date format');
      return NextResponse.json({ 
        error: 'Invalid date format provided' 
      }, { status: 400 });
    }
    
    const invoice = await Invoice.findOneAndUpdate(
      { invoiceNumber },
      {
        ...invoiceData,
        invoiceNumber,
        issueDate: issueDate,
        dueDate: dueDate,
        currency: invoiceData.general.currency,
        language: invoiceData.general.language,
        seller: {
          name: invoiceData.seller.name,
          address: invoiceData.seller.address,
          phone: invoiceData.seller.phone || '',
          email: invoiceData.seller.email || '',
          vatNumber: invoiceData.seller.vatNumber || '',
        },
        buyer: {
          name: invoiceData.buyer.name,
          address: invoiceData.buyer.address,
          phone: invoiceData.buyer.phone || '',
          email: invoiceData.buyer.email || '',
          vatNumber: invoiceData.buyer.vatNumber || '',
        },
        items: invoiceData.items.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate || 0,
        })),
        shareableLink: {
          id: linkId,
          isActive: true,
          password: hashedPassword,
          createdAt: new Date(),
          expiresAt: expiryDate,
        },
        updatedAt: new Date(),
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );

    const shareableUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/shared/${linkId}`;

    return NextResponse.json({
      success: true,
      shareableUrl,
      linkId,
      expiresAt: expiryDate,
      hasPassword: !!password
    });

  } catch (error) {
    console.error('Generate link error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to generate shareable link" 
    }, { status: 500 });
  }
}
