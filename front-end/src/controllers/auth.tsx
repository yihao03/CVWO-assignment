import { JwtPayload, jwtDecode } from "jwt-decode";

// Extend JwtPayload to include custom claims like username and user_id
interface ExtendedJwtPayload extends JwtPayload {
  userID?: number;
  username?: string;
}

function GetUserInfo(): ExtendedJwtPayload | null {
  const token = localStorage.getItem("token");

  if (token === null) {
    return null;
  }

  try {
    const decoded = jwtDecode<ExtendedJwtPayload>(token);
    console.log("Decoded token:", decoded);

    if (decoded && decoded.exp) {
      const currTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currTime) {
        localStorage.removeItem("token");
        return null;
      } else {
        return decoded;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

export { GetUserInfo };
export type { ExtendedJwtPayload };
