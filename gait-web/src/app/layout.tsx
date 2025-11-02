import Navbar from '@/components/Navbar';
import React from 'react';  
// Import global styles 
import '../app/globals.css';
export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head/>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}