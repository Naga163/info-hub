import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface Quote {
  text: string;
  author: string;
}

export default function Quotes() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuote = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quotes`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch quote');
      }

      const data = await response.json();
      setQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Motivational Quotes</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-orange-400 to-rose-600 rounded-lg shadow-lg p-8 md:p-12 text-white min-h-[300px] flex flex-col justify-between">
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          </div>
        ) : quote ? (
          <>
            <div className="flex-1 flex flex-col justify-center">
              <Sparkles className="w-10 h-10 mb-6 mx-auto opacity-80" />

              <blockquote className="text-2xl md:text-3xl font-serif italic text-center mb-6 leading-relaxed">
                "{quote.text}"
              </blockquote>

              <p className="text-xl text-center font-semibold opacity-90">
                — {quote.author}
              </p>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={fetchQuote}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-semibold backdrop-blur-sm"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                New Quote
              </button>
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-6 text-center text-gray-600">
        <p className="text-sm">Click the button above to get a fresh dose of motivation</p>
      </div>
    </div>
  );
}
