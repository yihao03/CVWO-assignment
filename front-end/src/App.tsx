import { useState } from 'react'
import './App.css'
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardActionArea from '@mui/material/CardActionArea';
import {Box} from "@mui/material";

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  function show({name}: {name: string}) {
    if (name) {
      return <p>Hello {name}</p>
    }
  }

  return (
    <>
      <CardActionArea style={{margin:"20px"}} onClick={() => setCount((count) => count + 1)}>
        <Card>
          <div style={{backgroundColor: "gray", padding: "30px"}}>
            <div>
              <a href="https://react.dev" target="_blank">
                <img src="https://www.svgrepo.com/show/402483/pile-of-poo.svg" className="logo react" alt="React logo"/>
              </a>
            </div>
            <h1>Best Poop Counter</h1>
            <p>{show({name})}</p>
            <div className="card">
              <Box style={{
                backgroundColor: "brown",
                color: "white",
                display: "inline-block",
                padding: "5px",
                borderRadius: "3px"
              }}>Poop Count is {count}</Box>
            </div>
          </div>

        </Card>
      </CardActionArea>
      <TextField
        id="outlined-basic"
        label="Name"
        variant="outlined"
        onChange={(e) => setName(e.target.value)}
      />
    </>
  )
}

export default App
