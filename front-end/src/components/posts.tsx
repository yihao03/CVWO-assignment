import { Fragment, useEffect, useRef, useState } from "react";
import apiClient from "../api/axiosInstance";
import { Link } from "react-router";
import Votes from "../controllers/votes";
import { GetUserInfo } from "../controllers/auth";
import { CgOptions } from "react-icons/cg";

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

function Options({
  post_id,
  enable,
}: {
  post_id: string | undefined;
  enable: boolean;
}): React.ReactElement {
  return (
    <div
      className="group relative flex w-full flex-row justify-between"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <CgOptions className="mx-auto my-2 size-4" />
      <div className="bg-light absolute flex w-fit origin-top-left translate-x-5 scale-0 flex-col rounded-sm p-2 text-sm shadow-md duration-100 group-hover:scale-100">
        <Link
          to={`/posts/${post_id}/edit`}
          className={enable ? "" : "pointer-events-none text-gray-500"}
        >
          Edit
        </Link>
        <Link
          to={`/posts/${post_id}/delete`}
          className={enable ? "" : "pointer-events-none text-gray-500"}
        >
          Delete
        </Link>
      </div>
    </div>
  );
}

function Posts({ type, level = 1, user_id, post_id, parent_id }: PostProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<PostStatus>("load more");
  const cursor = useRef<string>("");
  const user = useRef(GetUserInfo());

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
      <ul className="flex w-full flex-col">
        {posts.map((post) => (
          //Card containing post
          <Fragment key={post.ID}>
            {/* clickable post body */}
            <Link
              className="bg-light m-1 flex h-fit w-full flex-row justify-between rounded p-6 shadow-md"
              to={`/posts/${post.ID}`}
              onClick={window.location.reload}
            >
              <div className="m-2 flex w-full">
                <div className="w-full">
                  {/* title will not be shown in replies */}
                  {type === "post" ? (
                    <div className="flex flex-col justify-end md:flex-row md:justify-between">
                      <h2 className="text-ellipsis text-2xl font-bold">
                        {post.title}
                      </h2>
                      <div className="flex flex-row items-center text-left md:flex-col md:items-end">
                        <Link to={`/users/${post.user_id}`} className="text-sm">
                          {post.username}
                        </Link>
                        <p className="text-secondary ml-1 text-xs">
                          {new Date(post.CreatedAt ?? "").toLocaleString(
                            "en-UK",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center text-left">
                      <h3 className="text-lg font-bold">{post.username} </h3>
                      <p className="text-secondary ml-1 text-xs">
                        {new Date(post.CreatedAt ?? "").toLocaleString(
                          "en-UK",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          },
                        )}
                      </p>
                    </div>
                  )}
                  <div className="">
                    <div
                      className={
                        post_id === undefined
                          ? "line-clamp-4 text-ellipsis whitespace-normal break-words"
                          : ""
                      }
                    >
                      <p dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                    {type === "reply" && level !== undefined && level > 0 && (
                      <div className="ml-4">
                        <Posts
                          type="reply"
                          parent_id={post.ID}
                          level={level - 1}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex w-6 flex-col justify-between">
                <Votes post_id={Number(post.ID)} user={user.current} />
                <Options
                  post_id={post.ID}
                  enable={user.current?.userID === post.user_id}
                />
              </div>
            </Link>
          </Fragment>
        ))}
        {post_id === undefined && (
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchPost(false);
            }}
            disabled={status === "no more posts"}
            className="bg-light text-secondary m-2 rounded-md p-2 text-sm shadow-md"
          >
            {status}
          </button>
        )}
      </ul>
    );
  }
}

export { Posts };
export type { PostType, PostDetails, Post };
