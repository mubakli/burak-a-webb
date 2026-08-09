import nodemailer from "nodemailer";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !emailPattern.test(email) ||
      !message.trim() ||
      name.length > 100 ||
      email.length > 200 ||
      message.length > 5000
    ) {
      return Response.json({ error: "Invalid form submission" }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return Response.json({ error: "Contact service unavailable" }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: email.trim(),
      to: process.env.EMAIL_USER,
      subject: `Portfolio message from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
