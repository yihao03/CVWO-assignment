import { Link, Outlet, useNavigate, useParams } from "react-router";
import apiClient from "../api/axiosInstance";
import { Fragment, useEffect, useState } from "react";
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
          <div className="bg-secondary top-0 flex h-screen w-full flex-col items-center overscroll-none sm:w-1/4">
            {user.map((user) => (
              <Fragment key={user.ID}>
                <div
                  className="bg-primary m-2 flex h-fit w-5/6 flex-col text-nowrap rounded-xl p-8"
                  onClick={() => {
                    navigate(`/users/${user.ID}`);
                  }}
                >
                  <h1 className="text-text text-3xl">
                    <span className="font-bold">User</span> {user.username}
                  </h1>
                </div>
              </Fragment>
            ))}
            <Link
              to="/users/create"
              className="absolute bottom-1 text-lg italic text-blue-700"
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
};

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();

  function fetchUserInfo() {
    apiClient
      .get(`/users?user_id=${id}`)
      .then((res) => {
        console.log("fetched user information: ", res);
        setUser(res.data.users);
      })
      .catch((err) => {
        console.log("error fetching user info", err);
      });
  }

  useEffect(fetchUserInfo, [id]);

  return (
    <div className="m-4 flex grow flex-col">
      <h1 className="text-text ml-3 mt-8 text-4xl font-bold">
        {user?.username}
      </h1>
      <Posts type="post" user_id={id} />
    </div>
  );
}

export { Login, Users, UserProfile };
