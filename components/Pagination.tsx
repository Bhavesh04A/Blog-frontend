"use client";
import { motion } from "framer-motion";

export default function Pagination({
  totalPages,
  page,
  setPage,
}: {
  totalPages: number;
  page: number;
  setPage: (p: number) => void;
}) {
  return (
    <motion.div
      className="flex justify-center gap-2 mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button
        className="px-3 py-1 rounded border bg-white hover:bg-blue-50 transition"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        aria-label="Previous Page"
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          className={`px-3 py-1 rounded border transition ${
            page === idx + 1
              ? "bg-blue-600 text-white shadow"
              : "bg-white hover:bg-blue-50"
          }`}
          onClick={() => setPage(idx + 1)}
          aria-label={`Page ${idx + 1}`}
        >
          {idx + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded border bg-white hover:bg-blue-50 transition"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        aria-label="Next Page"
      >
        Next
      </button>
    </motion.div>
  );
}
