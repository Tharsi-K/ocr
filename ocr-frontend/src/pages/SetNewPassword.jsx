import { useState } from "react";
import { useParams } from "react-router-dom";

export default function SetNewPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const { token } = useParams();

  const handleSetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      setMessage(data.message || "Password has been reset successfully.");
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Set New Password</h1>
      <form onSubmit={handleSetPassword} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Enter new password"
          className="border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
          Reset Password
        </button>
      </form>
      {message && <p className="mt-5 text-center">{message}</p>}
    </div>
  );
}

