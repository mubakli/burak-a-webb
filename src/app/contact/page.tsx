"use client";
import { useState } from "react";
import { Github, Linkedin, Mail, Send, ArrowRight } from "lucide-react";

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
      <div className="grid md:grid-cols-2 gap-20 md:gap-32 items-start">
        
        {/* Left: Contact Info - Editorial Style */}
        <div className="space-y-16">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold text-[var(--foreground)] tracking-tighter opacity-90 leading-[0.9]">
              LET&apos;S<br />CONNECT
            </h1>
            <p className="text-neutral-400 text-xl leading-relaxed font-light max-w-md border-l-2 border-[var(--primary)] pl-6">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
          </div>

          <div className="space-y-0 border-t border-[#333]">
            <a 
              href="mailto:brkasarcikli@outlook.com"
              className="flex items-center justify-between py-8 border-b border-[#333] group hover:bg-[#1a1a1a] transition-colors px-4 -mx-4"
            >
              <div className="flex items-center gap-6">
                <Mail className="w-5 h-5 text-[var(--primary)]" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-1">Mail</p>
                  <p className="text-[var(--foreground)] text-lg font-medium">brkasarcikli@outlook.com</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#333] group-hover:text-[var(--foreground)] transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 duration-300" />
            </a>

            <a 
              href="https://www.linkedin.com/in/burak-asarcikli"
              target="_blank"
              rel="noopener noreferrer"
               className="flex items-center justify-between py-8 border-b border-[#333] group hover:bg-[#1a1a1a] transition-colors px-4 -mx-4"
            >
              <div className="flex items-center gap-6">
                <Linkedin className="w-5 h-5 text-[var(--primary)]" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-1">Network</p>
                  <p className="text-[var(--foreground)] text-lg font-medium">LinkedIn</p>
                </div>
              </div>
               <ArrowRight className="w-5 h-5 text-[#333] group-hover:text-[var(--foreground)] transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 duration-300" />
            </a>

            <a 
              href="https://github.com/mubakli"
              target="_blank"
              rel="noopener noreferrer"
               className="flex items-center justify-between py-8 border-b border-[#333] group hover:bg-[#1a1a1a] transition-colors px-4 -mx-4"
            >
              <div className="flex items-center gap-6">
                <Github className="w-5 h-5 text-[var(--primary)]" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-1">Code</p>
                  <p className="text-[var(--foreground)] text-lg font-medium">GitHub</p>
                </div>
              </div>
               <ArrowRight className="w-5 h-5 text-[#333] group-hover:text-[var(--foreground)] transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 duration-300" />
            </a>
          </div>
        </div>

        {/* Right: Form - Architectural / Minimal */}
        <div className="pt-4 md:pt-12">
          <form onSubmit={handleSubmit} className="space-y-12">
             <div className="group">
               <label className="block text-xs font-bold uppercase tracking-widest text-[#666] mb-2 group-focus-within:text-[var(--primary)] transition-colors">Name</label>
               <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="ENTER YOUR NAME"
                className="w-full bg-transparent border-b border-[#333] py-4 text-[var(--foreground)] text-xl focus:outline-none focus:border-[var(--primary)] transition-colors placeholder-[#333]"
              />
             </div>

             <div className="group">
               <label className="block text-xs font-bold uppercase tracking-widest text-[#666] mb-2 group-focus-within:text-[var(--primary)] transition-colors">Email</label>
               <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ENTER YOUR EMAIL"
                className="w-full bg-transparent border-b border-[#333] py-4 text-[var(--foreground)] text-xl focus:outline-none focus:border-[var(--primary)] transition-colors placeholder-[#333]"
               />
             </div>

             <div className="group">
               <label className="block text-xs font-bold uppercase tracking-widest text-[#666] mb-2 group-focus-within:text-[var(--primary)] transition-colors">Message</label>
               <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="TELL ME ABOUT YOUR PROJECT"
                rows={4}
                className="w-full bg-transparent border-b border-[#333] py-4 text-[var(--foreground)] text-xl focus:outline-none focus:border-[var(--primary)] transition-colors resize-none placeholder-[#333]"
               />
             </div>

            <button
              type="submit"
              className="w-full bg-[var(--primary)] text-white font-bold py-5 rounded-none hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center gap-3 mt-8 tracking-widest uppercase text-sm"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>

            {status && (
              <p className={`text-center text-xs uppercase tracking-widest mt-6 ${status.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                {status}
              </p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
