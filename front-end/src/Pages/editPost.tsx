import UITemplate from "../components/sidebar";
import { MakePost } from "../controllers/makePost";

export default function EditPost() {
  return (
    <UITemplate>
      <div className="mx-auto w-5/6">
        <MakePost type="edit" />
      </div>
    </UITemplate>
  );
}
