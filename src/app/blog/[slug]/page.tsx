import { getDb, getSettings } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDb();
  const blog = await db.get("SELECT title, content FROM blogs WHERE slug = ?", [slug]);
  if (!blog) return { title: 'Post Not Found' };
  
  return {
    title: `${blog.title} | Stars777`,
    description: blog.content.substring(0, 160).replace(/<[^>]*>/g, '')
  };
}

export default async function BlogSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const settings = await getSettings();
  const blog = await db.get("SELECT * FROM blogs WHERE slug = ?", [slug]);
  
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-400 mb-8">Article not found.</p>
          <Link href="/blogs" className="text-secondary font-bold">Back to Blogs</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-grow pt-32 pb-20">
        <article className="max-w-4xl mx-auto px-4">
          <div className="mb-10 text-center">
            <span className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4 block">
              {blog.category || 'General'} • {new Date(blog.created_at).toLocaleDateString()}
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{blog.title}</h1>
          </div>

          {blog.image_url && (
            <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img src={blog.image_url} alt={blog.title} className="w-full h-auto max-h-[500px] object-cover" />
            </div>
          )}

          <div 
            className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between group">
            <Link href="/blogs" className="flex items-center gap-2 font-bold text-gray-400 hover:text-white transition">
              <i className="fa-solid fa-arrow-left text-secondary"></i> Back to All Articles
            </Link>
          </div>
        </article>
      </main>
      <Footer settings={settings} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    </>
  );
}
