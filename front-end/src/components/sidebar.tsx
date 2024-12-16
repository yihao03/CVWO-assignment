import { FaPoop } from "react-icons/fa";
import { MdHome, MdPerson } from "react-icons/md";
import { Link } from "react-router-dom";

export default function UITemplate({children}: {children: JSX.Element}) {
    return (
        <>  
            <div className="flex h-full w-full overscroll-none">
                <nav className="bg-dark top-0 left-0 w-fit flex flex-col place-items-center h-screen overscroll-none">
                    <Link to="/">
                        <MdHome className="size-10 bg-secondary m-2 rounded-md p-1"/>
                    </Link>
                    <Link to="/users">
                        <MdPerson className="size-10 bg-secondary m-2 rounded-md p-1"/>
                    </Link>
                    <Link to="/poop">
                        <FaPoop className="size-10 bg-secondary m-2 rounded-md p-1"/>
                    </Link>
                    <i className="size-8 bg-secondary m-2 self-center">A</i>
                    <i className="size-8 bg-secondary m-2 self-center">A</i>
                </nav>
                <div className="bg-primary flex flex-grow overflow-auto">
                    {children}
                </div>
            </div>
        </>
    )
}