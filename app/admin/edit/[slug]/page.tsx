"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Editor from "../../../../components/Editor";
import Toast from "../../../../components/Toast";

export default function EditPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

useEffect(() => {
    if (!slug) return;
    async function fetchPost() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`);
      if (!res.ok) return setLoading(false);
      const post = await res.json();
      setTitle(post.title);
      setContent(post.content || "");
      setTags(post.tags || []);
      setStatus(post.status || "draft");
      setScheduledAt(post.createdAt ? post.createdAt.slice(0, 16) : "");
      setCoverPreview(post.coverImage ? `${process.env.NEXT_PUBLIC_API_URL}${post.coverImage}` : null);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) setTags([...tags, tagInput]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCover(file || null);
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('createdAt', scheduledAt || new Date().toISOString());
    formData.append('status', status);
    tags.forEach(tag => formData.append('tags', tag));
    if (cover) formData.append('cover', cover);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        if (data.slug !== slug) {
          router.replace(`/admin/edit/${data.slug}`);
        } else {
          router.push("/admin/dashboard");
        }
      }, 1500);
    } else {
      alert("Failed to update post!");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading post...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <div>
            <label className="block font-semibold mb-2">Title</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              aria-label="Post Title"
            />
          </div>
          {/* Tags */}
          <div>
            <label className="block font-semibold mb-2">Tags</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                  {tag}
                  <button type="button" className="ml-1 text-red-500" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
                placeholder="Add tag"
                aria-label="Add tag"
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
            {coverPreview && (
              <img src={coverPreview} alt="Cover Preview" className="mt-2 max-h-48 rounded shadow" />
            )}
          </div>
          <div>
            <label className="block font-semibold mb-2">Content</label>
            <Editor value={content} onChange={setContent} />
          </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Post
        </button>
      </form>
      {showToast && <Toast message="Post updated successfully!" />}
    </div>
  );
}
