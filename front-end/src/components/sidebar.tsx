import { FaPoop } from "react-icons/fa";
import { MdHome, MdPerson } from "react-icons/md";
import { Link } from "react-router-dom";
import { LogInOut } from "../controllers/login";

export default function UITemplate(props: { children: React.ReactNode }) {
  function SidebarIcon(props: {
    icon: React.ReactNode;
    link: string;
    text: string;
  }) {
    return (
      <div className="group flex flex-row items-center">
        <Link to={props.link}>{props.icon}</Link>

        <span className="bg-secondary absolute left-16 w-auto origin-left scale-0 rounded-md p-2 text-slate-100 shadow-md duration-300 group-hover:scale-100">
          {props.text}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full w-full overscroll-none">
        <nav className="bg-dark left-0 top-0 flex h-screen w-fit flex-col place-items-center overscroll-none">
          <SidebarIcon
            icon={<MdHome className="sidebar-button" />}
            link="/"
            text="Home"
          />
          <SidebarIcon
            icon={<MdPerson className="sidebar-button" />}
            link="/users"
            text="Profile"
          />
          <SidebarIcon
            icon={<FaPoop className="sidebar-button" />}
            link="/poop"
            text="Poop Counter"
          />
          <div className="fixed bottom-3 text-white">
            <LogInOut />
          </div>
        </nav>
        <div className="bg-primary flex w-full flex-1 overflow-auto">
          {props.children}
        </div>
      </div>
    </>
  );
}
