import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";

export default function NotFound() {
  return (
    <>
      <a href="https://www.svgrepo.com/show/402483/pile-of-poo.svg" className={"logo react"}></a>
      <CardActionArea href="/">
        <Card>
          <div style={{padding: "30px"}}>
            <h1>404 Not Found</h1>
            <h2>Go back to pooping</h2>
          </div>
        </Card>
      </CardActionArea>

    </>
  )
}