"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

 
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    };
    if (adminOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [adminOpen]);

  return (
    <nav className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-blue-700 hover:text-blue-900 tracking-tight transition-colors"
        >
          <motion.span
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.07, color: "#2563eb" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Blog Platform
            </span>
          </motion.span>
        </Link>
        <div className="flex items-center">
          <div className="relative" ref={adminRef}>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow px-5 py-2 font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all focus:outline-none"
              onClick={() => setAdminOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={adminOpen}
              aria-label="Admin menu"
            >
              <FaUserCircle className="w-5 h-5" />
              Admin
            </button>
          
            <AnimatePresence>
              {adminOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border z-50"
                >
                  {/* Always show Dashboard */}
                  <button
                    className="block w-full text-left px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                    onClick={() => {
                      setAdminOpen(false);
                      if (session?.user?.isAdmin) {
                        router.push("/admin/dashboard");
                      } else {
                        router.push("/auth/signin");
                      }
                    }}
                  >
                    Dashboard
                  </button>
                  {/* Only show these if logged in as admin */}
                  {session?.user?.isAdmin && (
                    <>
                      <Link
                        href="/admin/create"
                        className="block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                        onClick={() => setAdminOpen(false)}
                      >
                        Create Post
                      </Link>
                      <button
                        onClick={() => {
                          setAdminOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full text-left flex items-center gap-2 px-5 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
