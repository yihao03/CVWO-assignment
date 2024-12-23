import UITemplate from "../components/sidebar";
import { UserProfile } from "./users";

export default function UserEdit() {
  return (
    <UITemplate>
      <div className="mx-auto w-5/6">
        <UserProfile edit={true} />
      </div>
    </UITemplate>
  );
}
