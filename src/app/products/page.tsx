'use client';

import { useState, useEffect } from 'react';
import Chatbot from '../components/Chatbot';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// Type definitions
interface Product {
  id: string | number;
  name: string;
  description: string;
  category: string;
  price?: string | number;
  image_url?: string;
  is_available: boolean;
}

interface ApiResponse {
  products?: Product[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Handle mounting to prevent hydration mismatch
  useEffect((): void => {
    setMounted(true);
  }, []);

  // Fetch products from API
  useEffect((): void => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setLoading(true);
        const response: Response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Product[] | ApiResponse = await response.json();
        
        // Handle different API response formats
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && 'products' in data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`Failed to load products: ${errorMessage}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Show/hide scroll-to-top button - only after component is mounted
  useEffect((): (() => void) | void => {
    if (!mounted) return;

    const handleScroll = (): void => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return (): void => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // Scroll to top function
  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Helper function to get product icon based on category or name
  const getProductIcon = (product: Product): string => {
    if (product.category === 'Photo & Video') return '🎪';
    if (product.name.toLowerCase().includes('connect')) return '🎪';
    return '📦'; // Default icon
  };

  /* Helper function to generate features based on product data
  const getProductFeatures = (product: Product): string[] => {
    if (product.name.toLowerCase().includes('connect')) {
      return ['Virtual event hosting', 'Global connectivity', 'HD streaming quality', 'Interactive participation'];
    }
    return ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']; // Default features
  };
  // Format price display
  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice.toLocaleString();
  };
  */
  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

  

  // Don't render until mounted
  if (!mounted) {
    return <div></div>;
  }

  return (
    <>
      <Navbar />
      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Hero Section */}
          <section className="hero-section">
            <h1 className="hero-title text-xl font-bold text-white/80">Our Products</h1>
            <p className="hero-description">
              Cutting-edge technology solutions designed to transform your business 
              operations and drive digital innovation across all industries.
            </p>
          </section>

          {/* Products Grid */}
          <section className="products-page-grid-section">
            {loading && (
              <div className="loading-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'white', fontSize: '1.1rem' }}>Loading products...</p>
              </div>
            )}

            {error && (
              <div className="error-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#ff6b6b', fontSize: '1.1rem' }}>{error}</p>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="no-products-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'white', fontSize: '1.1rem' }}>No products available at the moment.</p>
              </div>
            )}

            {/* Products Grid */}
              {!loading && !error && products.length > 0 && (
                <div className="products-grid">
                  {products.map((product: Product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-icon">
                        <span>{getProductIcon(product)}</span>
                      </div>
                      
                      {/* Product Image */}
                      {product.image_url && (
                        <div className="product-image" style={{ margin: '1rem 0' }}>
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            style={{ 
                              width: '100%', 
                              height: '150px', 
                              objectFit: 'cover', 
                              borderRadius: '8px' 
                            }}
                            onError={handleImageError}
                          />
                        </div>
                      )}
                      
                      <div className="product-content">
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-description">
                          {product.description}
                        </p>
                        
                        <button 
                          className="product-price-btn"
                          disabled={!product.is_available}
                          style={{
                            opacity: product.is_available ? 1 : 0.6,
                            cursor: product.is_available ? 'pointer' : 'not-allowed'
                          }}
                        >
                          {product.is_available ? 'Explore' : 'Coming Soon'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </section>

          {/* Call to Action Section */}
          <section className="products-cta-section">
            <div className="products-cta-content">
              <h2 className="products-cta-title">Need Custom Solutions?</h2>
              <p className="products-cta-description">
                Our team of experts can customize any product to meet your specific business 
                requirements. Get in touch with us for personalized solutions.
              </p>
              <div className="products-cta-buttons">
                <button className="products-cta-primary-btn">Contact Sales</button>
                <button className="products-cta-secondary-btn">Request Quote</button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Scroll to Top Button - only render after mounted to prevent hydration mismatch */}
      {mounted && showScrollTop && (
        <button 
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}

      {/* Chatbot Widget */}
      <Chatbot />
      <Footer />
    </>
  );
}