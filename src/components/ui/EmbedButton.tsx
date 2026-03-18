import { useState } from 'react';

interface EmbedButtonProps {
  path: string;
  title: string;
}

export function EmbedButton({ path, title }: EmbedButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedUrl = `https://aishift.michaelkristof.com/#/embed${path}`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="700" frameborder="0" title="${title}" style="border: 1px solid #e2e8f0; border-radius: 8px;"></iframe>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-500 bg-surface-100 hover:bg-surface-200 rounded-lg transition-colors"
        title="Embed this view"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Embed
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Embed this view</h3>
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
              Copy the code below and paste it into your website's HTML to embed the <strong>{title}</strong> view.
            </p>
            <div className="relative">
              <pre className="bg-surface-50 border border-surface-200 rounded-lg p-3 text-xs text-surface-700 overflow-x-auto whitespace-pre-wrap break-all">
                {iframeCode}
              </pre>
              <button
                onClick={handleCopy}
                className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-white border border-surface-300 text-surface-600 hover:bg-surface-50'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="mt-4 text-xs text-surface-400">
              <p>Adjust <code className="bg-surface-100 px-1 rounded">height</code> as needed. The embed is responsive to width.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
