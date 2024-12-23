import { useNavigate } from "react-router";
import { GetUserInfo } from "./auth";
import { useState, useEffect } from "react";
import apiClient from "../api/axiosInstance";
import UITemplate from "../components/sidebar";
import { User } from "../Pages/users";

function LogInOut() {
  const navigate = useNavigate();

  function handleLogout(): void {
    window.confirm("Are you sure you want to log out?");
    localStorage.removeItem("token");
    window.location.reload();
    alert("logged out successfully");
  }

  if (GetUserInfo()) {
    return <button onClick={handleLogout}>logout</button>;
  } else {
    return <button onClick={() => navigate("/users/login")}>login</button>;
  }
}

function Login(): React.ReactElement {
  const navigate = useNavigate();
  const [form, setForm] = useState<User>({
    ID: -1,
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const status = GetUserInfo();
    if (status !== null) {
      setForm({
        ...form,
        ID: Number(status.userID),
        username: String(status.username),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient
      .post("/login", form)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert("login failed");
      });
  };

  if (localStorage.getItem("token")) {
    return <div className="text-2xl">Welcome {form.username}!</div>;
  } else {
    return (
      <UITemplate>
        <div className="flex h-screen grow flex-col items-center justify-center">
          <h1 className="text-text mb-2 text-6xl font-bold">User Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              className="bg-light m-1 h-10 w-96 p-1 text-gray-700"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
            />
            <input
              className="bg-light m-1 h-10 w-96 p-1 text-gray-700"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              type="password"
            />
            <button
              className="bg-secondary w-fit place-self-center rounded-sm px-2 py-1"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </UITemplate>
    );
  }
}

export { LogInOut, Login };