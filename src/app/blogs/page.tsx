import { getDb, getSettings } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default async function BlogsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const db = await getDb();
  const settings = await getSettings();
  
  let query = "SELECT * FROM blogs ORDER BY created_at DESC";
  let params: any[] = [];
  
  if (category && category !== 'All') {
    query = "SELECT * FROM blogs WHERE category = ? ORDER BY created_at DESC";
    params = [category];
  }
  
  const blogs = await db.all(query, params);
  const categories = await db.all("SELECT name FROM categories ORDER BY name ASC");

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Latest Insights</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">Explore our latest news, updates, and expert strategies for Teen Patti and Rummy.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link 
              href="/blogs"
              className={`px-6 py-2 rounded-full font-bold transition ${!category || category === 'All' ? 'bg-secondary text-primary' : 'bg-accent text-gray-400 hover:text-white'}`}
            >
              All
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.name}
                href={`/blogs?category=${cat.name}`}
                className={`px-6 py-2 rounded-full font-bold transition ${category === cat.name ? 'bg-secondary text-primary' : 'bg-accent text-gray-400 hover:text-white'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: any) => (
              <div key={blog.id} className="bg-accent rounded-2xl overflow-hidden border border-white/5 hover:border-secondary/50 transition-all group flex flex-col">
                {blog.image_url && (
                  <div className="relative h-56 overflow-hidden">
                    <img src={blog.image_url} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                  <span className="text-xs font-black text-secondary uppercase tracking-widest mb-3">{blog.category || 'General'}</span>
                  <h3 className="text-2xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-secondary transition">{blog.title}</h3>
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <Link href={`/blog/${blog.slug}`} className="text-white font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
                      Read Article <i className="fa-solid fa-arrow-right text-secondary"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 font-medium">No articles found in this category.</div>
            )}
          </div>
        </div>
      </main>
      <Footer settings={settings} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    </>
  );
}
