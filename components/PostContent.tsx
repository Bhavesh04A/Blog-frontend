"use client";
import { motion } from "framer-motion";

export default function PostContent({ post }: { post: any }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  return (
    <motion.article
      className="max-w-3xl mx-auto py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {post.coverImage && (
        <motion.img
          src={`${apiBase}${post.coverImage}`}
          alt={post.title}
          className="mb-8 rounded shadow max-h-96 w-full object-cover"
          initial={{ opacity: 0.7, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-500 mb-6">{new Date(post.createdAt).toLocaleDateString()}</div>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </motion.article>
  );
}
