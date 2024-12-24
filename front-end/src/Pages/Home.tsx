import { useEffect, useState } from "react";
import apiClient from "../api/axiosInstance.ts";
import { Posts } from "../components/posts.tsx";
import UITemplate from "../components/sidebar.tsx";
import { MakePost } from "../controllers/makePost.tsx";

interface InfoResponse {
  [key: string]: string; // Use 'any' if the value types are mixed, otherwise specify the type
}

export default function Home() {
  const [info, setInfo] = useState<InfoResponse | null>(null);
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
            {info?.welcome ?? "Welcome!"}
          </h1>
          <div className="w-full md:w-3/4">
            <MakePost type="post" post_prompt={info?.post_prompt} />
          </div>
          <br />
          <Posts type="post" parent_id="0" />
        </div>
      </UITemplate>
    </>
  );
}
