import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router"
import './index.css'
import App from './App.tsx'
import Users from "./Pages/users.tsx";
import NotFound from "./Pages/NotFound.tsx";
import UserProfile from "./Pages/userProfile.tsx";
import UserCreationForm from "./Pages/createProfile.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />
  },
  {
    path: "/users",
    element: <Users />
  },
  {
    path: "/users/:username",
    element: <UserProfile/>
  },
  {
    path: "users/create",
    element: <UserCreationForm />
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
