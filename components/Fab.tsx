"use client";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function Fab() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link
        href="/admin/create"
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl text-3xl"
        title="Create New Post"
      >
        <PlusIcon className="w-8 h-8" />
      </Link>
    </motion.div>
  );
}
