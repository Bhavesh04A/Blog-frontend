"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${apiBase}/api/posts/${slug}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setLoading(false);
      });
  }, [slug, apiBase]);

  const addComment = async () => {
    if (!input.trim() || !author.trim()) return;
    setPosting(true);
    const res = await fetch(`${apiBase}/api/posts/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, text: input })
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments([...comments, newComment]);
      setInput("");
    }
    setPosting(false);
  };

  return (
    <div className="mt-8">
      <h3 className="font-bold mb-2">Comments</h3>
      {loading ? (
        <div>Loading comments...</div>
      ) : (
        <div className="space-y-2 mb-4">
          {comments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400"
            >
              No comments yet.
            </motion.div>
          )}
          <AnimatePresence>
            {comments.map(c => (
              <motion.div
                key={c._id || c.createdAt}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-gray-100 rounded px-3 py-2"
              >
                <span className="font-semibold">{c.author}:</span> {c.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/4"
          placeholder="Your name"
          aria-label="Your name"
        />
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          placeholder="Add a comment..."
          aria-label="Add a comment"
          onKeyDown={e => { if (e.key === "Enter") addComment(); }}
        />
        <button
          onClick={addComment}
          className="bg-blue-600 text-white px-4 py-2 rounded transition hover:bg-blue-700"
          disabled={posting}
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
