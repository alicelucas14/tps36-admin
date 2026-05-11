'use server';

import { getDb } from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// BLOGS
export async function saveBlog(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;
  const image_url = formData.get('image_url') as string; // Simplified for now, handle uploads later
  
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
  const db = await getDb();

  if (id) {
    await db.run(
      "UPDATE blogs SET title = ?, slug = ?, content = ?, image_url = ?, category = ? WHERE id = ?",
      [title, slug, content, image_url, category, id]
    );
  } else {
    await db.run(
      "INSERT INTO blogs (title, slug, content, image_url, category) VALUES (?, ?, ?, ?, ?)",
      [title, slug, content, image_url, category]
    );
  }

  revalidatePath('/admin/blogs');
  revalidatePath('/blogs');
  redirect('/admin/blogs');
}

export async function deleteBlog(formData: FormData) {
  const id = formData.get('id') as string;
  const db = await getDb();
  await db.run("DELETE FROM blogs WHERE id = ?", [id]);
  revalidatePath('/admin/blogs');
}

// SETTINGS
export async function updateSettings(formData: FormData) {
  const db = await getDb();
  const keys = Array.from(formData.keys()).filter(k => k !== 'submit');
  
  const stmt = await db.prepare("UPDATE settings SET value = ? WHERE key = ?");
  for (const key of keys) {
    const value = formData.get(key) as string;
    await stmt.run([value, key]);
  }
  await stmt.finalize();

  revalidatePath('/');
  return { success: true };
}
