'use server';

import { getDb } from "./db";

export async function submitContact(formData: FormData) {
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!firstName || !email || !message) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  try {
    const db = await getDb();
    await db.run(
      "INSERT INTO contacts (first_name, last_name, email, message) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, message]
    );
    
    // Log activity
    await db.run(
      "INSERT INTO activity_log (action, details) VALUES (?, ?)",
      ['Contact Form Submission', `Message from ${firstName} ${lastName} (${email})`]
    );

    return { success: true };
  } catch (error) {
    console.error('Contact submission error:', error);
    return { success: false, error: 'Failed to send message. Please try again later.' };
  }
}
