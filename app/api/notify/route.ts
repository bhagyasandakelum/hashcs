import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  const title = body.data.title;
  const slug = body.data.slug;

  // Fetch subscriber emails from DB
  const subscribers = ["user@example.com"]; // replace with DB

  await resend.emails.send({
    from: "HASHCS <noreply@hashcs.com>",
    to: subscribers,
    subject: `New Blog Published: ${title}`,
    html: `
      <h2>${title}</h2>
      <p>A new article is live on HASHCS.</p>
      <a href="https://hashcs.com/blog/${slug}">
        Read Now →
      </a>
    `,
  });

  return NextResponse.json({ success: true });
}
