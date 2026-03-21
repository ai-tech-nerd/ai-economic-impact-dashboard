import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '../shared/AnimatedNumber';

interface TotalCounterProps {
  total: number;
  companyCount: number;
  eventCount: number;
}

export function TotalCounter({ total, companyCount, eventCount }: TotalCounterProps) {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith('/embed') || location.pathname.startsWith('/widget');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-surface-900 to-surface-800 rounded-2xl p-8 text-white text-center relative"
    >
      {!isEmbed && <WidgetEmbedButton />}
      <p className="text-surface-400 text-sm uppercase tracking-wider mb-2">
        Total Jobs Displaced by AI
      </p>
      <div className="text-5xl md:text-7xl font-bold mb-4">
        <AnimatedNumber value={total} className="text-primary-400" />
      </div>
      <p className="text-surface-400 text-sm mb-6">
        Since November 30, 2022 (ChatGPT Launch)
      </p>
      <div className="flex justify-center gap-8">
        <div>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={companyCount} duration={1500} />
          </div>
          <p className="text-surface-400 text-xs uppercase tracking-wider">Companies</p>
        </div>
        <div>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={eventCount} duration={1500} />
          </div>
          <p className="text-surface-400 text-xs uppercase tracking-wider">Events</p>
        </div>
      </div>
    </motion.div>
  );
}

function WidgetEmbedButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState('');

  const variants = [
    {
      label: 'Dark (default)',
      code: '<iframe src="https://aishift.michaelkristof.com/#/widget/stats" width="100%" height="160" frameborder="0" style="border: none;"></iframe>',
    },
    {
      label: 'Light',
      code: '<iframe src="https://aishift.michaelkristof.com/#/widget/stats?theme=light" width="100%" height="160" frameborder="0" style="border: none;"></iframe>',
    },
    {
      label: 'Transparent',
      code: '<iframe src="https://aishift.michaelkristof.com/#/widget/stats?theme=transparent" width="100%" height="160" frameborder="0" style="border: none;"></iframe>',
    },
  ];

  const handleCopy = async (code: string, label: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-surface-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        title="Embed this widget"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Embed
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Embed Stats Widget</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-surface-400 hover:text-surface-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-surface-500 mb-4">
              Embed live stats that auto-update. Choose a theme:
            </p>
            <div className="space-y-3">
              {variants.map((v) => (
                <div key={v.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-surface-700">{v.label}</span>
                    <button
                      onClick={() => handleCopy(v.code, v.label)}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                        copied === v.label
                          ? 'bg-green-100 text-green-700'
                          : 'bg-white border border-surface-300 text-surface-600 hover:bg-surface-50'
                      }`}
                    >
                      {copied === v.label ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-surface-50 border border-surface-200 rounded-lg p-2 text-xs text-surface-600 overflow-x-auto whitespace-pre-wrap break-all">
                    {v.code}
                  </pre>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-surface-400">
              <p>Adjust <code className="bg-surface-100 px-1 rounded">height</code> as needed. Numbers update automatically from live data.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
