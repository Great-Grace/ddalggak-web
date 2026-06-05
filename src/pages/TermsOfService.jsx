import { Link } from 'react-router-dom'

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p style={{ color: 'var(--color-tertiary)', fontSize: 14, marginBottom: 48 }}>Last updated: June 2026</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, color: 'var(--color-secondary)', lineHeight: 1.8, fontSize: 15 }}>
          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>1. Acceptance of Terms</h2>
            <p>
              By purchasing, downloading, or using DDalGGak (the &quot;Software&quot;), you agree to be bound by these Terms of Service.
              If you do not agree, do not use the Software.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>2. License Grant</h2>
            <p>
              Upon purchase, you are granted a non-exclusive, non-transferable, perpetual license to use the Software on your personal devices.
              This license includes lifetime updates at no additional cost.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>3. Restrictions</h2>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>You may not redistribute, resell, or sublicense the Software.</li>
              <li>You may not reverse-engineer, decompile, or disassemble the Software.</li>
              <li>You may not remove any proprietary notices or labels from the Software.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>4. Privacy</h2>
            <p>
              DDalGGak operates 100% locally on your device. The Software does not collect, transmit, or store any personal data,
              keystroke logs, or telemetry. See our <Link to="/privacy-policy" style={{ color: 'var(--accent-active)' }}>Privacy Policy</Link> for details.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>5. Refunds</h2>
            <p>
              We offer a 14-day money-back guarantee. If you are not satisfied with the Software, contact us within 14 days of purchase for a full refund.
              See our <Link to="/refund-policy" style={{ color: 'var(--accent-active)' }}>Refund Policy</Link> for details.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>6. Disclaimer of Warranties</h2>
            <p>
              The Software is provided &quot;as is&quot; without warranty of any kind, express or implied, including but not limited to
              the warranties of merchantability, fitness for a particular purpose, and noninfringement.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>7. Limitation of Liability</h2>
            <p>
              In no event shall the authors or copyright holders be liable for any claim, damages, or other liability,
              whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the Software
              or the use or other dealings in the Software.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date.
              Continued use of the Software after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 style={{ color: 'var(--color-primary)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>9. Contact</h2>
            <p>
              For questions about these Terms, contact us at:{' '}
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
