'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [pasteMode, setPasteMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input.trim()]);
      setInput('');
    }
  };

  const handlePaste = () => {
    const lines = input.split('\n').filter((line) => line.trim());
    setTodos([...todos, ...lines.map((l) => l.trim())]);
    setInput('');
    setPasteMode(false);
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (todos.length === 0) {
      alert('Add at least one todo first!');
      return;
    }

    setLoading(true);

    try {
      // Store todos in sessionStorage for results page
      sessionStorage.setItem('todos', JSON.stringify(todos));
      router.push('/roasting');
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (pasteMode) {
        handlePaste();
      } else {
        addTodo();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-purple-600 to-pink-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-3">Todo Roaster 🔥</h1>
          <p className="text-xl opacity-90">
            Submit your procrastination list. Get roasted. Get motivated.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          {/* Input Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {pasteMode ? 'Paste Your Todos' : 'Add Your Todos'}
            </h2>

            {!pasteMode ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., Learn Rust, call mom, fix that bug..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none text-gray-900"
                />
                <button
                  onClick={addTodo}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Add
                </button>
                <button
                  onClick={() => setPasteMode(true)}
                  className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Paste
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Paste multiple todos (one per line)..."
                  className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none text-gray-900 font-mono text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handlePaste}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Paste Todos
                  </button>
                  <button
                    onClick={() => setPasteMode(false)}
                    className="px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Todo List */}
          {todos.length > 0 && (
            <div className="mb-8 pb-8 border-b-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Your Todos ({todos.length})
              </h3>
              <div className="space-y-2">
                {todos.map((todo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xl text-purple-600 font-bold">
                        {index + 1}.
                      </span>
                      <span className="text-gray-900">{todo}</span>
                    </div>
                    <button
                      onClick={() => removeTodo(index)}
                      className="px-3 py-1 text-red-600 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              onClick={handleSubmit}
              disabled={todos.length === 0 || loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition ${
                todos.length === 0 || loading
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {loading ? '🔥 Roasting Your Todos...' : '🔥 Roast Me!'}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">💡 Tip:</span> The more todos you add, the better the roasts. Include
              everything—big projects, tiny tasks, things you said you'd do 3 months ago.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/70 text-center text-sm">
          todo-roaster™ • procrastination meets motivation
        </p>
      </div>
    </div>
  );
}
