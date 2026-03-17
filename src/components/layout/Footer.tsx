export function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-400 border-t border-surface-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-2">AI Economic Impact Dashboard</h3>
            <p className="text-sm">
              Tracking the workforce transformation driven by artificial intelligence.
              Data verified against direct company statements and credible sources.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Data Integrity</h3>
            <p className="text-sm">
              Every data point links to its original source. We only include events
              confirmed through official company statements, earnings calls, or
              credible reporting. Events are cross-referenced with research including
              Anthropic&apos;s{' '}
              <a
                href="https://www.anthropic.com/research/labor-market-impacts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300"
              >
                labor market impact analysis
              </a>{' '}
              to distinguish AI-driven displacement from pandemic-era over-hiring corrections.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">About</h3>
            <p className="text-sm">
              Created by{' '}
              <a
                href="https://michaelkristof.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300"
              >
                Michael Kristof
              </a>
              . This dashboard accompanies "The AI Shift" — a practical guide for
              understanding and preparing for AI transformation.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-surface-700 text-center text-sm">
          <p>Timeline begins November 30, 2022 — the day ChatGPT launched.</p>
        </div>
      </div>
    </footer>
  );
}
