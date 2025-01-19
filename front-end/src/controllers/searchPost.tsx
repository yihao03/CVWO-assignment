import { useState } from "react";
import apiClient from "../api/axiosInstance";
import { Post } from "../components/posts";
import { Link } from "react-router";
import UITemplate from "../components/sidebar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

export default function SearchPost(): React.ReactElement {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");

  const ai = new GoogleGenerativeAI("AIzaSyCOI_vQHFe-LaTmda6n_q-UQ4KiGsVuk9M");
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [response, setResponse] = useState<string>("Gemini says...");

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResponse("Thinking really hard...");

    // querying database
    apiClient
      .get(`/posts/search?search=${search}`)
      .then((res) => {
        console.log("Search result", res.data);
        setPosts(res.data.posts);
      })
      .catch((err) => {
        console.error("Failed to search post:", err);
        alert("Failed to search post");
      });

    //asking AI model
    if (search === "") {
      setResponse("Please enter a prompt");
      return;
    }
    console.log("asking question: " + prompt);
    try {
      const res = await model.generateContent(search);
      setResponse(res.response.text());
    } catch {
      setResponse("Error in generating response");
    }
  }
  return (
    <UITemplate>
      <div className="mx-auto flex w-5/6 flex-col items-center">
        <h1 className="m-4 ml-0 text-4xl font-bold">Search</h1>
        <form
          onSubmit={(e) => handleSearch(e)}
          className="flex flex-row w-full"
        >
          <input
            type="text"
            placeholder="Ask me anything"
            className="bg-primary m-1 h-10 rounded p-1 text-gray-700 shadow duration-150 hover:-translate-y-1 hover:shadow-lg grow"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-dark ml-2 rounded h-10 p-1 m-1">Search</button>
        </form>
        <div className="w-full">
          <h1 className="m-4 ml-0 text-2xl font-bold">Gemini says...</h1>
          <div className="prose bg-primary min-h-36 max-w-none rounded p-4 shadow max-h-96 overflow-auto">
            <ReactMarkdown>{response || "## Ask Gemini"}</ReactMarkdown>
          </div>
        </div>

        <h1 className="m-4 ml-0 text-2xl font-bold">Search Results</h1>
        <ul className="w-full">
          {posts &&
            posts.map((post) => (
              <Link
                to={`/posts/${post.ID}`}
                key={post.ID}
                className="bg-primary m-1 flex h-fit w-full flex-col justify-between rounded p-6 shadow-md"
              >
                <div className={"flex flex-row justify-between align-text-top"}>
                  <h1
                    className="text-xl font-bold"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                  <a className="ml-2 text-sm font-thin">{post.username}</a>
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
