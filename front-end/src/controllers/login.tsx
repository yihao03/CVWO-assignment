import { useNavigate } from "react-router";
import { GetUserInfo } from "./auth";
export default function LogInOut() {
  const navigate = useNavigate();

  function handleLogout(): void {
    window.confirm("Are you sure you want to log out?");
    localStorage.removeItem("token");
    window.location.reload();
    alert("logged out successfully");
  }

  if (GetUserInfo()) {
    return <button onClick={handleLogout}>logout</button>;
  } else {
    return <button onClick={() => navigate("/users/login")}>login</button>;
  }
}
