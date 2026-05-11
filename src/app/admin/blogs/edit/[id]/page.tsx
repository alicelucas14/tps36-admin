import { getDb } from "@/lib/db";
import AdminBlogForm from "@/components/forms/AdminBlogForm";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  
  const [blog, categories] = await Promise.all([
    db.get("SELECT * FROM blogs WHERE id = ?", [id]),
    db.all("SELECT * FROM categories ORDER BY name ASC")
  ]);

  if (!blog) return notFound();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-gray-800">Edit Article</h1>
      <AdminBlogForm blog={blog} categories={categories} />
    </div>
  );
}
