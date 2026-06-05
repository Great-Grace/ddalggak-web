import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--color-tertiary)', fontSize: 14, marginBottom: 48 }}>Last updated: June 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, color: 'var(--color-secondary)', lineHeight: 1.8, fontSize: 15 }}>
          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>1. Overview</h2>
            <p>
              DDalGGak (&quot;we&quot;, &quot;us&quot;, or &quot;the Software&quot;) is designed with privacy as a core principle.
              This Privacy Policy explains our approach: we simply do not collect any data.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>2. Data Collection — None</h2>
            <p>
              DDalGGak operates entirely on your local device. The Software:
            </p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              <li>Does <strong>not</strong> require an internet connection to function.</li>
              <li>Does <strong>not</strong> collect, transmit, or store keystrokes, typing patterns, or any input data.</li>
              <li>Does <strong>not</strong> include analytics, telemetry, or tracking scripts of any kind.</li>
              <li>Does <strong>not</strong> send data to any server, including our own.</li>
              <li>Does <strong>not</strong> use cookies or similar tracking technologies.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>3. Local Storage</h2>
            <p>
              All preferences (selected switch type, volume settings, custom soundpack paths) are stored locally
              on your device using the operating system&apos;s standard preference storage mechanisms. This data never leaves your device.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>4. Payment Processing</h2>
            <p>
              When you purchase a license, payment is processed by our third-party payment provider (Paddle).
              We do not have access to your full payment card details. Please refer to{' '}
              <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-active)' }}>
                Paddle&apos;s Privacy Policy
              </a>{' '}
              for information on how they handle your payment data.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>5. Third-Party Services</h2>
            <p>
              Our website (ddalggak-web.vercel.app) is hosted on Vercel. Standard web server logs (IP address, user agent)
              may be collected by Vercel for operational purposes. See{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-active)' }}>
                Vercel&apos;s Privacy Policy
              </a>.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>6. Children&apos;s Privacy</h2>
            <p>
              The Software does not knowingly collect any personal information from anyone, including children under 13.
              Since no data is collected, the Software is safe for users of all ages.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>7. Changes to This Policy</h2>
            <p>
              If this policy changes (for example, if a future feature requires data collection), we will update this page
              and notify users before any data collection begins. Currently, no changes are planned.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>8. Contact</h2>
            <p>
              For privacy-related questions, contact us at:{' '}
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
