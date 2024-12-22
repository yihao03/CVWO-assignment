import { useEffect, useState } from "react";
import { GetUserInfo } from "./auth";
import apiClient from "../api/axiosInstance";
import UITemplate from "../components/sidebar";
import { useNavigate } from "react-router-dom";

interface ModUser {
  user_id: number;
  password: string;
  new_password: string;
}

export default function UpdatePassword(): React.ReactElement {
  const user = GetUserInfo();
  const navigate = useNavigate();
  const [form, setForm] = useState<ModUser>({
    user_id: -1,
    password: "",
    new_password: "",
  });

  function initialise() {
    if (user && user.userID) {
      setForm({
        user_id: Number(user.userID),
        password: "",
        new_password: "",
      });
    }
  }

  //eslint-disable-next-line
  useEffect(initialise, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(form);

    apiClient
      .put("/users/reset_password", form)
      .then((res) => {
        console.log("Reset password status", res.data);
        alert("Password updated successfully");
        localStorage.removeItem("token");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Failed to update password:", err);
        alert("Failed to update password");
      });
  }

  return (
    <UITemplate>
      <form
        onSubmit={handleSubmit}
        className="flex grow flex-col items-center justify-center"
      >
        <input
          type="password"
          className="m-2 w-96 rounded-sm p-1"
          value={form.password}
          placeholder="Current Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="password"
          className="m-2 w-96 rounded-sm p-1 hover:inset-y-10"
          value={form.new_password}
          placeholder="New Password"
          onChange={(e) => setForm({ ...form, new_password: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    </UITemplate>
  );
}
