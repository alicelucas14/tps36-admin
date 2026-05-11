import { getDb, getSettings } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function PromotionsPage() {
  const db = await getDb();
  const settings = await getSettings();
  const promotions = await db.all("SELECT * FROM promotions WHERE status = 'Active' ORDER BY created_at DESC");

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Hot Promotions</h1>
            <p className="text-gray-400">Exclusive bonuses and rewards for our loyal players.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {promotions.map((promo: any) => (
              <div key={promo.id} className="bg-accent rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl flex flex-col items-center p-2">
                {promo.image_url && (
                  <div className="w-full h-auto rounded-[1.8rem] overflow-hidden">
                    <img src={promo.image_url} alt={promo.title} className="w-full h-auto object-cover" />
                  </div>
                )}
                <div className="p-10 text-center">
                  <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-tight">{promo.title}</h3>
                  <div className="text-gray-400 mb-8 font-medium leading-relaxed max-w-sm mx-auto">{promo.description}</div>
                  <a href={promo.link || '#'} className="bg-gradient-to-r from-secondary to-yellow-600 text-primary px-10 py-4 rounded-full font-black hover:scale-105 transition transform shadow-lg inline-block">
                    CLAIM BONUS
                  </a>
                </div>
              </div>
            ))}
            {promotions.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">Check back soon for new promotions!</div>
            )}
          </div>
        </div>
      </main>
      <Footer settings={settings} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    </>
  );
}
