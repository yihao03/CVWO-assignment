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
  tag: string;
}

interface PostParams {
  type: PostType;
  level?: number;
  user_id?: string;
  post_id?: string;
  parent_id?: string;
  tag?: string;
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
  function handleDelete(): void {
    if (post_id) {
      apiClient
        .delete(`/posts/${post_id}`)
        .then((response) => {
          console.log("deleted post:", response.data);
          alert("Post deleted successfully!");
          window.location.reload();
        })
        .catch((err: Error): void => {
          console.log(err);
          alert("Failed to delete post. Please try again later.");
        });
    }
  }
  return (
    <div
      className="group relative flex w-full flex-row justify-between"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <CgOptions className="mx-auto my-2 size-4" />
      <div className="bg-primary absolute z-30 flex w-fit origin-top-right -translate-x-12 translate-y-5 scale-0 flex-col rounded-sm p-2 text-sm shadow-md duration-100 group-hover:scale-100 md:origin-top-left md:translate-x-5">
        <Link
          to={`/posts/${post_id}/edit`}
          className={enable ? "" : "pointer-events-none text-gray-500"}
        >
          Edit
        </Link>
        <div
          onClick={handleDelete}
          className={enable ? "" : "pointer-events-none text-gray-500"}
        >
          Delete
        </div>
      </div>
    </div>
  );
}

function Posts({
  type,
  level = 1,
  user_id,
  post_id,
  parent_id,
  tag,
}: PostParams) {
  interface PostWithVote extends Post {
    count: number;
    userVoted: boolean;
  }
  const [posts, setPosts] = useState<PostWithVote[]>([]);
  const [status, setStatus] = useState<PostStatus>("load more");
  const cursor = useRef<string>("");
  const user = useRef(GetUserInfo());

  function fetchPost(replace: boolean): void {
    const params: Record<string, string | undefined> = {};
    if (user_id) params.user_id = user_id;
    if (post_id) params.post_id = post_id;
    if (tag) params.tag = tag;
    if (parent_id) {
      params.parent_id = parent_id;
    }
    if (replace) {
      cursor.current = "";
    }
    if (user.current?.userID) {
      params.curr_user = user.current?.userID.toString();
    }

    console.log("fetching post with params:", params);

    if (cursor.current) params.cursor = cursor.current;

    apiClient
      .get("/posts", { params: params })
      .then((response) => {
        console.log("fetched posts:", response.data);
        const newPosts = response.data.posts || [];

        if (newPosts.length === 0) {
          // no posts returned
          setStatus("no more posts");
          return;
        }
        if (replace) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => prevPosts.concat(newPosts));
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
  useEffect(() => fetchPost(true), [user_id, post_id, tag]);

  if (posts.length === 0) {
    return null;
  } else {
    return (
      <ul className="flex w-full flex-col">
        {posts.map((post) => (
          //Card containing post
          <Fragment key={post.ID}>
            {/* clickable post body */}
            <Link
              className="bg-primary relative m-1 flex h-fit min-h-32 w-full flex-row justify-between rounded p-3 shadow-md"
              to={`/posts/${post.ID}`}
              onClick={window.location.reload}
            >
              <div className="m-2 mr-8 flex w-[calc(100%-8px)]">
                <div className="w-full">
                  {/* title will not be shown in replies */}
                  {type === "post" ? (
                    <div className="flex flex-col justify-end break-words md:flex-row md:justify-between">
                      {/* <h2 className="text-text text-wrap text-2xl font-bold">
                        {post.title}
                      </h2> */}
                      <div className="md: flex flex-col md:flex-row md:place-items-center">
                        <h2
                          className="text-text text-wrap text-2xl font-extrabold"
                          dangerouslySetInnerHTML={{ __html: post.title }}
                        />
                        {post.tag && (
                          <h3 className="bg-dark text-primary w-fit rounded-full p-1 px-2 text-xs md:ml-3">
                            {post.tag}
                          </h3>
                        )}
                      </div>
                      <div className="flex flex-row items-center text-left md:flex-col md:items-end">
                        <Link to={`/users/${post.user_id}`} className="text-sm">
                          {post.username}
                        </Link>
                        <p className="text-text ml-1 text-xs">
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

              <div className="absolute right-2 justify-between">
                <Votes
                  post_id={Number(post.ID)}
                  user={user.current}
                  count={post.count}
                  voted={post.userVoted}
                />
                <Options
                  post_id={post.ID}
                  enable={
                    user.current?.userID === post.user_id ||
                    user.current?.admin === true
                  }
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
            className="bg-primary text-secondary m-2 flex-1 rounded-md p-2 text-sm shadow-md"
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
