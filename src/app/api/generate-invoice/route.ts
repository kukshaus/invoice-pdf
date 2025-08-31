import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Invoice from '@/lib/models/Invoice';
import { InvoiceData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const invoiceData: InvoiceData = body;

    // Validate required fields
    if (!invoiceData.general.invoiceNumber) {
      return NextResponse.json(
        { error: 'Invoice number is required' },
        { status: 400 }
      );
    }

    if (!invoiceData.seller.name || !invoiceData.seller.email) {
      return NextResponse.json(
        { error: 'Seller name and email are required' },
        { status: 400 }
      );
    }

    if (!invoiceData.buyer.name || !invoiceData.buyer.email) {
      return NextResponse.json(
        { error: 'Buyer name and email are required' },
        { status: 400 }
      );
    }

    if (invoiceData.items.length === 0) {
      return NextResponse.json(
        { error: 'At least one invoice item is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await clientPromise;

    // Create new invoice
    const invoice = new Invoice({
      ...invoiceData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await invoice.save();

    // TODO: Generate PDF using @react-pdf/renderer
    // This would involve creating a PDF document based on the template

    return NextResponse.json({
      success: true,
      data: {
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        message: 'Invoice generated successfully'
      }
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await clientPromise;
    const invoices = await Invoice.find({}).sort({ createdAt: -1 }).limit(10);
    
    return NextResponse.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
