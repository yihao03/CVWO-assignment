import { FaPoop } from "react-icons/fa";
import { MdHome, MdPerson } from "react-icons/md";
import { Link } from "react-router-dom";
import LogInOut from "../controllers/login";

export default function UITemplate({ children }: { children: JSX.Element }) {
  return (
    <>
      <div className="flex h-full w-full overscroll-none">
        <nav className="bg-dark left-0 top-0 flex h-screen w-fit flex-col place-items-center overscroll-none">
          <Link to="/">
            <MdHome className="bg-secondary fill-light m-2 size-10 rounded-md p-1" />
          </Link>
          <Link to="/users">
            <MdPerson className="bg-secondary fill-light m-2 size-10 rounded-md p-1" />
          </Link>
          <Link to="/poop">
            <FaPoop className="bg-secondary fill-light m-2 size-10 rounded-md p-1" />
          </Link>
          <div className="fixed bottom-3 text-white">
            <LogInOut />
          </div>
        </nav>
        <div className="bg-primary flex w-full flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
}
