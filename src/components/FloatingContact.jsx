import React from "react";

export default function FloatingContact({ phone }) {
  const wa = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hello Rawa.co I have a question"
  )}`;
  const messenger = "https://m.me/yourpage";
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        className="bg-green-500 text-white px-4 py-3 rounded shadow"
      >
        WhatsApp
      </a>
      <a
        href={messenger}
        target="_blank"
        rel="noreferrer"
        className="bg-blue-600 text-white px-4 py-3 rounded shadow"
      >
        Messenger
      </a>
    </div>
  );
}
