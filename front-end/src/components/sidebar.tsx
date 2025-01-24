import { FaPoop } from "react-icons/fa";
import { MdHome, MdOutlineManageSearch, MdPerson } from "react-icons/md";
import { Link } from "react-router-dom";
import { LogInOut } from "../controllers/login";

export default function UITemplate(props: { children: React.ReactNode }) {
  function SidebarIcon(props: {
    icon: React.ReactNode;
    link: string;
    text: string;
  }) {
    return (
      <div className="group relative flex flex-row items-center">
        <Link to={props.link}>{props.icon}</Link>

        <span className="bg-secondary absolute z-20 w-fit origin-left translate-x-16 scale-0 text-nowrap rounded-md p-2 text-slate-100 shadow-md duration-300 group-hover:scale-100">
          {props.text}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full w-full overscroll-none">
        <nav className="bg-dark fixed bottom-0 left-0 z-10 flex h-16 w-full flex-row place-items-center justify-evenly overscroll-none shadow md:static md:top-0 md:h-screen md:w-fit md:flex-col md:justify-start">
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
          <SidebarIcon
            icon={<MdOutlineManageSearch className="sidebar-button" />}
            link="/search"
            text="Search Posts"
          />
          <LogInOut />
        </nav>
        <div className="bg-bg mb-16 flex w-full flex-1 overflow-auto md:mb-0">
          {props.children}
        </div>
      </div>
    </>
  );
}
