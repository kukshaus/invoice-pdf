import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import Invoice from "@/lib/models/Invoice";
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await clientPromise;
    
    const { linkId, password } = await request.json();

    const invoice = await Invoice.findOne({
      'shareableLink.id': linkId,
      'shareableLink.isActive': true,
      'shareableLink.expiresAt': { $gt: new Date() }
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }

    // If no password is set, allow access
    if (!invoice.shareableLink.password) {
      return NextResponse.json({ success: true });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, invoice.shareableLink.password);
    
    if (isValidPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

  } catch (error) {
    console.error('Password verification error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
