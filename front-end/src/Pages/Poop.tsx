import { useState } from "react";
import "../App.css";
import UITemplate from "../components/sidebar";

function PoopCount() {
  const [count, setCount] = useState(0);
  const user = localStorage.getItem("username");

  function handleClick(): void {
    setCount(count + 1);
    if (count === 10) {
      alert("You're a poophead!");
    }
  }

  return (
    <>
      <UITemplate>
        <div className="flex h-screen flex-grow flex-col items-center">
          <p className="absolute right-4">{user || "log in"}</p>
          <div className="bg-secondary text-text m-16 flex size-fit flex-col items-center rounded-2xl p-12 shadow-xl">
            <img
              src="https://www.svgrepo.com/show/402483/pile-of-poo.svg"
              alt="cute poop photo"
              className="bg-primary mb-4 size-64 rounded-xl p-4 shadow-amber-950 duration-300 hover:size-96"
            />
            <h1 className="text-5xl font-bold shadow-sm">Best Poop Counter</h1>
            <p className={"mt-4 text-lg"}>
              {user || "you"} have pooped {count} times!
            </p>
            <button
              className="bg-dark hover:bg-text m-4 rounded-md p-2 text-gray-200 duration-100 hover:shadow-2xl"
              onClick={handleClick}
            >
              poop!
            </button>
          </div>
        </div>
      </UITemplate>
    </>
  );
}

export default PoopCount;
