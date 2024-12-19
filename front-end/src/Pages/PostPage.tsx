import { useParams } from "react-router";
import { Posts } from "../components/posts";
import UITemplate from "../components/sidebar";
import { MakePost } from "../controllers/makePost.tsx";

export default function PostPage() {
  const params = useParams();
  const post_id = params.post_id;
  return (
    <UITemplate>
      <div className="w-3/4 lg:w-2/3 flex flex-col mx-auto">
        <Posts type="post" post_id={post_id} />
        <MakePost type="reply" parentID={Number(post_id)} />
        <h1 className="text-2xl font-bold mt-4 ml-2">Replies</h1>
        <Posts type="reply" parent_id={post_id} />
      </div>
    </UITemplate>
  );
}
