import { Fragment, useEffect, useRef, useState } from "react";
import apiClient from "../api/axiosInstance";
import { useNavigate } from "react-router";
import Votes from "../controllers/votes";
import { GetUserInfo } from "../controllers/auth";

interface Post {
  ID?: string;
  username: string;
  user_id: number;
  title: string;
  content: string;
  CreatedAt?: string;
  parent_id?: number;
}

interface PostProps {
  type: PostType;
  level?: number;
  user_id?: string;
  post_id?: string;
  parent_id?: string;
}

type PostType = "post" | "reply";

interface PostDetails {
  type: PostType;
  parentTitle?: string;
  parentID?: number;
}

type PostStatus = "load more" | "no more posts";

function Posts({ type, level = 1, user_id, post_id, parent_id }: PostProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<PostStatus>("load more");
  const cursor = useRef<string>("");
  const navigate = useNavigate();
  const user = GetUserInfo();

  function fetchPost() {
    const params: Record<string, string | undefined> = {};
    if (user_id) params.user_id = user_id;
    if (post_id) params.post_id = post_id;
    if (parent_id) {
      params.parent_id = parent_id;
    }

    console.log("fetch details:", params);

    if (cursor.current) params.cursor = cursor.current;

    apiClient
      .get("/posts", { params: params })
      .then((response) => {
        console.log(response.data);
        setPosts(posts.concat(response.data.post));
        if (response.data.nextCursor) {
          cursor.current = response.data.nextCursor;
        } else {
          setStatus("no more posts");
        }
      })
      .catch((err: Error): void => {
        console.log(err);
      });
  }

  useEffect(fetchPost, [user_id, post_id]);

  if (posts.length === 0) {
    return;
  } else {
    return (
      <div className="w-full flex flex-col">
        {posts.map((post) => (
          <Fragment key={post.ID}>
            <div
              className="bg-secondary rounded-lg p-6 m-2 w-full shadow-md h-fit ring ring-orange-950"
              onClick={() => {
                navigate(`/posts/${post.ID}`);
                window.location.reload();
              }}
            >
              <div className="w-full">
                {type === "post" ? (
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold truncate">
                      {post.title}
                    </h2>
                    <div className="relative flex flex-col right-4 text-right">
                      <p className="">{post.username}</p>
                      <p className="">
                        {new Date(post.CreatedAt ?? "").toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm">
                      <span className="font-bold text-lg">
                        {post.username}{" "}
                      </span>
                      {new Date(post.CreatedAt ?? "").toLocaleString()}
                    </p>
                  </div>
                )}
                <p className="whitespace-normal max-w-full break-words line-clamp-4 text-ellipsis">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </p>
              </div>
              {type === "reply" && level !== undefined && level > 0 && (
                <div className="ml-4">
                  <Posts type="reply" parent_id={post.ID} level={level - 1} />
                </div>
              )}
              <div className="mt-4">
                <Votes post_id={Number(post.ID)} user={user} />
              </div>
            </div>
          </Fragment>
        ))}
        {post_id === undefined && <button onClick={fetchPost}>{status}</button>}
      </div>
    );
  }
}

export { Posts };
export type { PostType, PostDetails, Post };
