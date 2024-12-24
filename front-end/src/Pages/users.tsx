import { Link, Outlet, useNavigate, useParams } from "react-router";
import apiClient from "../api/axiosInstance";
import React, { Fragment, useEffect, useRef, useState } from "react";
import UITemplate from "../components/sidebar";
import { Posts } from "../components/posts";
import { GetUserInfo } from "../controllers/auth";
import Bold from "@tiptap/extension-bold";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Italic from "@tiptap/extension-italic";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, mergeAttributes, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Heading } from "../components/heading";
import { common, createLowlight } from "lowlight";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { MdFormatBold, MdFormatItalic, MdCode } from "react-icons/md";

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
          <ul className="bg-secondary top-0 flex h-screen w-full flex-col items-center overscroll-none">
            <input
              type="text"
              onChange={handleSearch}
              className="bg-primary m-3 w-5/6 rounded-sm p-2"
              placeholder="Search users"
            />
            {user &&
              user.map((user) => (
                <Fragment key={user.ID}>
                  <div
                    className="bg-primary m-2 flex h-fit w-5/6 flex-col text-nowrap rounded-xl p-8"
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
              className="absolute bottom-1 text-lg italic text-blue-700"
            >
              create user
            </Link>
          </ul>
        </UITemplate>
      );
    }
  } else {
    //large screen UI, show user list and user profile
    return (
      <>
        <UITemplate>
          <>
            <ul className="bg-secondary top-0 flex h-screen w-1/4 flex-col items-center overscroll-none">
              <input
                type="text"
                onChange={handleSearch}
                className="bg-primary m-3 w-5/6 rounded-sm p-2"
                placeholder="Search users"
              />
              {user &&
                user.map((user) => (
                  <Fragment key={user.ID}>
                    <div
                      className="bg-primary m-2 flex h-fit w-5/6 flex-col text-nowrap rounded-xl p-8"
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
                className="absolute bottom-1 text-lg italic text-blue-700"
              >
                create user
              </Link>
            </ul>
            <div className="bg-primary flex flex-1 overflow-auto">
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
    const lowlight = createLowlight(common);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          paragraph: {
            HTMLAttributes: {
              class: "text-gray-700 leading-relaxed",
            },
          },
        }),
        Heading.configure({ levels: [1, 2, 3] }).extend({
          //Allow heading levels
          levels: [1, 2, 3],
          renderHTML({ node, HTMLAttributes }) {
            const level = this.options.levels.includes(node.attrs.level)
              ? node.attrs.level
              : this.options.levels[0];

            type Classes = {
              [key: number]: string;
            };

            //define classes
            const classes: Classes = {
              1: "text-2xl text-gray-900 font-bold",
              2: "text-xl text-gray-800 font-semibold",
              3: "text-lg text-gray-700 font-",
            };

            return [
              `h${level}`,
              mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: `${classes[level]}`,
              }),
              0,
            ];
          },
        }),
        Bold.configure({
          HTMLAttributes: {
            class: "font-semibold",
          },
        }),
        Italic.configure({
          HTMLAttributes: {
            class: "italic text-gray-600",
          },
        }),
        Placeholder.configure({
          placeholder: "Tell us about yourself",
        }),
        CodeBlockLowlight.configure({
          lowlight,
          HTMLAttributes: {
            class: "bg-black p-2 rounded text-gray-50",
          },
        }),
      ],
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none",
        },
      },
      content: user?.bio ?? "",
    });

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
            className="flex w-full flex-col rounded bg-gray-100 p-2 outline outline-1 outline-gray-200"
            onSubmit={handleSubmit}
          >
            <div className="m-2 flex flex-col items-center space-y-4 rounded text-base outline outline-gray-200">
              {/* Toolbar */}
              <div className="mb-0 flex w-full bg-gray-200">
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
              className="w-fit place-self-center rounded bg-gray-200 px-2 py-1 text-sm text-gray-600 duration-100 hover:shadow-sm hover:brightness-75"
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
            className="rounded-md bg-gray-100 p-4"
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
