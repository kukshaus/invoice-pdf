import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import Invoice from '@/lib/models/Invoice';
import SharedInvoiceView from './SharedInvoiceView';

interface SharedInvoicePageProps {
  params: Promise<{ linkId: string }>;
}

export default async function SharedInvoicePage({ params }: SharedInvoicePageProps) {
  const { linkId } = await params;
  
  try {
    await clientPromise;
    
    const invoice = await Invoice.findOne({
      'shareableLink.id': linkId,
      'shareableLink.isActive': true,
      'shareableLink.expiresAt': { $gt: new Date() }
    }).lean();

    if (!invoice) {
      notFound();
    }

    return <SharedInvoiceView invoice={invoice} linkId={linkId} />;
  } catch (error) {
    console.error('Error fetching shared invoice:', error);
    notFound();
  }
}
