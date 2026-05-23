import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      name,
      email,
      phone,
      message,
      website, // honeypot anti-spam field
    } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Honeypot spam protection
    if (website) {
      return res.status(400).end();
    }

    // Send email through Resend
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",

      // YOUR EMAIL HERE
      to: ["popa.calina16@gmail.com"],

      subject: `New message from ${name}`,

      replyTo: email,

      html: `
        <h2>New Contact Form Submission</h2>

        <p>
          <strong>Name:</strong> ${name}
        </p>

        <p>
          <strong>Email:</strong> ${email}
        </p>

        <p>
          <strong>Phone:</strong> ${phone}
        </p>

        <p>
          <strong>Message:</strong>
        </p>

        <p>${message}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to send email",
    });
  }
}
