"use client";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-gray-600">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 md:mb-0 text-center md:text-left"
        >
          © {new Date().getFullYear()} Blog Platform — Built with Next.js & Tailwind CSS
        </motion.div>
        <motion.div
          className="flex gap-4 text-lg justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
            <FaGithub />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            <FaTwitter />
          </a>
          <a href="https://www.linkedin.com/in/bhavesh-alawane-80a2a52b4/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors">
            <FaLinkedin />
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
