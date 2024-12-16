import {Link, Outlet, useNavigate} from "react-router";
import apiClient from "../api/axiosInstance";
import {useEffect, useState} from "react";
import UITemplate from "../components/sidebar";


interface User {
  user_id: number;
  username: string;
  email: string;
  password: string;
}

type Status = "logged out" | "error" | "logged in";

function Users() {
  const [user, setUser] = useState<User[]>([])

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
      <div className="bg-primary h-screen flex flex-row flex-grow">
        <div className="flex flex-col h-screen items-center w-1/3 ml-0 bg-secondary">
          <Login/>
          {user.map((user) => (
            <div className="bg-primary p-8 rounded-xl m-2 w-5/6 h-fit flex flex-col text-nowrap" onClick={() => navigate(`/users/${user.username}`)}>
              <h1 className="text-3xl text-text"><span className="font-bold">User</span> {user.username}</h1>
            </div>))}
          <Link to="/users/create" className="absolute italic text-blue-700 text-lg bottom-1">create user</Link>
        </div>
        <Outlet/>
      </div>
      </UITemplate>
    </>
  )
}

const Login = () => {
  const [form, setForm] = useState<User>({
    user_id: -1,
    username: "",
    email: "",
    password: ""
  });

  const username = localStorage.getItem("username");
  const [status, setStatus] = useState<Status>(username === "" ? "logged out" : "logged in");

  const handleSubmit = () => {
    apiClient.post("/login", form)
      .then(res => {
        setStatus("logged in");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("username", res.data.username);
      })
      .catch(err => {
        console.error(err)
        setStatus("error");
      });
  };


  if (status === "logged in") {
    return <div className="text-2xl">Welcome {localStorage.getItem("username")}!</div>
  } else if (status === "error") {
    return <div>There was an error logging in.</div>
  } else if (status === "logged out") {
    return (
      <div className="flex flex-col">
        <input onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
        <input onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" />
        <button onClick={handleSubmit}>Login</button>
      </div>
    );

  }


};
export { Login, Users };