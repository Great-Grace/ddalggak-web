import { Link } from 'react-router-dom'

export default function RefundPolicy() {
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <img src="/DDalGGakIcon.svg" alt="DDalGGak Icon" className="logo-img" />
            <span className="logo-text">DDalGGak</span>
          </Link>
          <nav className="nav-links">
            <Link to="/">Home</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 40, letterSpacing: -1, marginBottom: 8 }}>
          Refund Policy
        </h1>
        <p style={{ color: 'var(--color-tertiary)', fontSize: 14, marginBottom: 48 }}>Last updated: June 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, color: 'var(--color-secondary)', lineHeight: 1.8, fontSize: 15 }}>
          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>1. 14-Day Money-Back Guarantee</h2>
            <p>
              We want you to be completely satisfied with DDalGGak. If you are not happy with your purchase for any reason,
              you may request a full refund within <strong style={{ color: 'var(--color-primary)' }}>14 days</strong> of the original purchase date.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>2. How to Request a Refund</h2>
            <p>To request a refund, please contact us with the following information:</p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              <li>Your order confirmation email or receipt</li>
              <li>The email address used for the purchase</li>
              <li>A brief reason for the refund (optional, but helps us improve)</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Send your request to:{' '}
              <a href="mailto:support@ddalggak.com" style={{ color: 'var(--accent-active)' }}>support@ddalggak.com</a>
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>3. Refund Processing</h2>
            <p>
              Refund requests are typically processed within <strong style={{ color: 'var(--color-primary)' }}>3-5 business days</strong>.
              The refund will be issued to the original payment method used for the purchase. Depending on your payment provider,
              it may take an additional 5-10 business days for the refund to appear on your statement.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>4. What Happens After a Refund</h2>
            <p>
              After a refund is processed, your license key will be deactivated. You may continue to use the Software,
              but you will no longer receive updates or support. You are welcome to repurchase at any time.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>5. Exceptions</h2>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Refund requests made after the 14-day window may be considered on a case-by-case basis.</li>
              <li>Repeated refund abuse (purchasing and refunding multiple times) may result in refusal of future sales.</li>
              <li>Free or promotional licenses are not eligible for refunds.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>6. Contact</h2>
            <p>
              For refund requests or questions about this policy, contact us at:{' '}
              <a href="mailto:support@ddalggak.com" style={{ color: 'var(--accent-active)' }}>support@ddalggak.com</a>
            </p>
          </section>
        </div>
      </main>

      <footer>
        <div className="footer-container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
            <Link to="/terms-of-service" style={{ color: 'var(--color-secondary)', fontSize: 13 }}>Terms of Service</Link>
            <Link to="/privacy-policy" style={{ color: 'var(--color-secondary)', fontSize: 13 }}>Privacy Policy</Link>
            <Link to="/refund-policy" style={{ color: 'var(--color-secondary)', fontSize: 13 }}>Refund Policy</Link>
          </div>
          <p>&copy; 2026 DDalGGak Project. Released under CC0 &amp; MIT License.</p>
        </div>
      </footer>
    </div>
  )
}
