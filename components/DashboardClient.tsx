"use client";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { PencilSquareIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardClient({
  adminName,
}: {
  adminName: string;
}) {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${apiBase}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, [apiBase]);

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));

  const filteredPosts = posts.filter(
    (post) =>
      (post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.slug.includes(search.toLowerCase())) &&
      (!filterTag || post.tags.includes(filterTag))
  );

  const handleDelete = async (slug: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setDeletingSlug(slug);
      await fetch(`${apiBase}/api/posts/${slug}`, { method: "DELETE" });
      setPosts(posts.filter((post) => post.slug !== slug));
      setDeletingSlug(null);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading posts...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {adminName}</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + Create New Post
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
          aria-label="Search posts"
        />
        <select
          value={filterTag ?? ""}
          onChange={(e) => setFilterTag(e.target.value || null)}
          className="border border-gray-300 rounded px-3 py-2"
          aria-label="Filter by tag"
        >
          <option value="">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            All Posts ({filteredPosts.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Slug: /{post.slug}</span>
                    <span>Created: {post.createdAt}</span>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status}
                    </span>
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium gap-1"
                  >
                    <EyeIcon className="w-5 h-5" /> View
                  </Link>
                  <Link
                    href={`/admin/edit/${post.slug}`}
                    className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium gap-1"
                  >
                    <PencilSquareIcon className="w-5 h-5" /> Edit
                  </Link>
                  <button
                    className="flex items-center text-red-600 hover:text-red-700 font-medium gap-1"
                    onClick={() => handleDelete(post.slug)}
                    disabled={deletingSlug === post.slug}
                  >
                    <TrashIcon className="w-5 h-5" />
                    {deletingSlug === post.slug ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
