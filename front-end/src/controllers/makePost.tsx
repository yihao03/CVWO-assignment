import { useState } from "react";
import { ExtendedJwtPayload, GetUserInfo } from "./auth.tsx";
import apiClient from "../api/axiosInstance.ts";
import { PostDetails, Post } from "../components/posts.tsx";

function MakePost({ type, parentID, parentTitle }: PostDetails) {
  const [post, setPost] = useState<Post>({
    title:
      type === "reply"
        ? "Reply to:" + parentTitle + `(PostID: ${parentID})`
        : "",
    content: "",
    username: "",
    user_id: 0,
    parent_id: parentID ?? 0,
  });

  async function handleSubmit(): Promise<void> {
    const user: ExtendedJwtPayload | null = GetUserInfo();
    console.log(user);
    // If the title or content is empty, alert the user to fill both fields
    if (post.title === "" || post.content === "") {
      alert("Please write both title and content.");
      return;
    }

    if (user === null) {
      alert("please log in first");
      return;
    }

    console.log("User writing this post is", user);

    const updatedPost = {
      ...post,
      username: user.username === undefined ? "guest" : user.username,
      user_id: user.userID === undefined ? -1 : Number(user.userID),
    };

    try {
      await apiClient.post("/posts", updatedPost);
      alert("Posted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error posting:", error);
      alert(`Failed to post: check console for details`);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center w-3/4 lg:w-1/2">
        {type === "post" && <h1 className="text-2xl">What's on your mind?</h1>}
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          {type === "post" && (
            <input
              type="text"
              placeholder="Title"
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="m-1 p-1 w-full"
            />
          )}
          <input
            type="text"
            placeholder="Content"
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="m-1 p-1 w-full transition-all duration-300 ease-in-out"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export { MakePost };
