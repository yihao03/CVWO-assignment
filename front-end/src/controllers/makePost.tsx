import { ExtendedJwtPayload, GetUserInfo } from "./auth.tsx";
import apiClient from "../api/axiosInstance.ts";
import { PostDetails, Post } from "../components/posts.tsx";
import { EditorContent, mergeAttributes, useEditor } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "./tiptap.css";
import { MdCode, MdFormatBold, MdFormatItalic } from "react-icons/md";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { useEffect, useState } from "react";
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useNavigate, useParams } from "react-router";

// create a lowlight instance with common languages loaded
const lowlight = createLowlight(common);

// function MakePost({ type, parentID }: PostDetails) {
//   const [post, setPost] = useState<Post>({
//     title:
//       type === "reply"
//         ? "Reply to: " + <a href={import.meta.env.VITE_BASE_URL + parentID} />
//         : "",
//     content: "",
//     username: "",
//     user_id: 0,
//     parent_id: parentID ?? 0,
//   });

//   async function handleSubmit(): Promise<void> {
//     const user: ExtendedJwtPayload | null = GetUserInfo();
//     console.log(user);

//     const contentHTML = editor?.getHTML();

//     if (contentHTML !== undefined) {
//       setPost({
//         ...post,
//         content: contentHTML,
//       });
//     }

//     // If the title or content is empty, alert the user to fill both fields
//     if (post.title === "" || post.content === "") {
//       alert("Please write both title and content.");
//       return;
//     }

//     if (user === null) {
//       alert("please log in first");
//       return;
//     }

//     console.log("User writing this post is", user);

//     const updatedPost = {
//       ...post,
//       username: user.username === undefined ? "guest" : user.username,
//       user_id: user.userID === undefined ? -1 : Number(user.userID),
//     };

//     try {
//       await apiClient.post("/posts", updatedPost);
//       alert("Posted successfully!");
//       window.location.reload();
//     } catch (error) {
//       console.error("Error posting:", error);
//       alert(`Failed to post: check console for details`);
//     }
//   }

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         // Add custom classes to the paragraph element
//         paragraph: {
//           HTMLAttributes: {
//             class: "text-gray-700 leading-relaxed",
//           },
//         },
//       }),
//       Heading.configure({
//         levels: [1, 2, 3],
//         HTMLAttributes: {
//           class: "font-bold text-gray-800",
//         },
//       }),
//       Bold.configure({
//         HTMLAttributes: {
//           class: "font-semibold",
//         },
//       }),
//       Italic.configure({
//         HTMLAttributes: {
//           class: "italic text-gray-600",
//         },
//       }),
//     ],
//     content: "<p>say something</p>",
//     editorProps: {
//       attributes: {
//         class:
//           "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none",
//       },
//     },
//   });

//   if (editor !== null) {
//     return (
//       <>
//         <div className="flex flex-col items-center w-3/4 lg:w-1/2">
//           {type === "post" && (
//             <h1 className="text-2xl">What's on your mind?</h1>
//           )}
//           <form className="flex flex-col w-full" onSubmit={handleSubmit}>
//             {type === "post" && (
//               <input
//                 type="text"
//                 placeholder="Title"
//                 onChange={(e) => setPost({ ...post, title: e.target.value })}
//                 className="m-1 p-1 w-full"
//               />
//             )}
//             <div className="flex flex-col items-center p-4 space-y-4">
//               {/* Toolbar */}
//               <div className="flex space-x-2">
//                 <button
//                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
//                   onClick={() => editor.chain().focus().toggleBold().run()}
//                   disabled={!editor.can().chain().focus().toggleBold().run()}
//                 >
//                   Bold
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
//                   onClick={() => editor.chain().focus().toggleItalic().run()}
//                   disabled={!editor.can().chain().focus().toggleItalic().run()}
//                 >
//                   Italic
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
//                   onClick={() =>
//                     editor.chain().focus().toggleHeading({ level: 1 }).run()
//                   }
//                 >
//                   H1
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
//                   onClick={() =>
//                     editor.chain().focus().toggleHeading({ level: 2 }).run()
//                   }
//                 >
//                   H2
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
//                   onClick={() =>
//                     editor.chain().focus().toggleHeading({ level: 3 }).run()
//                   }
//                 >
//                   H3
//                 </button>
//               </div>

//               {/* Editor Content */}
//               <EditorContent
//                 editor={editor}
//                 className="border border-gray-300 rounded-md w-full max-w-2xl min-h-[150px] p-4 focus:outline-none"
//               />
//             </div>
//             <button type="submit">Submit</button>
//           </form>
//         </div>
//       </>
//     );
//   } else {
//     return <p>unable to post at this time</p>;
//   }
// }

function MakePost({ type, parentID }: PostDetails) {
  const params = useParams();
  const navigate = useNavigate();
  const postID = params.post_id;
  const [post, setPost] = useState<Post>({
    title: type === "reply" ? `Reply to: ${parentID}` : "",
    content: "",
    username: "",
    user_id: 0,
    parent_id: parentID ?? 0,
  });

  function fetchEdit() {
    if (type !== "edit") return;
    console.log("Editing post:", postID);
    apiClient
      .get(`/posts?post_id=${postID}`)
      .then((response) => {
        const { title, content, username, user_id, parent_id } =
          response.data.post[0];
        const user = GetUserInfo();
        console.log("Editing post:", response.data.post[0]);
        if (user && user.userID !== Number(user_id)) {
          alert("You can only edit your own posts");
          navigate(-1);
          return;
        }
        setPost({ title, content, username, user_id, parent_id });
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        alert("Unable to fetch post, check console for details");
      });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchEdit, []);

  useEffect(() => {
    if (editor && type === "edit" && post.content) {
      editor.commands.setContent(post.content);
    }
  }, [post.content]);

  //initialise tiptap rich text editor
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
        placeholder: "what's on your mind?",
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
    content: type === "edit" ? post.content : "",
  });

  async function handleSubmit(): Promise<void> {
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

    if (type !== "edit") {
      try {
        apiClient.post("/posts", updatedPost);
        alert("Posted successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error posting:", error);
        alert(`Failed to post: check console for details`);
      }
    } else {
      try {
        apiClient.put(`/posts/${postID}`, updatedPost);
        alert("Updated successfully!");
        navigate(`/posts/${postID}`);
      } catch (error) {
        console.error("Error updating post:", error);
        alert(`Failed to update: check console for details`);
      }
    }
  }

  return editor ? (
    <div className="m-4 flex grow flex-col items-center">
      {type === "post" && (
        <h1 className="mb-1 text-2xl">What's on your mind?</h1>
      )}
      <form
        className="flex w-full flex-col rounded bg-gray-100 p-2 outline outline-1 outline-gray-200"
        onSubmit={handleSubmit}
      >
        {(type === "post" || type === "edit") && (
          <input
            type="text"
            placeholder="Title"
            value={type === "edit" ? post.title : post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="m-1 w-full bg-inherit p-1"
            disabled={type === "edit"}
          />
        )}
        {type === "reply" && (
          <p>
            Reply to:{" "}
            <a
              href={import.meta.env.VITE_BASE_URL + "posts/" + parentID}
              className="text-blue-500 hover:text-blue-700"
            >
              {"Post " + parentID}
            </a>
          </p>
        )}
        <div className="m-2 flex flex-col items-center space-y-4 rounded outline outline-gray-200">
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
          className="w-fit place-self-center rounded bg-gray-200 px-2 py-1 text-sm text-gray-600"
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
