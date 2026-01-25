"use client";
import { useState } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (result.success) {
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } else {
      setStatus("Failed to send message. Try again later.");
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 md:px-20 max-w-7xl mx-auto flex flex-col justify-center">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        
        {/* Left: Contact Info */}
        <div className="space-y-10 animate-slideUp">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Let&apos;s Connect</h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
          </div>

          <div className="space-y-6">
            <a 
              href="mailto:brkasarcikli@outlook.com"
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all group"
            >
              <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Mail me at</p>
                <p className="text-white font-medium">brkasarcikli@outlook.com</p>
              </div>
            </a>

            <a 
              href="https://www.linkedin.com/in/burak-asarcikli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all group"
            >
              <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Linkedin className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Connect on</p>
                <p className="text-white font-medium">LinkedIn</p>
              </div>
            </a>

            <a 
              href="https://github.com/mubakli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-gray-500/30 transition-all group"
            >
              <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-gray-500/20 transition-colors">
                <Github className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Follow on</p>
                <p className="text-white font-medium">GitHub</p>
              </div>
            </a>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white/5 p-8 md:p-10 rounded-3xl border border-white/10 backdrop-blur-sm animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            
            <div className="group">
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="group">
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="group">
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>

            {status && (
              <p className={`text-center text-sm mt-4 ${status.includes("successfully") ? "text-green-400" : "text-red-400"}`}>
                {status}
              </p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
