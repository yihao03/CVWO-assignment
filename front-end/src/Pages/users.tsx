import { Link, Outlet, useNavigate, useParams } from "react-router";
import apiClient from "../api/axiosInstance";
import { Fragment, useEffect, useState } from "react";
import UITemplate from "../components/sidebar";
import { Posts } from "../components/posts";
import { GetUserInfo } from "../controllers/auth";

interface User {
  ID: number;
  username: string;
  email: string;
  password: string;
  CreatedAt?: string;
  Bio?: string;
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

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();

  const loggedInUser = GetUserInfo();

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
    <div className="m-4 grid grow">
      <div className="mb-12">
        <div className="flex flex-row items-end">
          <h1 className="text-text text-4xl font-bold">{user?.username}</h1>
          {loggedInUser !== null && loggedInUser.userID == id && (
            <Link
              to={`/users/edit/${id}`}
              className="ml-2 text-sm text-blue-700"
            >
              Edit Profile
            </Link>
          )}
        </div>
        <h2 className="text-text text-2xl font-bold">{user?.email}</h2>
        <p>
          Member since{" "}
          {new Date(user?.CreatedAt as string).toLocaleString("en-UK", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p>Bio: {user?.Bio}</p>
      </div>
      <h1 className="text-text text-2xl font-bold">Posts</h1>
      <div className="containter h-screen overflow-auto">
        <Posts type="post" user_id={id} parent_id="0" />
      </div>
    </div>
  );
}

export { Users, UserProfile };
export type { User };
