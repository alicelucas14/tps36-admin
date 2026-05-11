import { getDb } from "@/lib/db";
import Link from 'next/link';
import { deleteBlog } from "@/lib/admin-actions";

export default async function AdminBlogsPage() {
  const db = await getDb();
  const blogs = await db.all("SELECT * FROM blogs ORDER BY created_at DESC");

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-800">Manage Blogs</h1>
        <Link 
          href="/admin/blogs/new" 
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> New Article
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Article</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog: any) => (
                <tr key={blog.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {blog.image_url && <img src={blog.image_url} alt="Icon" className="w-10 h-10 rounded-lg object-cover" />}
                      <span className="font-black text-gray-800">{blog.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-black uppercase">{blog.category}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td className="px-8 py-5 text-right space-x-2">
                    <Link href={`/admin/blogs/edit/${blog.id}`} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition inline-block">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    <form action={deleteBlog} className="inline-block">
                      <input type="hidden" name="id" value={blog.id} />
                      <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">No articles yet. Click "New Article" to start.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
