import { getSettings } from "@/lib/db";
import { updateSettings } from "@/lib/admin-actions";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-gray-800">Site Settings</h1>

      <form action={updateSettings} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <i className="fa-solid fa-globe text-blue-600"></i> General Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Site Name</label>
                <input name="site_name" defaultValue={settings.site_name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-600 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Support Email</label>
                <input name="contact_email" defaultValue={settings.contact_email} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-600 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Support Phone</label>
                <input name="contact_phone" defaultValue={settings.contact_phone} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-600 font-medium" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <i className="fa-solid fa-share-nodes text-orange-500"></i> Social Media
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {['social_facebook', 'social_telegram', 'social_whatsapp', 'social_instagram'].map(k => (
                <div key={k}>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{k.replace('social_', '').toUpperCase()}</label>
                  <input name={k} defaultValue={settings[k]} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-600 font-medium" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100">
          <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <i className="fa-solid fa-file-lines text-purple-600"></i> About Us Content
          </h3>
          <textarea 
            name="about_us_content" 
            defaultValue={settings.about_us_content} 
            rows={10} 
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-600 font-mono text-sm leading-relaxed"
          ></textarea>
          <p className="text-xs text-gray-400 mt-2 italic">HTML tags are allowed for formatting.</p>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 active:scale-95">
            UPDATE ALL SETTINGS
          </button>
        </div>
      </form>
    </div>
  );
}
