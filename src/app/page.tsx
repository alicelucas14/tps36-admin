import { getDb, getSettings } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default async function Home() {
  const db = await getDb();
  const settings = await getSettings();
  
  const featuredBlogs = await db.all("SELECT * FROM blogs ORDER BY created_at DESC LIMIT 3");
  const recentReviews = await db.all("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 3");
  const faqPreview = await db.all("SELECT * FROM faqs ORDER BY created_at ASC LIMIT 4");

  return (
    <>
      <Navbar settings={settings} />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative px-4 py-12 lg:pt-20 lg:pb-24 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fb923c] via-[#f97316] to-[#ea580c]"></div>
          
          <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left z-10 pt-2">
              <h1 className="text-[2.75rem] md:text-6xl lg:text-[4.5rem] font-black tracking-wide text-white leading-[1.25] drop-shadow-sm">
                {settings.site_name} — Teen Patti & Rummy real cash app
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-white/90 max-w-xl mx-auto lg:mx-0 font-normal">
                Play skill-based Teen Patti and Rummy on {settings.site_name} with secure payments, quick <strong className="font-bold text-white">withdrawals</strong>, and friendly 24/7 support. Download the {settings.site_name} APK and start in minutes.
              </p>
              <div className="flex justify-center lg:justify-start pt-2">
                <div className="inline-flex flex-col w-[300px] overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition duration-300 transform hover:-translate-y-1">
                  <Link href="#" className="bg-gradient-to-b from-[#ffd24d] to-[#fa9d0f] text-black font-black text-lg py-4 flex items-center justify-center gap-2">
                    <i className="fa-solid fa-download text-xl"></i>
                    DOWNLOAD APP
                  </Link>
                  <div className="bg-white text-black text-xs font-bold py-3 text-center leading-tight">
                    Get Cash Bonus on 1st Add<br />Cash*
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10 flex justify-center lg:self-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl filter"></div>
              <img 
                src="/images/hero.png" 
                alt="Winning is a Habit" 
                className="w-full max-w-xl lg:max-w-[110%] relative z-10 drop-shadow-2xl animate-float -mb-2 md:-mb-4 lg:-mb-6"
              />
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-16 md:-mt-24 mb-20 md:mb-32">
          <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 rounded-3xl shadow-[0_15px_50px_rgba(249,115,22,0.4)] p-8 md:p-10 border border-white/20 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/30 text-center text-white">
              <div className="px-4"><h3 className="text-4xl md:text-5xl font-black mb-2">150K+</h3><p className="font-bold uppercase text-sm opacity-90">Winners</p></div>
              <div className="px-4"><h3 className="text-4xl md:text-5xl font-black mb-2">75M+</h3><p className="font-bold uppercase text-sm opacity-90">Players</p></div>
              <div className="px-4"><h3 className="text-4xl md:text-5xl font-black mb-2">₹5 Cr+</h3><p className="font-bold uppercase text-sm opacity-90">Winnings</p></div>
              <div className="px-4"><h3 className="text-4xl md:text-5xl font-black mb-2">24/7</h3><p className="font-bold uppercase text-sm opacity-90">Support</p></div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose {settings.site_name}?</h2>
            <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'shield-halved', title: '100% Safe & Secure', desc: 'Our platform uses advanced encryption to protect your data and transactions.' },
              { icon: 'bolt', title: 'Instant Withdrawals', desc: 'Get your winnings in your bank account or wallet instantly without any delay.' },
              { icon: 'headset', title: '24/7 Support', desc: 'Our dedicated support team is always available to help you with any queries.' }
            ].map((feature, i) => (
              <div key={i} className="bg-accent p-8 rounded-2xl border border-white/5 hover:border-secondary/50 transition duration-300 group">
                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary text-2xl mb-6 group-hover:scale-110 transition">
                  <i className={`fa-solid fa-${feature.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Us */}
        <section id="about-us" className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 tracking-wide text-white">About Us</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-secondary to-[#f97316] mx-auto rounded-full"></div>
          </div>
          <div className="bg-accent/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-14 shadow-2xl">
            <div 
              className="space-y-6 text-[1.05rem] md:text-lg leading-relaxed text-gray-300 font-light prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: settings.about_us_content || '' }}
            />
          </div>
        </section>

        {/* Featured Blogs */}
        {featuredBlogs.length > 0 && (
          <section className="bg-accent/30 py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Latest Updates</h2>
                  <p className="text-gray-400">Stay updated with the latest tips and news.</p>
                </div>
                <Link href="/blogs" className="text-secondary font-bold hover:underline">View All <i className="fa-solid fa-arrow-right ml-2"></i></Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredBlogs.map((blog: any) => (
                  <div key={blog.id} className="bg-accent rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-secondary transition">
                    {blog.image_url && <img src={blog.image_url} alt="Cover" className="w-full h-48 object-cover" />}
                    <div className="p-6">
                      <span className="text-xs font-bold text-secondary tracking-widest uppercase mb-2 block">{blog.category || 'General'}</span>
                      <h3 className="text-lg font-bold mb-3 h-14 overflow-hidden">{blog.title}</h3>
                      <Link href={`/blog/${blog.slug}`} className="text-secondary font-bold hover:underline text-sm">Read More</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        {recentReviews.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What Our Players Say</h2>
              <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentReviews.map((r: any) => (
                <div key={r.id} className="bg-accent p-6 rounded-2xl border border-white/5 relative">
                  <div className="text-secondary mb-4">
                    {[...Array(r.rating)].map((_, i) => <i key={i} className="fa-solid fa-star text-sm"></i>)}
                  </div>
                  <p className="text-gray-300 italic mb-6">"{r.comment}"</p>
                  <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                    {r.image_url && <img src={r.image_url} className="w-10 h-10 rounded-full border border-secondary" />}
                    <span className="font-bold text-white text-sm">{r.reviewer_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer settings={settings} />
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    </>
  );
}
