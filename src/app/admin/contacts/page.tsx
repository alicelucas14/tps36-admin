import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function deleteMessage(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const db = await getDb();
  await db.run("DELETE FROM contacts WHERE id = ?", [id]);
  revalidatePath('/admin/contacts');
}

export default async function AdminContactsPage() {
  const db = await getDb();
  const messages = await db.all("SELECT * FROM contacts ORDER BY created_at DESC");

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-gray-800">Contact Messages</h1>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Sender</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Message</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.map((msg: any) => (
                <tr key={msg.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-8 py-5">
                    <div className="font-black text-gray-800">{msg.first_name} {msg.last_name}</div>
                    <div className="text-xs font-bold text-blue-600 mt-1">{msg.email}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm text-gray-600 line-clamp-2 max-w-md">{msg.message}</div>
                  </td>
                  <td className="px-8 py-5 text-right text-xs font-bold text-gray-400">{new Date(msg.created_at).toLocaleString()}</td>
                  <td className="px-8 py-5 text-right">
                    <form action={deleteMessage}>
                      <input type="hidden" name="id" value={msg.id} />
                      <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">No messages received yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
