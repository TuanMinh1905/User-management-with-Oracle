import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IT Department API',
  description: 'Backend API for IT Department Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
