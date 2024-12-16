import { useState } from 'react'
import '../App.css'
import UITemplate from '../components/sidebar';

function PoopCount() {
  const [count, setCount] = useState(0)
  const user = localStorage.getItem('username')

  function handleClick() :void {
    setCount(count + 1);
    if (count === 10) {
      alert("You're a poophead!")
    }
  }

   return (
     <>
      <UITemplate>
         <div className="flex flex-grow flex-col items-center h-screen">
         <p className="absolute right-4">{user || "log in"}</p>
         <div className="size-fit p-12 bg-secondary text-text rounded-2xl flex flex-col items-center m-16 shadow-xl">
           <img src="https://www.svgrepo.com/show/402483/pile-of-poo.svg" alt="cute poop photo"
                className="p-4 bg-primary shadow-amber-950 rounded-xl size-64 mb-4 hover:size-96 duration-300"/>
           <h1 className="text-5xl shadow-sm font-bold">Best Poop Counter</h1>
           <p className={"text-lg mt-4"}>{user || "you"} have pooped {count} times!</p>
           <button className="bg-dark text-gray-200 p-2 rounded-md m-4 hover:bg-text hover:shadow-2xl duration-100 "
                   onClick={handleClick}>poop!
           </button>
         </div>
       </div>
       </UITemplate>
     </>
   )
}

export default PoopCount
