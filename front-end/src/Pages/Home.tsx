import { useEffect, useState } from "react";
import apiClient from "../api/axiosInstance.ts";
import { Posts } from "../components/posts.tsx";
import UITemplate from "../components/sidebar.tsx";
import { Link } from "react-router-dom";

interface InfoResponse {
  [key: string]: string; // Use 'any' if the value types are mixed, otherwise specify the type
}

interface Tags {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  tag: string;
}
export default function Home() {
  const [info, setInfo] = useState<InfoResponse | null>(null);
  const [tagged, setTagged] = useState<string | undefined>(undefined);

  function TagBar() {
    const [tags, setTags] = useState<Tags[] | null>(null);
    useEffect(() => {
      apiClient
        .get("/tags")
        .then((response) => {
          console.log("Tags: ", response.data.tags);
          localStorage.setItem("tags", JSON.stringify(response.data.tags));
          setTags(response.data.tags);
        })
        .catch((err: Error): void => {
          console.log("Error fetching tags: ", err);
        });
    }, []);

    return (
      <>
        <div className="text-text flex flex-row">
          <button
            onClick={() => setTagged(undefined)}
            className={
              "text-text bg-bg m-0 h-full p-1 px-2 text-lg duration-300 hover:-translate-y-1 hover:brightness-125" +
              " " +
              (tagged === undefined ? "border-primary border-b-2" : "")
            }
          >
            all
          </button>
          {tags?.map((tag) => (
            <button
              onClick={() => {
                setTagged(tag.tag);
              }}
              className={
                "text-text bg-bg m-0 h-full p-1 px-2 text-lg duration-300 hover:-translate-y-1 hover:brightness-125" +
                " " +
                (tagged === tag.tag ? "border-primary border-b-2" : "")
              }
            >
              {tag.tag}
            </button>
          ))}
        </div>
      </>
    );
  }

  function Init() {
    apiClient
      .get("/info")
      .then((response) => {
        setInfo(response.data.info);
        console.log("Site info: ", response.data.info);
      })
      .catch((err: Error): void => {
        console.log("Error fetching site info: ", err);
      });
  }

  useEffect(Init, []);
  return (
    <>
      <UITemplate>
        <div className="mx-auto flex w-11/12 flex-col place-items-center md:w-5/6">
          <h1 className="text-text m-12 text-center text-6xl font-extrabold">
            {info?.welcome ?? "Connecting to database..."}
          </h1>
          <Link
            to="/post"
            className="bg-primary text-text mx-auto w-1/2 rounded-full p-2 px-4 text-opacity-50 shadow-md duration-200 hover:-translate-y-1 hover:text-opacity-95 hover:shadow-lg"
          >
            {info?.post_prompt ?? "What's on your mind?"}
          </Link>
          <br />
          <TagBar />
          <Posts type="post" parent_id="0" tag={tagged} />
        </div>
      </UITemplate>
    </>
  );
}

export type { Tags, InfoResponse };
