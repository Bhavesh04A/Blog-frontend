"use client";
import { useEffect, useState } from "react";
import { SparklesIcon, PencilSquareIcon, MagnifyingGlassIcon, DocumentTextIcon, CheckCircleIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import PostCard from "@/components/PostCard";
import Pagination from '@/components/Pagination';
import { motion } from "framer-motion";

const POSTS_PER_PAGE = 4;

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const publishedPosts = posts.filter(p => p.status === "published");
  const totalPages = Math.max(1, Math.ceil(publishedPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = publishedPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const totalPosts = posts.length;
  const publishedCount = publishedPosts.length;
  const draftCount = posts.filter(p => p.status === "draft").length;

  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        Welcome to the <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">Blog Platform</span>
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Create, edit, and manage blog posts with a rich text editor and SEO-friendly URLs. Posts are stored in MongoDB.
      </motion.p>

      {/* Feature Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } }
        }}
      >
        <FeatureCard
          icon={<SparklesIcon className="w-8 h-8 text-purple-500 mb-3" />}
          title="Rich Text Editor"
          desc="Write posts with formatting, images, and code blocks."
        />
        <FeatureCard
          icon={<PencilSquareIcon className="w-8 h-8 text-blue-500 mb-3" />}
          title="SEO-Friendly"
          desc="Automatic slug, meta tags, and best practices for discoverability."
        />
        <FeatureCard
          icon={<MagnifyingGlassIcon className="w-8 h-8 text-cyan-500 mb-3" />}
          title="Admin Dashboard"
          desc="Manage posts with create, edit, and delete operations."
        />
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="flex flex-col md:flex-row gap-8 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <StatCard
          icon={<DocumentTextIcon className="w-7 h-7 text-blue-500" />}
          label="Total Posts"
          value={loading ? "..." : totalPosts}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon={<CheckCircleIcon className="w-7 h-7 text-green-500" />}
          label="Published"
          value={loading ? "..." : publishedCount}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          icon={<ArchiveBoxIcon className="w-7 h-7 text-yellow-500" />}
          label="Drafts"
          value={loading ? "..." : draftCount}
          color="bg-yellow-100 text-yellow-700"
        />
      </motion.div>

      {/* Post Previews */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {loading ? (
          <div className="col-span-2 text-center text-gray-500 text-lg">Loading posts...</div>
        ) : paginatedPosts.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500 text-lg">No posts yet. Check back soon!</div>
        ) : (
          paginatedPosts.map(post => (
            <motion.div
              key={post.slug}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <PostCard
                title={post.title}
                slug={post.slug}
                excerpt={
                  post.content
                    ? post.content.replace(/<[^>]+>/g, '').slice(0, 120) + "..."
                    : ""
                }
                date={post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                tags={post.tags}
                coverImage={post.coverImage}
              />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      <Pagination totalPages={totalPages} page={page} setPage={setPage} />
    </section>
  );
}

// FeatureCard with animation
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 4px 24px rgba(59,130,246,0.12)" }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-2xl shadow-lg p-6 border flex flex-col items-center text-center"
    >
      {icon}
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}

// StatCard with icon
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: any; color: string }) {
  return (
    <div className={`flex items-center gap-3 px-6 py-4 rounded-lg font-semibold text-center shadow-sm ${color}`}>
      {icon}
      <div>
        <div className="text-2xl">{value}</div>
        <div className="text-sm">{label}</div>
      </div>
    </div>
  );
}
