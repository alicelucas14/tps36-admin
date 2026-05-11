'use client';

import { saveBlog } from "@/lib/admin-actions";

export default function AdminBlogForm({ blog, categories }: { blog?: any, categories: any[] }) {
  return (
    <form action={saveBlog} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 space-y-8">
      {blog && <input type="hidden" name="id" value={blog.id} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
            <input 
              name="title" 
              defaultValue={blog?.title} 
              required 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-600 font-bold text-lg" 
              placeholder="Article Heading"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
            <select 
              name="category" 
              defaultValue={blog?.category} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-600 font-bold"
            >
              <option value="General">General</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image URL (Optional)</label>
            <input 
              name="image_url" 
              defaultValue={blog?.image_url} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-600 font-medium" 
              placeholder="https://..."
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Content (HTML)</label>
            <textarea 
              name="content" 
              defaultValue={blog?.content} 
              required 
              rows={12} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:border-blue-600 font-mono text-sm leading-relaxed"
              placeholder="Article content here..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t border-gray-100">
        <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-600/20">
          {blog ? 'UPDATE ARTICLE' : 'PUBLISH ARTICLE'}
        </button>
      </div>
    </form>
  );
}
