import { Posts } from "../components/posts.tsx";
import UITemplate from "../components/sidebar.tsx";
import { MakePost } from "../controllers/makePost.tsx";

export default function Home() {
  return (
    <>
      <UITemplate>
        <div className="flex flex-col w-5/6 lg:w-3/4 mx-auto place-items-center">
          <h1 className="text-center text-6xl text-text font-extrabold m-12">
            Welcome to this forum
          </h1>
          <MakePost type="post" />
          <br />
          <Posts type="post" parent_id="0" />
        </div>
      </UITemplate>
    </>
  );
}
