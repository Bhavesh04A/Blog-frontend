"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PostCard({
  title,
  slug,
  excerpt,
  date,
  tags,
  coverImage,
}: {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage?: string;
}) {

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  return (
    <motion.div
      whileHover={{ scale: 1.025, boxShadow: "0 8px 32px rgba(59,130,246,0.12)" }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-xl shadow p-6 border hover:shadow-lg transition"
    >
      {coverImage && (
        <img
          src={`${apiBase}${coverImage}`}
          alt={title}
          className="mb-4 rounded shadow max-h-48 w-full object-cover"
        />
      )}
      <Link href={`/posts/${slug}`}>
        <h2 className="text-2xl font-bold text-blue-700 hover:underline mb-2">{title}</h2>
      </Link>
      <div className="text-gray-500 text-sm mb-2">{date}</div>
      <p className="text-gray-700 mb-4">{excerpt}</p>
      <div className="flex gap-2 flex-wrap">
        {tags?.map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
            {tag}
          </span>
        ))}
      </div>
      <Link href={`/posts/${slug}`} className="inline-block mt-4 text-blue-600 hover:underline font-semibold">
        Read More &rarr;
      </Link>
    </motion.div>
  );
}
