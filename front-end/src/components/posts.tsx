import { useState, useEffect, Fragment, useRef } from "react";
import apiClient from "../api/axiosInstance";
import { ExtendedJwtPayload, GetUserInfo } from "../controllers/auth";

interface Post {
  ID?: number;
  username: string;
  user_id: number;
  title: string;
  content: string;
  CreatedAt?: string;
}

interface PostProps {
  user_id?: string;
  post_id?: string;
}


function Posts({ user_id, post_id }: PostProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const cursor = useRef<string>("");

  function fetchPost() {
    const params: Record<string, string | undefined> = {};
    if (user_id) params.user_id = user_id;
    if (post_id) params.post_id = post_id;
    if (cursor.current) params.cursor = cursor.current;

    apiClient.get('/posts', { params: params })
      .then((response) => {
        console.log(response.data)
        setPosts(posts.concat(response.data.post))
        if (response.data.nextCursor) cursor.current = response.data.nextCursor;
      }).catch((err: Error): void => {
        console.log(err)
      })
  }

  useEffect(fetchPost, [user_id, post_id]);

  if (posts.length === 0) {
    return <p className="bg-secondary rounded-lg p-6 m-4">backend offline</p>
  } else {
    return (
      <div className="w-3/4 xl:w-2/3 flex flex-col">
        {posts.map((post) => (
          <Fragment key={post.ID}>
            <div className="bg-secondary rounded-lg p-6 m-2 w-full shadow-md h-fit">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold truncate">{post.title}</h2>
                  <div className="relative flex flex-col right-4 text-right">
                    <p className="">{post.username}</p>
                    <p className="">{new Date(post.CreatedAt ?? "").toLocaleString()}</p>
                  </div>
                </div>
                <p className="whitespace-normal max-w-full break-words line-clamp-4 text-ellipsis">{post.content}</p>
              </div>
              <br />
              <div className="flex flex-row place-items-center">
                {["up", "down", "left", "right"].map((element) => (
                  <button
                    className="hover:ring-1 hover:ring-amber-950 hover:bg-dark hover:text-white flex-grow hover:grow-[2] duration-100  ">{element}
                  </button>
                ))}
              </div>
              <div className="flex flex-row items-center mt-3">
                <input type="text" placeholder="reply..."
                  className="w-full bg-light p-2 rounded-sm h-10" />
                <button className="ml-1 bg-dark text-light p-1 h-10 rounded-sm hover:bg-amber-950 duration-150">submit
                </button>
              </div>
            </div>
          </Fragment>
        ))}
        <button onClick={fetchPost}>load more</button>
      </div>
    )
  }
}

function MakePost() {
  const [post, setPost] = useState<Post>({
    title: "",
    content: "",
    username: "",
    user_id: 0
  });


  async function handleSubmit(): Promise<void> {
    const user: ExtendedJwtPayload | null = GetUserInfo();
    // If the title or content is empty, alert the user to fill both fields
    if (post.title === "" || post.content === "") {
      alert("Please write both title and content.");
      return;
    }

    if (user === null) {
      alert("please log in first");
      return;
    }

    console.log("this is user", user);

    const updatedPost = {
      ...post,
      username: user.username === undefined ? "guest" : user.username,
      user_id: user.userID === undefined ? -1 : Number(user.userID),
    };


    try {
      await apiClient.post('/posts', updatedPost);
      alert('Posted successfully!');
    } catch (error) {
      console.error("Error posting:", error);
      alert(`Failed to post: check console for details`);
    }
  }



  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl">What's on your mind?</h1>
        <div className="flex flex-col">
          <input type="text" placeholder="Title" onChange={e => setPost({ ...post, title: e.target.value })}
            className="m-1 p-1 w-96" />
          <input type="text" placeholder="Content" onChange={e => setPost({ ...post, content: e.target.value })}
            className="m-1 p-1 w-96 transition-all duration-300 ease-in-out" />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </>
  );
}

export { Posts, MakePost };
