import { Posts } from "../components/posts.tsx";
import UITemplate from "../components/sidebar.tsx";
import { MakePost } from "../controllers/makePost.tsx";

export default function Home() {
  return (
    <>
      <UITemplate>
        <div className="mx-auto flex w-5/6 flex-col place-items-center lg:w-3/4">
          <h1 className="text-text m-12 text-center text-6xl font-extrabold">
            Welcome to this forum
          </h1>
          <div className="w-full md:w-3/4">
            <MakePost type="post" />
          </div>
          <br />
          <Posts type="post" parent_id="0" />
        </div>
      </UITemplate>
    </>
  );
}
