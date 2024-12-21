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

type PostType = "post" | "reply" | "edit";

interface PostDetails {
  type: PostType;
  parentTitle?: string;
  parentID?: number;
  postID?: number;
}

type PostStatus = "load more" | "no more posts";

function Posts({ type, level = 1, user_id, post_id, parent_id }: PostProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<PostStatus>("load more");
  const cursor = useRef<string>("");
  const navigate = useNavigate();
  const user = GetUserInfo();

  function fetchPost(replace: boolean): void {
    const params: Record<string, string | undefined> = {};
    if (user_id) params.user_id = user_id;
    if (post_id) params.post_id = post_id;
    if (parent_id) {
      params.parent_id = parent_id;
    }
    if (replace) {
      cursor.current = "";
    }

    console.log("fetching post with params:", params);

    if (cursor.current) params.cursor = cursor.current;

    apiClient
      .get("/posts", { params: params })
      .then((response) => {
        console.log("fetched posts:", response.data);

        if (replace) {
          setPosts(response.data.post);
        } else {
          setPosts((prevPosts) => prevPosts.concat(response.data.post));
        }

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchPost(true), [user_id, post_id]);

  if (posts.length === 0) {
    return;
  } else {
    return (
      <div className="flex w-full flex-col">
        {posts.map((post) => (
          <Fragment key={post.ID}>
            <div
              className="bg-light ring-secondary m-1 h-fit w-full rounded p-6 shadow-md ring"
              onClick={() => {
                navigate(`/posts/${post.ID}`);
                window.location.reload();
              }}
            >
              <div className="w-full">
                {type === "post" ? (
                  <div className="flex items-center justify-between">
                    <h2 className="truncate text-2xl font-bold">
                      {post.title}
                    </h2>
                    <div className="relative right-4 flex flex-col text-right">
                      <p className="">{post.username}</p>
                      <p className="">
                        {new Date(post.CreatedAt ?? "").toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm">
                      <span className="text-lg font-bold">
                        {post.username}{" "}
                      </span>
                      {new Date(post.CreatedAt ?? "").toLocaleString()}
                    </p>
                  </div>
                )}
                <div className="line-clamp-4 max-w-full text-ellipsis whitespace-normal break-words">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
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
        {post_id === undefined && (
          <button
            onClick={() => fetchPost(false)}
            disabled={status === "no more posts"}
          >
            {status}
          </button>
        )}
      </div>
    );
  }
}

export { Posts };
export type { PostType, PostDetails, Post };
