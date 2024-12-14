import Card from "@mui/material/Card";


const card = {
  margin: "20px",
  backgroundColor: "gray",
  padding: "30px"
}
export default function Users() {
  const user: string[] = ["ali", "abu", "ahkau"];
  return (
    user.map((user) =>
      <Card style={card}>
        <h1>User {user}</h1>
        <h2>he is gay</h2>
      </Card>)
  )

}
