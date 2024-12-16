import {Link} from "react-router";

export default function NotFound() {
  return (
    <>
      <a href="https://www.svgrepo.com/show/402483/pile-of-poo.svg" className={"logo react"}></a>
      <Link to="/">
        <div style={{backgroundColor: "gray"}}>
          <div style={{padding: "30px"}}>
            <h1>404 Not Found</h1>
            <h2>Go back to pooping</h2>
          </div>
        </div>
      </Link>

    </>
  )
}