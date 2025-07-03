import { notFound } from "next/navigation";
import PostContent from "@/components/PostContent";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`);
  if (!res.ok) return {};
  const post = await res.json();
  if (!post || !post.content) return {};
  return {
    title: post.title,
    description: post.content.replace(/<[^>]+>/g, '').slice(0, 150),
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`, { cache: "no-store" });
  if (!res.ok) return notFound();
  const post = await res.json();
  if (!post || !post.content) return notFound();

  return <PostContent post={post} />;
}
