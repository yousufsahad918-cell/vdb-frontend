export default function MaintenancePage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>We'll Be Back Soon — VapeDeliveryBangalore</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #080808; font-family: 'Inter', -apple-system, sans-serif; color: #fff; padding: 24px; }
          .card { text-align: center; max-width: 420px; width: 100%; }
          .logo { font-size: 13px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 48px; }
          .icon-wrap { width: 88px; height: 88px; background: linear-gradient(135deg, #1a1a1a, #111); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 32px; font-size: 40px; }
          h1 { font-size: clamp(1.6rem, 6vw, 2.2rem); font-weight: 900; line-height: 1.1; margin-bottom: 16px; letter-spacing: -0.03em; }
          .sub { font-size: 0.95rem; color: rgba(255,255,255,0.4); line-height: 1.7; margin-bottom: 48px; max-width: 320px; margin-left: auto; margin-right: auto; }
          .divider { width: 48px; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); margin: 0 auto 48px; }
          .status-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px; }
          .dot { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; animation: pulse 2s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
          .status-text { font-size: 12px; font-weight: 600; color: #f59e0b; letter-spacing: 0.08em; text-transform: uppercase; }
          .eta { font-size: 12px; color: rgba(255,255,255,0.2); letter-spacing: 0.04em; }
          .features { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 48px; }
          .feature { background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px; text-align: left; }
          .feature-icon { font-size: 20px; margin-bottom: 8px; display: block; }
          .feature-title { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 4px; }
          .feature-desc { font-size: 11px; color: rgba(255,255,255,0.25); line-height: 1.5; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="logo">VapeDeliveryBangalore</div>
          <div className="icon-wrap">🛠️</div>
          <h1>We&apos;ll Be Back<br />Very Soon</h1>
          <p className="sub">We are making some improvements to serve you better. Our full service will be restored shortly.</p>
          <div className="divider" />
          <div className="status-row">
            <span className="dot" />
            <span className="status-text">Under Maintenance</span>
          </div>
          <div className="eta">Expected to be back within a few days</div>
          <div className="features">
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <div className="feature-title">Fast Delivery</div>
              <div className="feature-desc">30-45 min across Bangalore</div>
            </div>
            <div className="feature">
              <span className="feature-icon">✅</span>
              <div className="feature-title">100% Original</div>
              <div className="feature-desc">Verified authentic products</div>
            </div>
            <div className="feature">
              <span className="feature-icon">📦</span>
              <div className="feature-title">Discreet</div>
              <div className="feature-desc">Plain packaging always</div>
            </div>
            <div className="feature">
              <span className="feature-icon">🌙</span>
              <div className="feature-title">Late Night</div>
              <div className="feature-desc">Available till late</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
