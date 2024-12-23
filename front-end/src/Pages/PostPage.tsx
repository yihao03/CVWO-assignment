import { useParams } from "react-router";
import { Posts } from "../components/posts";
import UITemplate from "../components/sidebar.tsx";
import { MakePost } from "../controllers/makePost.tsx";

export default function PostPage() {
  const params = useParams();
  const post_id = params.post_id;
  return (
    <UITemplate>
      <div className="grow md:grid md:grid-cols-4">
        <div className="col-span-3 mx-auto flex w-5/6 flex-col lg:w-2/3">
          <Posts type="post" post_id={post_id} />
          <h1 className="ml-2 mt-4 text-2xl font-bold">Replies</h1>
          <Posts type="reply" parent_id={post_id} />
        </div>
        <div className="mx-auto w-5/6">
          <MakePost type="reply" parentID={Number(post_id)} />
        </div>
      </div>
    </UITemplate>
  );
}
