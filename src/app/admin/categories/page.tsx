import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function saveCategory(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const db = await getDb();
  await db.run("INSERT OR IGNORE INTO categories (name) VALUES (?)", [name]);
  revalidatePath('/admin/categories');
}

async function deleteCategory(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const db = await getDb();
  await db.run("DELETE FROM categories WHERE id = ?", [id]);
  revalidatePath('/admin/categories');
}

export default async function AdminCategoriesPage() {
  const db = await getDb();
  const categories = await db.all("SELECT * FROM categories ORDER BY name ASC");

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-gray-800">Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form action={saveCategory} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-black text-gray-800">Add New</h3>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category Name</label>
              <input name="name" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-600 font-bold" placeholder="e.g. Slots" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition">
              ADD CATEGORY
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-8 py-5 font-black text-gray-800">{cat.name}</td>
                    <td className="px-8 py-5 text-right">
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={cat.id} />
                        <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </form>
                    </td>
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
