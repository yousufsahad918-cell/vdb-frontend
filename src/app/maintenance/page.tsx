export default function MaintenancePage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>We\'ll Be Back Soon</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #fff; padding: 20px; }
          .card { text-align: center; max-width: 480px; width: 100%; }
          .icon { font-size: 64px; margin-bottom: 24px; display: block; }
          h1 { font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 800; margin-bottom: 16px; }
          p { font-size: 1rem; color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 32px; }
          .wa-btn { display: inline-flex; align-items: center; gap: 10px; background: #25D366; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 100px; font-size: 1rem; font-weight: 700; }
          .dot { width: 8px; height: 8px; background: #25D366; border-radius: 50%; display: inline-block; margin-right: 6px; animation: pulse 2s infinite; }
          .status { font-size: 0.78rem; color: rgba(255,255,255,0.3); margin-top: 32px; letter-spacing: 0.05em; text-transform: uppercase; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        `}</style>
      </head>
      <body>
        <div className="card">
          <span className="icon">🛠️</span>
          <h1>We&apos;ll Be Back Soon</h1>
          <p>We are taking a short break to improve our service. We will be back shortly. In the meantime you can still reach us on WhatsApp.</p>
          <a className="wa-btn" href="https://wa.me/916282878843?text=Hi%2C%20I%20want%20to%20place%20an%20order." target="_blank" rel="noopener noreferrer">
            💬 Message Us on WhatsApp
          </a>
          <div className="status"><span className="dot"></span>Back soon</div>
        </div>
      </body>
    </html>
  );
}
