"use client";

import { useState } from "react";

export default function SubscribeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleSubscribe() {
    setLoading(true);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setEmail("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white/70 flex items-center justify-center">
      <div className="bg-white border border-gray-700 p-6 w-full max-w-md text-black">
        <h2 className="text-xl font-semibold mb-3">Subscribe to HASHCS</h2>

        {success ? (
          <p className="text-green-400">
            Subscription successful 🎉
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white border px-4 py-2 mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-black text-white py-2 font-semibold hover:bg-red-600 transition"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-700 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
