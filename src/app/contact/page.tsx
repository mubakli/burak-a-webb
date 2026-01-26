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
    <div className="min-h-screen py-32 px-6 md:px-8 max-w-7xl mx-auto flex flex-col justify-center">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
        
        {/* Left: Contact Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Let&apos;s Connect</h1>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
          </div>

          <div className="space-y-4">
            <a 
              href="mailto:brkasarcikli@outlook.com"
              className="flex items-center gap-6 p-6 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all group"
            >
              <Mail className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Mail me at</p>
                <p className="text-white font-medium">brkasarcikli@outlook.com</p>
              </div>
            </a>

            <a 
              href="https://www.linkedin.com/in/burak-asarcikli"
              target="_blank"
              rel="noopener noreferrer"
               className="flex items-center gap-6 p-6 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all group"
            >
              <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Connect on</p>
                <p className="text-white font-medium">LinkedIn</p>
              </div>
            </a>

            <a 
              href="https://github.com/mubakli"
              target="_blank"
              rel="noopener noreferrer"
               className="flex items-center gap-6 p-6 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all group"
            >
              <Github className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Follow on</p>
                <p className="text-white font-medium">GitHub</p>
              </div>
            </a>
          </div>
        </div>

        {/* Right: Form */}
        <div className="pt-2">
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-500 ml-1">Name</label>
               <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder=""
                className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
              />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-500 ml-1">Email</label>
               <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=""
                className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
               />
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-500 ml-1">Message</label>
               <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder=""
                rows={6}
                className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors resize-none"
               />
             </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>

            {status && (
              <p className={`text-center text-sm mt-4 ${(status.includes("successfully") || status.includes("Sending")) ? "text-gray-400" : "text-red-400"}`}>
                {status}
              </p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
