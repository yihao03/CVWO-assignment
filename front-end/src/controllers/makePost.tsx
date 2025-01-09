import { ExtendedJwtPayload, GetUserInfo } from "./auth.tsx";
import apiClient from "../api/axiosInstance.ts";
import { Post, PostType } from "../components/posts.tsx";
import "./tiptap.css";
import { MdCode, MdFormatBold, MdFormatItalic } from "react-icons/md";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { InitEditor } from "../components/textEditor.tsx";
import { EditorContent } from "@tiptap/react";
import { Tags } from "../Pages/Home.tsx";
import { FaTags } from "react-icons/fa";

interface MakePostDetails {
  type: PostType;
  parentID?: number;
  post_prompt?: string;
}

function MakePost(props: MakePostDetails): React.ReactElement {
  const params = useParams();
  const navigate = useNavigate();
  const postID = params.post_id;
  const [post, setPost] = useState<Post>({
    title:
      props.type === "reply"
        ? `<p>Reply to: <a href="${import.meta.env.VITE_BASE_URL}posts/${props.parentID}" class="cursor-pointer text-blue-500 underline hover:text-blue-700">Post ${props.parentID}</a></p>`
        : "",
    content: "",
    username: "",
    user_id: 0,
    parent_id: props.parentID ?? 0,
    tag: props.type === "reply" ? "reply" : "general",
  });
  const tags = useRef<Tags[] | null>(
    JSON.parse(localStorage.getItem("tags") ?? "[]"),
  );

  function Tags(): React.ReactElement {
    const [open, setOpen] = useState<boolean>(false);
    return (
      <div
        onClick={() => setOpen(!open)}
        className="group relative z-30 m-2 flex flex-col"
      >
        <div className="bg-dark text-primary flex w-fit flex-row items-center rounded-full p-1 px-2 text-xs">
          <FaTags className="mr-1" />
          {post.tag}
        </div>
        <div
          className={
            open
              ? "bg-primary absolute flex translate-y-6 flex-col shadow-md"
              : "hidden"
          }
        >
          {tags.current &&
            tags.current.map((tag: Tags) => (
              <button
                onClick={() => setPost({ ...post, tag: tag.tag })}
                className="p-1"
              >
                {tag.tag}
              </button>
            ))}
        </div>
      </div>
    );
  }

  function fetchEdit() {
    if (props.type !== "edit") return;
    console.log("Editing post:", postID);
    apiClient
      .get(`/posts?post_id=${postID}`)
      .then((response) => {
        const { title, content, username, user_id, parent_id, tag } =
          response.data.posts[0];
        const user = GetUserInfo();
        console.log("Editing post:", response.data.posts[0]);
        if (user && !(user.userID === Number(user_id) || user.admin)) {
          alert("You can only edit your own posts");
          navigate(-1);
          return;
        }
        setPost({ title, content, username, user_id, parent_id, tag });
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        alert("Unable to fetch post, check console for details");
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchEdit, []);

  useEffect(() => {
    if (editor && props.type === "edit" && post.content) {
      editor.commands.setContent(post.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.content]);

  //initialise tiptap rich text editor
  const editor = InitEditor({ content: post.content });

  //handle submission
  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const user: ExtendedJwtPayload | null = GetUserInfo();
    if (!user) {
      alert("Please log in first");
      return;
    }

    const contentText = editor?.getText();

    if (contentText === "" || post.title === "") {
      alert("Please write both title and content.");
      return;
    }

    const updatedPost = {
      ...post,
      username: user.username ?? "guest",
      user_id: user.userID ?? -1,
      content: editor?.getHTML(),
    };

    console.log("Posting:", updatedPost);

    try {
      if (props.type === "reply") {
        const res = await apiClient.post("/posts", updatedPost);
        console.log("Replied successfully:", res.data);
        alert("Replied successfully!");
        window.location.reload(); // Reload after successful post
      } else if (props.type === "post") {
        const res = await apiClient.post("/posts", updatedPost);
        console.log("Posted successfully:", res.data);
        alert("Posted successfully!");
        navigate(-1);
      } else {
        const res = await apiClient.put(`/posts/${postID}`, updatedPost);
        console.log("Updated successfully:", res.data);
        alert("Updated successfully!");
        navigate(`/posts/${postID}`); // Navigate after successful update
      }
    } catch (err) {
      console.error("Error posting:", err);
      if (err instanceof Error) {
        // @ts-expect-error response is undefinec but is checked
        alert(`Failed to post: ${err.response?.data?.error || err.message}`);
      } else {
        alert("Failed to post: An unknown error occurred");
      }
    }
  }

  return editor ? (
    <div className="m-4 flex grow flex-col items-center">
      <form
        className="bg-primary flex w-full flex-col rounded p-2"
        onSubmit={handleSubmit}
      >
        {props.type === "post" || props.type === "edit" ? (
          <input
            type="text"
            placeholder="Title"
            value={props.type === "edit" ? post.title : post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="placeholder:text-bg m-1 w-full bg-inherit p-1"
            disabled={props.type === "edit"}
          />
        ) : (
          <p>Reply to: {"Post " + props.parentID}</p>
        )}
        <Tags />
        <div className="outline-bg m-2 flex flex-col items-center space-y-4 overflow-auto rounded outline">
          {/* Toolbar */}
          <div className="bg-bg mb-0 flex w-full">
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
              disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
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
          className="bg-bg text-primary w-fit place-self-center rounded px-2 py-1 text-sm duration-100 hover:shadow-sm hover:brightness-75"
        >
          Submit
        </button>
      </form>
    </div>
  ) : (
    <p>Unable to post at this time</p>
  );
}

export { MakePost };
export type { MakePostDetails };
