import { getDb, getSettings } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function ReviewsPage() {
  const db = await getDb();
  const settings = await getSettings();
  const reviews = await db.all("SELECT * FROM reviews ORDER BY created_at DESC");

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Player Reviews</h1>
            <p className="text-gray-400">Join thousands of happy players across India.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r: any) => (
              <div key={r.id} className="bg-accent p-8 rounded-3xl border border-white/5 relative flex flex-col hover:border-secondary/30 transition shadow-xl">
                <div className="text-secondary mb-6 flex gap-1">
                  {[...Array(r.rating)].map((_, i) => <i key={i} className="fa-solid fa-star text-sm"></i>)}
                </div>
                <p className="text-gray-300 italic mb-10 text-lg leading-relaxed group-hover:text-white transition">"{r.comment}"</p>
                <div className="mt-auto flex items-center gap-4 border-t border-white/5 pt-6">
                  {r.image_url ? (
                    <img src={r.image_url} className="w-12 h-12 rounded-full border-2 border-secondary object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                      {r.reviewer_name.charAt(0)}
                    </div>
                  )}
                  <span className="font-bold text-white uppercase tracking-wider text-sm">{r.reviewer_name}</span>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">No reviews yet. Be the first to play!</div>
            )}
          </div>
        </div>
      </main>
      <Footer settings={settings} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    </>
  );
}
