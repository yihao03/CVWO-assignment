import { Link, Outlet, useNavigate, useParams } from "react-router";
import apiClient from "../api/axiosInstance";
import React, { Fragment, useEffect, useRef, useState } from "react";
import UITemplate from "../components/sidebar";
import { Posts } from "../components/posts";
import { GetUserInfo } from "../controllers/auth";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { MdFormatBold, MdFormatItalic, MdCode } from "react-icons/md";
import { InitEditor } from "../components/textEditor";
import { EditorContent } from "@tiptap/react";

interface User {
  ID: number;
  username: string;
  email: string;
  password: string;
  CreatedAt?: string;
  bio?: string;
}

function Users() {
  const [user, setUser] = useState<User[]>([]);
  const mobile = window.innerWidth < 768;
  const params = useParams();

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value;
    apiClient
      .get(`/users?search=${search}`)
      .then((res) => {
        console.log(res.data);
        setUser(res.data.users);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }

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

  if (mobile) {
    //small screen UI, only show user list OR user, not both
    const user_id = params.id;

    if (user_id !== undefined) {
      //return user profile
      return (
        <UITemplate>
          {" "}
          <Outlet />
        </UITemplate>
      );
    } else {
      //return user list
      return (
        <UITemplate>
          <div className="flex grow flex-col items-center">
            <input
              type="text"
              onChange={handleSearch}
              className="bg-light placeholder:text-primary sticky top-0 m-3 w-11/12 rounded p-2"
              placeholder="Search users"
            />
            <ul className="top-0 flex w-full flex-col items-center">
              {user &&
                user.map((user) => (
                  <Fragment key={user.ID}>
                    <div
                      className="bg-light m-2 flex h-fit w-5/6 flex-col text-nowrap rounded-xl p-8"
                      onClick={() => {
                        navigate(`/users/${user.ID}`);
                      }}
                    >
                      <h1 className="text-text overflow-hidden text-clip text-3xl">
                        {user.username}
                      </h1>
                    </div>
                  </Fragment>
                ))}
            </ul>
            <br className="size-4" />
          </div>
        </UITemplate>
      );
    }
  } else {
    //large screen UI, show user list and user profile
    return (
      <>
        <UITemplate>
          <>
            <div className="bg-secondary flex h-screen w-1/4 flex-col">
              <input
                type="text"
                onChange={handleSearch}
                className="bg-primary m-2 h-10 rounded p-2"
                placeholder="Search users"
              />
              <ul className="mb-8 flex w-full flex-col items-center overflow-auto overscroll-auto">
                {user &&
                  user.map((user) => (
                    <Fragment key={user.ID}>
                      <div
                        className="bg-primary m-2 flex h-fit w-11/12 flex-col text-nowrap rounded-xl p-8"
                        onClick={() => {
                          navigate(`/users/${user.ID}`);
                        }}
                      >
                        <h1 className="text-text overflow-hidden text-clip text-3xl">
                          {user.username}
                        </h1>
                      </div>
                    </Fragment>
                  ))}
                <Link
                  to="/users/create"
                  className="text-primary absolute bottom-1 text-lg italic"
                >
                  create user
                </Link>
              </ul>
            </div>
            <div className="flex flex-1 overflow-auto">
              <Outlet />
            </div>
          </>
        </UITemplate>
      </>
    );
  }
}

function UserProfile({ edit = false }: { edit?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [editing, setEditing] = useState(false);

  const loggedInUser = useRef(GetUserInfo());

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

  function ChangeBio(): React.ReactElement {
    const editor = InitEditor({ content: user?.bio });

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const bio = editor?.getHTML();
      if (bio === undefined) {
        alert("bio must not be empty");
        return;
      }

      apiClient
        .put(`/users/update_bio`, { user_id: user?.ID, bio })
        .then((res) => {
          console.log("bio updated", res);
          alert("bio updated successfully");
          window.location.reload();
        })
        .catch((err) => {
          console.error("error updating bio", err);
          alert("failed to update bio");
        });
    }

    if (!editing) {
      return (
        <button
          className="ml-2 text-sm text-blue-700"
          onClick={() => setEditing(!editing)}
        >
          edit bio
        </button>
      );
    } else {
      return editor ? (
        <div className="m-4 flex grow flex-col items-center">
          <form
            className="bg-light flex w-full flex-col rounded p-2"
            onSubmit={handleSubmit}
          >
            <div className="outline-primary m-2 flex flex-col items-center space-y-4 rounded text-base outline">
              {/* Toolbar */}
              <div className="bg-primary mb-0 flex w-full">
                <button
                  type="button"
                  className="toolbar-button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                >
                  <LuHeading1 />
                </button>
                <button
                  type="button"
                  className="toolbar-button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                >
                  <LuHeading2 />
                </button>
                <button
                  type="button"
                  className="toolbar-button"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                >
                  <LuHeading3 />
                </button>
                <button
                  type="button"
                  className="toolbar-button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                >
                  <MdFormatBold />
                </button>
                <button
                  type="button"
                  className="toolbar-button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                >
                  <MdFormatItalic />
                </button>
                <button
                  type="button"
                  className="toolbar-button"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  disabled={
                    !editor.can().chain().focus().toggleCodeBlock().run()
                  }
                >
                  <MdCode />
                </button>
              </div>

              {/* Editor Content */}
              <EditorContent
                editor={editor}
                className="min-h-[150px] w-full px-2"
              />
            </div>
            <button
              type="submit"
              className="bg-primary w-fit place-self-center rounded px-2 py-1 text-sm text-gray-600 duration-100 hover:shadow-sm hover:brightness-75"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <p>Unable to post at this time</p>
      );
    }
  }

  useEffect(fetchUserInfo, [id]);

  return (
    <>
      <div className="m-4 grow">
        <div className="mb-12">
          <div className="flex flex-row items-end">
            <h1 className="text-text text-4xl font-bold">{user?.username}</h1>
            {loggedInUser.current !== null &&
              loggedInUser.current.userID == id &&
              !edit && (
                <Link
                  to={`/users/edit/${id}`}
                  className="ml-2 text-sm text-blue-700"
                >
                  Edit Profile
                </Link>
              )}
          </div>
          <h2 className="text-text text-xl underline">
            {user?.email}{" "}
            {edit && (
              <button
                className="ml-2 cursor-pointer text-sm font-thin text-blue-700"
                onClick={handleChangeEmail}
              >
                change email
              </button>
            )}
          </h2>
          <p className="text-text text-sm font-thin italic">
            Member since{" "}
            {new Date(user?.CreatedAt as string).toLocaleString("en-UK", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <br></br>
          <h3 className="text-text text-3xl font-medium">
            Bio:
            {edit && ChangeBio()}
          </h3>
          {user?.bio ? (
            <p
              className="bg-light rounded-md p-4"
              dangerouslySetInnerHTML={{ __html: user?.bio }}
            />
          ) : (
            <p className="italic">
              "This person is boring and has not written anything"
            </p>
          )}
        </div>
        <h1 className="text-text text-2xl font-bold">Posts</h1>
        <div>
          <Posts type="post" user_id={id} parent_id="0" />
        </div>
      </div>
    </>
  );
}

function handleChangeEmail() {
  const newEmail = prompt("Enter new email address");
  const user = GetUserInfo();

  if (user === null) {
    alert("Please log in first");
    return;
  }

  if (newEmail === null) {
    alert("email must not be empty");
    return;
  }

  apiClient
    .put(`/users/reset_email`, { user_id: user.userID, email: newEmail })
    .then((res) => {
      console.log("email updated", res);
      alert("email updated successfully");
      window.location.reload();
    })
    .catch((err) => {
      console.error("error updating email", err);
      alert("failed to update email");
    });
}

export { Users, UserProfile };
export type { User };
