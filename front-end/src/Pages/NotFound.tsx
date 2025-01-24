import { Link } from "react-router";
import UITemplate from "../components/sidebar";

export default function NotFound() {
  return (
    <>
      <UITemplate>
        <div className="flex h-full w-full items-center justify-center">
          <Link to="/">
            <div className="bg-primary rounded-lg p-8 shadow transition duration-300 hover:scale-105 hover:shadow-2xl">
              <h1 className="text-text text-4xl font-bold">404 Not Found</h1>
              <h2 className="text-text">Click here to go home</h2>
            </div>
          </Link>
        </div>
      </UITemplate>
    </>
  );
}
