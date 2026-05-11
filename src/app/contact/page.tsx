import { getSettings } from "@/lib/db";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/forms/ContactForm";

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h1 className="text-6xl font-black mb-6 tracking-tight">Get in Touch</h1>
            <p className="text-xl text-gray-400 mb-12 font-medium leading-relaxed">
              Have questions about your account or need help with withdrawals? Our support team is ready to assist you.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary text-2xl group-hover:bg-secondary group-hover:text-primary transition-all">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h4 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Email Us</h4>
                  <p className="text-2xl font-bold">{settings.contact_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary text-2xl group-hover:bg-secondary group-hover:text-primary transition-all">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Call Support</h4>
                  <p className="text-2xl font-bold">{settings.contact_phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary text-2xl group-hover:bg-secondary group-hover:text-primary transition-all">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Office</h4>
                  <p className="text-2xl font-bold">{settings.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-sm">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer settings={settings} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    </>
  );
}
