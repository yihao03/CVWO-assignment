import { useState } from "react";
import apiClient from "../api/axiosInstance";
import { Post } from "../components/posts";
import { Link } from "react-router";
import UITemplate from "../components/sidebar";

export default function SearchPost(): React.ReactElement {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length < 3) return;
    setSearch(e.target.value);
    apiClient
      .get(`/posts/search?search=${e.target.value}`)
      .then((res) => {
        console.log("Search result", res.data);
        setPosts(res.data.posts);
      })
      .catch((err) => {
        console.error("Failed to search post:", err);
        alert("Failed to search post");
      });
  }
  return (
    <UITemplate>
      <div className="mx-auto flex w-5/6 flex-col items-center">
        <h1 className="m-4 ml-0 text-4xl font-bold">Search</h1>
        <input
          type="text"
          placeholder="What are you looking for?"
          className="bg-primary m-1 h-10 w-1/2 p-1 text-gray-700 rounded  shadow hover:-translate-y-1 duration-150 hover:shadow-lg"
          onChange={handleSearch}
        />
        <ul className="w-full">
          {posts &&
            posts.map((post) => (
              <Link
                to={`/posts/${post.ID}`}
                key={post.ID}
                className="bg-primary m-1 flex h-fit w-full flex-col justify-between rounded p-6 shadow-md"
              >
                <div className={"flex flex-row justify-between align-text-top"}>
                  <h1 className="text-xl font-bold" dangerouslySetInnerHTML={{ __html: post.title }} />
                  <a className="ml-2 text-sm font-thin">
                    {post.username}
                  </a>
                </div>
                <div>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.content.replace(
                        new RegExp(`(${search})`, "gi"),
                        (match) => `<mark>${match}</mark>`,
                      ),
                    }}
                  />
                </div>
              </Link>
            ))}
        </ul>
      </div>
    </UITemplate>
  );
}
