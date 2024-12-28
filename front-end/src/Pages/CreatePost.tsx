import UITemplate from "../components/sidebar";
import { MakePost } from "../controllers/makePost";

export default function CreatePost() {
  return (
    <UITemplate>
      <div className="mx-auto w-full max-w-5xl">
        <MakePost type="post" />
      </div>
    </UITemplate>
  );
}
