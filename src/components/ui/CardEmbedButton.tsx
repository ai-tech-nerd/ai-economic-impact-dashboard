import { useState } from 'react';

interface CardEmbedButtonProps {
  widgetPath: string;
  title: string;
  height?: number;
}

export function CardEmbedButton({ widgetPath, title, height = 400 }: CardEmbedButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedUrl = `https://aishift.michaelkristof.com/#/widget/${widgetPath}`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${height}" frameborder="0" title="${title}" style="border: none;"></iframe>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-surface-400 hover:text-surface-600 bg-surface-50 hover:bg-surface-100 rounded transition-colors"
        title="Embed this widget"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Embed
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Embed {title}</h3>
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
              Copy the code below to embed this widget. Data updates automatically.
            </p>
            <div className="relative">
              <pre className="bg-surface-50 border border-surface-200 rounded-lg p-3 text-xs text-surface-600 overflow-x-auto whitespace-pre-wrap break-all">
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
              <p>Adjust <code className="bg-surface-100 px-1 rounded">height</code> as needed. The widget is responsive to width.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
