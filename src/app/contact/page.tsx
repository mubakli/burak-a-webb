"use client";
import { useState } from "react";

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
    <div className="flex mt-40  animate-slideUp items-center">
      <div className="flex flex-col ml-20 pl-20 w-1/2 space-y-10 items-center h-[550px] w-[450px]">
        <input
          name="name"
          maxLength={50}
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Your Name"
          className="w-[450px] h-[50px] pl-10 text-white bg-gray-800 text-base font-semibold font-['Montserrat'] bg-[#ddd9d2] rounded-[25px] border border-white"
        />
        <input
          name="email"
          maxLength={60}
          type="text"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Your Email Adress"
          className="w-[450px] h-[50px] pl-10 text-white bg-gray-800 text-base font-semibold font-['Montserrat'] bg-[#ddd9d2] rounded-[25px] border border-white"
        />
        <textarea
          name="message"
          maxLength={430}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Enter Your Message"
          className="w-[450px] h-[300px] px-10 py-3 text-white bg-gray-800 text-base font-semibold font-['Montserrat'] bg-[#ddd9d2] rounded-[25px] border border-white"
        />
        <button
          onClick={handleSubmit}
          className="w-44 h-12 bg-blue-600 rounded-full text-white flex items-center justify-center hover:cursor-pointer"
        >
          Gönder
        </button>
        {status && <p className="text-sm mt-2 text-gray-700">{status}</p>}
      </div>
      <div className="flex flex-col mx-20 px-20 items-center">
        <div className=" flex space-x-4 mx-10 my-10 font bold  ">
          <p>Email:</p>
          <p className="pl-5 underline decoration-rose-700">
            brkasarcikli@outlook.com
          </p>
        </div>
        <div className="flex mx-10 my-10 font bold  ">
          <p>Linkedln:</p>
          <a
            href="www.linkedin.com/in/burak-asarcikli"
            className="pl-5 underline decoration-teal-800"
          >
            www.linkedin.com/in/burak-asarcikli
          </a>
        </div>
        <div className="flex mx-10 my-10 font bold ">
          <p>Github:</p>
          <a
            href="https://github.com/mubakli"
            className="pl-5 underline decoration-orange-800"
          >
            https://github.com/mubakli
          </a>
        </div>
      </div>
    </div>
  );
}
