'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Roast {
  todo: string;
  roast: string;
  loading: boolean;
}

export default function RoastingPage() {
  const [roasts, setRoasts] = useState<Roast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateRoasts = async () => {
      try {
        // Get todos from sessionStorage
        const todosStr = sessionStorage.getItem('todos');
        if (!todosStr) {
          setError('No todos found');
          setLoading(false);
          return;
        }

        const todos = JSON.parse(todosStr);

        // Initialize roasts with todos
        setRoasts(todos.map((todo: string) => ({ todo, roast: '', loading: true })));

        // Call API to get roasts
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

        // Update roasts with generated ones
        setRoasts(
          todos.map((todo: string, index: number) => ({
            todo,
            roast: generatedRoasts[index] || 'Failed to roast this one',
            loading: false,
          }))
        );
      } catch (err) {
        console.error('Error:', err);
        setError('Something went wrong while roasting your todos');
        setLoading(false);
      }
    };

    generateRoasts();
  }, []);

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
          <div className="text-6xl mb-4 animate-pulse">🔥</div>
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8 pt-8">
          <h1 className="text-5xl font-bold mb-2">Your Roasts 🔥</h1>
          <p className="text-xl opacity-90">Here's the brutal truth about your todo list</p>
        </div>

        {/* Roasts */}
        <div className="space-y-4 mb-8">
          {roasts.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-md"
            >
              <div className="flex gap-4">
                <div className="text-4xl font-bold text-red-600 min-w-12">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {item.todo}
                  </h3>
                  {item.loading ? (
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed italic text-lg">
                      &quot;{item.roast}&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Message */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Now Go Get 'Em! 💪
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            You've been roasted. You've been laughed at. Now it's time to prove
            these roasts wrong. Pick one task. Do it. Come back tomorrow and get roasted
            again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              🔄 Get Roasted Again
            </Link>
            <button
              onClick={() => {
                const text = roasts
                  .map((r) => `${r.todo}: "${r.roast}"`)
                  .join('\n\n');
                navigator.clipboard.writeText(text).then(() => {
                  alert('Roasts copied!');
                });
              }}
              className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              📋 Copy All Roasts
            </button>
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
