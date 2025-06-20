'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Oops! Page Not Found</h2>
          <p className="not-found-description">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Don&apos;t worry, you can navigate back to safety using the links below.
          </p>
          <div className="not-found-actions">
            <Link href="/" className="not-found-button primary">
              <i className="bi bi-house"></i>
              Go to Homepage
            </Link>
            <Link href="/contact" className="not-found-button secondary">
              <i className="bi bi-envelope"></i>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}