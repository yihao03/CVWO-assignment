import { useState } from "react";
import UITemplate from "../components/sidebar";

function PoopCount() {
  const [count, setCount] = useState(
    Number(localStorage.getItem("poopCount")) || 0,
  );
  const user = localStorage.getItem("username");

  function handleClick(): void {
    setCount(count + 1);
    localStorage.setItem("poopCount", (count + 1).toString());
    if (count === 5) {
      alert("good shit");
    } else if (count === 10) {
      alert("solid!");
    } else if (count === 15) {
      alert("abit too much");
    } else if (count === 20) {
      alert("wait bro hold up");
    } else if (count === 25) {
      alert("stop stop STOP");
    } else if (count === 30) {
      alert("bro solving world hunger");
    } else if (count === 50) {
      alert("i have no words (just shits)");
    }
  }

  return (
    <>
      <UITemplate>
        <div className="flex h-screen flex-grow flex-col items-center">
          <div className="bg-secondary text-text m-16 flex size-fit flex-col items-center rounded-2xl p-12 shadow-xl">
            <img
              src="https://www.svgrepo.com/show/402483/pile-of-poo.svg"
              alt="cute poop photo"
              className="bg-bg mb-4 size-64 rounded-xl p-4 shadow-amber-950 duration-300 hover:size-96"
            />
            <h1 className="text-center text-5xl font-bold shadow-sm">
              Best Poop Counter
            </h1>
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
