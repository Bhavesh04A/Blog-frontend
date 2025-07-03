"use client";
import { useState, FormEvent } from "react";
import Editor from "../../../components/Editor";
import { generateSlug } from "../../../utils/slugify";
import { useRouter } from "next/navigation";
import Toast from "../../../components/Toast";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCover(file || null);
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) setTags([...tags, tagInput]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('createdAt', scheduledAt || new Date().toISOString());
    formData.append('status', status);
    tags.forEach(tag => formData.append('tags', tag));
    if (cover) formData.append('cover', cover);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        router.push("/admin/dashboard");
      }, 1500);
    } else {
      alert("Failed to create post!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Create New Post
      </motion.h1>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-2">Title</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full"
              type="text"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              required
              aria-label="Post Title"
            />
          </div>
          {/* Slug */}
          <div>
            <label className="block font-semibold mb-2">Slug</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full bg-gray-100"
              type="text"
              value={slug}
              readOnly
              aria-label="Slug"
            />
          </div>
          {/* Tags */}
          <div>
            <label className="block font-semibold mb-2">Tags</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              <AnimatePresence>
                {tags.map(tag => (
                  <motion.span
                    key={tag}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                  >
                    {tag}
                    <button type="button" className="ml-1 text-red-500" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>×</button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
                placeholder="Add tag"
                aria-label="Add tag"
                onKeyDown={e => e.key === "Enter" ? (addTag(), e.preventDefault()) : undefined}
              />
              <button type="button" className="bg-blue-600 text-white px-2 py-1 rounded" onClick={addTag}>Add</button>
            </div>
          </div>
          {/* Status */}
          <div>
            <label className="block font-semibold mb-2">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as "draft" | "published")}
              className="border border-gray-300 rounded px-3 py-2"
              aria-label="Status"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          {/* Schedule */}
          <div>
            <label className="block font-semibold mb-2">Schedule for</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              aria-label="Schedule for"
            />
          </div>
          {/* Cover Image */}
          <div>
            <label className="block font-semibold mb-2">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleCoverChange} aria-label="Cover Image" />
            <AnimatePresence>
              {coverPreview && (
                <motion.img
                  key={coverPreview}
                  src={coverPreview}
                  alt="Cover Preview"
                  className="mt-2 max-h-48 rounded shadow"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </div>
          {/* Content */}
          <div>
            <label className="block font-semibold mb-2">Content</label>
            <Editor value={content} onChange={setContent} />
          </div>
        </div>
        <motion.button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Creating...
            </span>
          ) : "Create Post"}
        </motion.button>
      </motion.form>
      {showToast && <Toast message="Post created successfully!" />}
    </div>
  );
}
