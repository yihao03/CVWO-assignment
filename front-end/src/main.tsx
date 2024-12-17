import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router"
import './index.css'
import PoopCount from './Pages/Poop.tsx'
import { Users, Login, UserProfile } from "./Pages/users.tsx";
import NotFound from "./Pages/NotFound.tsx";
import UserCreationForm from "./Pages/createProfile.tsx";
import App from './Pages/App.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />
  },
  {
    path: "/poop",
    element: <PoopCount />,
  },
  {
    path: "/users",
    element: <Users />,
    children: [
      {
        path: "/users/:id",
        element: <UserProfile />
      }
    ]
  },
  {
    path: "/users/create",
    element: <UserCreationForm />
  },
  {
    path: "/users/login",
    element: <Login />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />'
  </StrictMode>,
)
