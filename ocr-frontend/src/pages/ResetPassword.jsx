import { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/send-reset-password-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "Check your email for reset instructions.");
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Reset Password
      </h1>
      <form onSubmit={handleResetRequest} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
          Send Reset Link
        </button>
      </form>
      {message && <p className="mt-5 text-center">{message}</p>}
    </div>
  );
}
