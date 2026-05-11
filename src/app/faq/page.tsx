import { getDb, getSettings } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default async function FAQPage() {
  const db = await getDb();
  const settings = await getSettings();
  const faqs = await db.all("SELECT * FROM faqs ORDER BY created_at ASC");

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 text-center mb-16">
          <h1 className="text-5xl font-black mb-4 tracking-tight">Help Center</h1>
          <p className="text-gray-400">Everything you need to know about playing on {settings.site_name}.</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {faqs.map((f: any) => (
            <details key={f.id} className="group bg-accent rounded-2xl border border-white/5 hover:border-secondary/20 transition-all">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 md:p-8 hover:text-secondary transition text-lg">
                <span>{f.question}</span>
                <span className="transition duration-300 group-open:rotate-180 bg-white/5 p-2 rounded-lg">
                  <i className="fa-solid fa-chevron-down text-sm"></i>
                </span>
              </summary>
              <div className="text-gray-400 p-8 pt-0 border-t border-white/5 mt-2 leading-relaxed text-lg">
                {f.answer}
              </div>
            </details>
          ))}
          {faqs.length === 0 && (
            <div className="text-center py-20 text-gray-500">No FAQs available yet.</div>
          )}
        </div>

        <div className="max-w-xl mx-auto px-4 mt-20">
          <div className="bg-gradient-to-br from-secondary/20 to-orange-500/10 p-10 rounded-3xl border border-secondary/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-gray-300 mb-8 font-medium">Our support team is available 24/7 to help you with any issues.</p>
            <Link href="/contact" className="bg-secondary text-primary px-10 py-4 rounded-full font-black hover:bg-yellow-400 transition-all transform hover:-translate-y-1 inline-block">
              Message Support
            </Link>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    </>
  );
}
