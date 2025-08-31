# Invoice PDF Generator

A modern, feature-rich invoice generator built with Next.js, React, and TypeScript. Generate professional invoices in multiple languages and currencies with real-time preview and PDF export capabilities.

## 🌟 Features

### 📄 **Invoice Generation**
- **Real-time HTML Preview**: See changes instantly as you type
- **PDF Export**: Download professional PDF invoices
- **Multiple Templates**: Default and Stripe-inspired designs
- **Custom Branding**: Upload company logos and customize styling

### 🌍 **International Support**
- **12 Languages**: English, German, French, Spanish, Italian, Dutch, Portuguese, Polish, Swedish, Danish, Finnish, Norwegian
- **Global Currencies**: Support for 150+ currencies including EUR, USD, CHF, GBP, and more
- **Localized Formatting**: Date formats and number formatting adapt to selected language

### 💼 **Professional Features**
- **Seller/Buyer Management**: Complete contact information with VAT numbers
- **Item Management**: Add, edit, and remove invoice items with tax calculations
- **Payment Information**: Payment methods, due dates, and terms
- **Notes & Signatures**: Add custom notes and digital signatures
- **VAT Calculations**: Automatic tax calculations with configurable rates

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works perfectly on desktop and mobile
- **Clean Interface**: Modern, intuitive design with Tailwind CSS
- **Collapsible Sections**: Organized form sections for better workflow
- **Modal Dialogs**: Clean popup interfaces for data entry

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kukshaus/invoice-pdf.git
   cd invoice-pdf
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── page.tsx           # Main invoice generator page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/               # API routes
├── components/            # React components
│   ├── HTMLPreview.tsx   # HTML invoice preview
│   ├── InvoicePDF.tsx    # PDF generation component
│   ├── SellerModal.tsx   # Seller information modal
│   └── ...               # Other UI components
├── lib/                   # Utility functions
│   ├── translations.ts    # Multi-language support
│   ├── utils.ts          # Helper functions
│   └── mongodb.ts        # Database connection
└── types.ts              # TypeScript type definitions
```

## 🌍 Language Support

The application supports the following languages:

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Complete |
| German | `de` | ✅ Complete |
| French | `fr` | ✅ Complete |
| Spanish | `es` | ✅ Complete |
| Italian | `it` | ✅ Complete |
| Dutch | `nl` | ✅ Complete |
| Portuguese | `pt` | ✅ Complete |
| Polish | `pl` | ✅ Complete |
| Swedish | `sv` | ✅ Complete |
| Danish | `da` | ✅ Complete |
| Finnish | `fi` | ✅ Complete |
| Norwegian | `no` | ✅ Complete |

## 💱 Currency Support

The application includes comprehensive currency support with proper symbols and formatting:

- **European**: EUR (€), GBP (£), CHF, SEK, NOK, DKK, PLN (zł), CZK (Kč), HUF (Ft), RON (Lei), BGN (лв), HRK (kn), RSD (дин)
- **Global**: USD ($), CAD (C$), AUD (A$), JPY (¥), CNY (¥), INR (₹), BRL (R$), and 140+ more

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: @react-pdf/renderer
- **Icons**: Lucide React
- **Database**: MongoDB (optional)
- **Authentication**: NextAuth.js (optional)
- **Deployment**: Vercel-ready

## 📝 Usage

### Creating an Invoice

1. **Fill in General Information**
   - Invoice number and prefix
   - Issue date, due date, and service date
   - Select currency and language

2. **Add Seller Information**
   - Company name, address, and contact details
   - VAT number and business information
   - Upload company logo

3. **Add Buyer Information**
   - Client name, address, and contact details
   - VAT number for tax purposes

4. **Add Invoice Items**
   - Description, quantity, and unit price
   - VAT rate for each item
   - Automatic calculations

5. **Configure Payment Details**
   - Payment method and terms
   - Due date information

6. **Preview and Export**
   - View real-time HTML preview
   - Download PDF invoice
   - Share invoice link

### Features in Detail

#### Real-time Preview
- Changes appear instantly in the HTML preview
- Professional layout matching the final PDF
- Responsive design for all screen sizes

#### PDF Generation
- High-quality PDF output
- Professional formatting
- Print-ready documents

#### Multi-language Support
- Complete UI translation
- Localized date formatting
- Currency symbols and formatting

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database (optional)
MONGODB_URI=mongodb://localhost:27017/invoice-pdf

# Authentication (optional)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Sentry (optional)
SENTRY_DSN=your-sentry-dsn
```

### Customization

#### Adding New Languages
1. Edit `src/lib/translations.ts`
2. Add new language translations
3. Update the language dropdown in `src/app/page.tsx`

#### Adding New Currencies
1. Update currency symbols in `src/lib/utils.ts`
2. Add to the currency dropdown in `src/app/page.tsx`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Push your code to GitHub
   - Connect repository to Vercel

2. **Configure environment variables**
   - Add environment variables in Vercel dashboard

3. **Deploy**
   - Vercel will automatically deploy on push

### Other Platforms

The application is compatible with:
- **Netlify**: Use `npm run build` and `npm run export`
- **Railway**: Direct deployment from GitHub
- **Docker**: Use the provided Dockerfile

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **@react-pdf/renderer** for PDF generation capabilities
- **Lucide React** for the beautiful icons

## 📞 Support

If you have any questions or need help:

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/kukshaus/invoice-pdf/issues)
- 📖 Documentation: [Project Wiki](https://github.com/kukshaus/invoice-pdf/wiki)

---

**Made with ❤️ for businesses worldwide**
