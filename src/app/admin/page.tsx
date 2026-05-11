import { getDb } from "@/lib/db";
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const db = await getDb();
  
  // Fetch stats in parallel
  const [
    blogsCount,
    reviewsCount,
    faqsCount,
    categoriesCount,
    visitorsCount,
    clicksCount,
    messagesCount,
    activities,
    recentBlogs,
    recentReviews,
    recentVisitors
  ] = await Promise.all([
    db.get("SELECT COUNT(*) as c FROM blogs"),
    db.get("SELECT COUNT(*) as c FROM reviews"),
    db.get("SELECT COUNT(*) as c FROM faqs"),
    db.get("SELECT COUNT(*) as c FROM categories"),
    db.get("SELECT COUNT(*) as c FROM visitors"),
    db.get("SELECT COUNT(*) as c FROM button_clicks"),
    db.get("SELECT COUNT(*) as c FROM contacts"),
    db.all("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 10"),
    db.all("SELECT * FROM blogs ORDER BY created_at DESC LIMIT 5"),
    db.all("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 5"),
    db.all("SELECT * FROM visitors ORDER BY last_visited DESC LIMIT 5")
  ]);

  const stats = [
    { label: 'Blogs', value: blogsCount.c, icon: 'pen-nib', color: 'blue' },
    { label: 'Reviews', value: reviewsCount.c, icon: 'star', color: 'yellow' },
    { label: 'FAQs', value: faqsCount.c, icon: 'circle-question', color: 'green' },
    { label: 'Categories', value: categoriesCount.c, icon: 'layer-group', color: 'purple' },
    { label: 'Messages', value: messagesCount.c, icon: 'envelope', color: 'red' },
    { label: 'Unique Visitors', value: visitorsCount.c, icon: 'users', color: 'orange' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-gray-800">Dashboard Summary</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] shadow-sm p-6 border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-500 text-white flex items-center justify-center text-xl mb-4 shadow-lg shadow-${stat.color}-500/20 group-hover:scale-110 transition`}>
              <i className={`fa-solid fa-${stat.icon}`}></i>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden h-full">
          <div className="p-8 border-b border-gray-100">
            <h3 className="text-xl font-black text-gray-800">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((act: any) => (
                  <tr key={act.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        act.action.includes('Login') ? 'bg-blue-100 text-blue-700' : 
                        act.action.includes('Delete') ? 'bg-red-100 text-red-700' : 
                        act.action.includes('Add') ? 'bg-green-100 text-green-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {act.action}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-600">{act.details}</td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-400 text-right">{new Date(act.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden h-full border-t-8 border-t-orange-500">
          <div className="p-8 border-b border-gray-100">
            <h3 className="text-xl font-black text-gray-800">Live Traffic</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Location</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Hits</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentVisitors.map((v: any) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-5">
                      <div className="font-black text-gray-800">{v.city !== 'Unknown' ? `${v.city}, ${v.country}` : v.country}</div>
                      <div className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-tighter">{v.ip_address}</div>
                    </td>
                    <td className="px-8 py-5 text-center"><span className="font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg text-sm">{v.visits}</span></td>
                    <td className="px-8 py-5 text-right text-xs font-bold text-gray-400">{new Date(v.last_visited).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
