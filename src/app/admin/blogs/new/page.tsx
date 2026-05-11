import { getDb } from "@/lib/db";
import AdminBlogForm from "@/components/forms/AdminBlogForm";

export default async function NewBlogPage() {
  const db = await getDb();
  const categories = await db.all("SELECT * FROM categories ORDER BY name ASC");

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-gray-800">Create New Article</h1>
      <AdminBlogForm categories={categories} />
    </div>
  );
}
