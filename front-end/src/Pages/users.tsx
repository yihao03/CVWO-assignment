import { Link, Outlet, useNavigate, useParams } from "react-router";
import apiClient from "../api/axiosInstance";
import { useEffect, useState } from "react";
import UITemplate from "../components/sidebar";
import { GetUserInfo } from "../controllers/auth";
import { Posts } from "../components/posts";

interface User {
  ID: number;
  username: string;
  email: string;
  password: string;
}

function Users() {
  const [user, setUser] = useState<User[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/users")
      .then((res) => {
        console.log(res.data);
        setUser(res.data.users);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []); // Empty dependency array ensures it runs only once

  return (
    <>
      <UITemplate>
        <>
          <div className="overscroll-none flex flex-col h-screen items-center w-full sm:w-1/4 bg-secondary top-0">
            <Login />
            {user.map((user) => (
              <div
                className="bg-primary p-8 rounded-xl m-2 w-5/6 h-fit flex flex-col text-nowrap"
                onClick={() => {
                  navigate(`/users/${user.ID}`);
                  window.location.reload();
                }}
              >
                <h1 className="text-3xl text-text">
                  <span className="font-bold">User</span> {user.username}
                </h1>
              </div>
            ))}
            <Link
              to="/users/create"
              className="absolute italic text-blue-700 text-lg bottom-1"
            >
              create user
            </Link>
          </div>
          <div className="bg-primary flex flex-1 overflow-auto">
            <Outlet />
          </div>
        </>
      </UITemplate>
    </>
  );
}

const Login = () => {
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
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Username"
        />
        <input
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          type="password"
        />
        <button type="submit">Login</button>
      </form>
    );
  }
};

function UserProfile() {
  const [user, setUser] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    apiClient
      .get("/users/" + id)
      .then((response) => {
        // handle success
        console.log(response.data.users.username);
        setUser(response.data.users.username);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }, [id]);

  return (
    <div className="flex flex-col grow m-4 items-center">
      <h1 className="text-3xl font-bold text-text">I am {user}</h1>
      <img
        className="size-1/3 rounded-xl shadow object-cover"
        src="https://media.istockphoto.com/id/1687018104/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=PDi0AqXTtZ6d2Y7ahkMJEraVrC_fYCvx0HW508OWg-4="
        alt=""
      />
      <Posts type="post" user_id={id} />
    </div>
  );
}

export { Login, Users, UserProfile };
