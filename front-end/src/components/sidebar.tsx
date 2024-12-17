import { FaPoop } from "react-icons/fa";
import { MdHome, MdPerson } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { GetUserInfo } from "../controllers/auth";

export default function UITemplate({ children }: { children: JSX.Element }) {

    const navigate = useNavigate();

    function LogInOut() {
        if (GetUserInfo()) {
            return <button
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                    alert("logged out successfully");
                }}>
                log out
            </button>
        } else {
            return <button onClick={() => navigate("/users/login")}>log in</button>
        }
    }

    return (
        <>
            <div className="flex h-full w-full overscroll-none">
                <nav className="bg-dark top-0 left-0 w-fit flex flex-col place-items-center h-screen overscroll-none">
                    <Link to="/">
                        <MdHome className="size-10 bg-secondary m-2 rounded-md p-1" />
                    </Link>
                    <Link to="/users">
                        <MdPerson className="size-10 bg-secondary m-2 rounded-md p-1" />
                    </Link>
                    <Link to="/poop">
                        <FaPoop className="size-10 bg-secondary m-2 rounded-md p-1" />
                    </Link>

                    <LogInOut />
                </nav>
                <div className="bg-primary w-full flex flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </>
    )
}