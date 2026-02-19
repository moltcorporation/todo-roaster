'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './roasting.css';

interface Roast {
  todo: string;
  roast: string;
  loading: boolean;
  index: number;
}

const EMOJI_REACTIONS = ['🔥', '💀', '😂', '🎯', '💯', '😭', '⚡', '🚀'];

export default function RoastingPage() {
  const [roasts, setRoasts] = useState<Roast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<number, string>>({});

  useEffect(() => {
    const generateRoasts = async () => {
      try {
        const todosStr = sessionStorage.getItem('todos');
        if (!todosStr) {
          setError('No todos found');
          setLoading(false);
          return;
        }

        const todos = JSON.parse(todosStr);
        setRoasts(
          todos.map((todo: string, index: number) => ({
            todo,
            roast: '',
            loading: true,
            index,
          }))
        );

        const response = await fetch('/api/roast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todos }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate roasts');
        }

        const data = await response.json();
        const generatedRoasts = data.roasts;

        setRoasts(
          todos.map((todo: string, index: number) => ({
            todo,
            roast: generatedRoasts[index] || 'Failed to roast this one',
            loading: false,
            index,
          }))
        );
      } catch (err) {
        console.error('Error:', err);
        setError('Something went wrong while roasting your todos');
      } finally {
        setLoading(false);
      }
    };

    generateRoasts();
  }, []);

  const addReaction = (index: number, emoji: string) => {
    setReactions((prev) => ({
      ...prev,
      [index]: prev[index] === emoji ? '' : emoji,
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-purple-600 to-pink-500 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  if (loading || roasts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-purple-600 to-pink-500 p-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="text-6xl mb-4 flame-animation">🔥</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Roasting Your Todos
          </h2>
          <p className="text-gray-600">
            Getting ready to deliver some brutal truths...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-purple-600 to-pink-500 p-4">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .roast-card {
          animation: slideInUp 0.6s ease-out forwards;
        }

        .roast-card:nth-child(1) { animation-delay: 0.1s; }
        .roast-card:nth-child(2) { animation-delay: 0.2s; }
        .roast-card:nth-child(3) { animation-delay: 0.3s; }
        .roast-card:nth-child(4) { animation-delay: 0.4s; }
        .roast-card:nth-child(5) { animation-delay: 0.5s; }
        .roast-card:nth-child(6) { animation-delay: 0.6s; }

        .flame-animation {
          animation: pulse 1s ease-in-out infinite;
        }

        .reaction-glow {
          animation: pulse 0.4s ease-out;
        }

        .roast-number {
          background: linear-gradient(135deg, #ff0000, #ff6b00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .shimmer-loading {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8 pt-8" style={{ animation: 'slideInDown 0.6s ease-out' }}>
          <h1 className="text-5xl font-bold mb-2">Your Roasts 🔥</h1>
          <p className="text-xl opacity-90">
            Here's the brutal truth about your todo list
          </p>
        </div>

        {/* Roasts Grid */}
        <div className="space-y-4 mb-8">
          {roasts.map((item) => (
            <div key={item.index} className="roast-card">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow p-6 backdrop-blur-md">
                <div className="flex gap-4">
                  {/* Number Badge */}
                  <div className="text-5xl font-black roast-number min-w-16 text-center">
                    {item.index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Todo Text */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                      {item.todo}
                    </h3>

                    {/* Roast or Loading */}
                    {item.loading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-full shimmer-loading rounded"></div>
                        <div className="h-4 w-3/4 shimmer-loading rounded"></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 leading-relaxed italic text-base mb-4">
                          &quot;{item.roast}&quot;
                        </p>

                        {/* Emoji Reactions */}
                        <div className="flex gap-2 flex-wrap">
                          {EMOJI_REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(item.index, emoji)}
                              className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                                reactions[item.index] === emoji
                                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white scale-110 reaction-glow'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Section */}
        <div className="roast-card" style={{ animationDelay: `${roasts.length * 0.1}s` }}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Now Go Get 'Em! 💪
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              You've been roasted. You've been laughed at. Now it's time to prove
              these roasts wrong. Pick one task. Do it. Come back tomorrow and get roasted
              again.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition transform"
              >
                🔄 Get Roasted Again
              </Link>
              <button
                onClick={() => {
                  const text = roasts
                    .map((r) => `${r.todo}: "${r.roast}"`)
                    .join('\n\n');
                  navigator.clipboard.writeText(text).then(() => {
                    alert('Roasts copied to clipboard!');
                  });
                }}
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 hover:scale-105 transition transform"
              >
                📋 Copy All Roasts
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/70 text-center text-sm">
          Remember: Procrastination is just planning in reverse.
        </p>
      </div>
    </div>
  );
}
