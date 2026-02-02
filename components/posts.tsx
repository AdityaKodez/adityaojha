import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export async function Posts() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 3); // Show top 3 recent posts

  return (
    <section className="space-y-4 border-t border-dashed pt-4">
      <div className="flex items-center justify-between px-6 border-y py-2">
        <h2 className="text-xl font-semibold">Latest Posts</h2>
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="border-t border-dashed px-6">
        {recentPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <article className="py-4 border-b border-dashed flex justify-between items-center group-hover:bg-muted/50 transition-colors px-2 -mx-2 rounded-none">
              <span className="font-medium group-hover:text-primary transition-colors truncate pr-4">
                {post.metadata.title}
              </span>
              <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
                {post.metadata.publishedAt}
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
