import { Link, useNavigate } from "react-router";
import { GetUserInfo } from "./auth";
import { useState, useRef } from "react";
import apiClient from "../api/axiosInstance";
import UITemplate from "../components/sidebar";
import { User } from "../Pages/users";
import { MdLogin, MdOutlineLogout } from "react-icons/md";

function LogInOut() {
  const navigate = useNavigate();
  const user = useRef(GetUserInfo());

  function handleLogout(): void {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      window.location.reload();
      alert("logged out successfully");
    } else {
      alert("ok lol");
    }
  }

  if (user.current) {
    return (
      <button onClick={handleLogout}>
        <MdOutlineLogout className="sidebar-button" />
      </button>
    );
  } else {
    return (
      <button onClick={() => navigate("/users/login")}>
        <MdLogin className="sidebar-button" />
      </button>
    );
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient
      .post("/login", form)
      .then((res) => {
        localStorage.removeItem("token");
        localStorage.setItem("token", res.data.token);
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert("login failed: " + err.response.data.error);
      });
  };

  if (localStorage.getItem("token")) {
    return (
      <UITemplate>
        <div className="text-2xl">Welcome {form.username}!</div>
      </UITemplate>
    );
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
          <Link
            to="/users/create"
            className="m-2 cursor-pointer italic text-blue-500 hover:text-blue-700 hover:underline"
          >
            Create User
          </Link>
        </div>
      </UITemplate>
    );
  }
}

export { LogInOut, Login };
