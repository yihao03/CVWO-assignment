import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import PoopCount from "./Pages/Poop.tsx";
import { Users, UserProfile } from "./Pages/users.tsx";
import NotFound from "./Pages/NotFound.tsx";
import UserCreationForm from "./Pages/createUser.tsx";
import Home from "./Pages/Home.tsx";
import ViewPost from "./Pages/ViewPost.tsx";
import { Login } from "./controllers/login.tsx";
import UpdatePassword from "./controllers/changePassword.tsx";
import UserEdit from "./Pages/userEdit.tsx";
import SearchPost from "./controllers/searchPost.tsx";
import EditPost from "./Pages/editPost.tsx";
import CreatePost from "./Pages/CreatePost.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/poop",
    element: <PoopCount />,
  },
  {
    path: "/post",
    element: <CreatePost />,
  },
  {
    path: "/users",
    element: <Users />,
    children: [
      {
        path: "/users/:id",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "/users/create",
    element: <UserCreationForm />,
  },
  {
    path: "/users/edit/:id",
    element: <UserEdit />,
  },
  {
    path: "/users/login",
    element: <Login />,
  },
  {
    path: "/users/reset_password",
    element: <UpdatePassword />,
  },
  {
    path: "/posts/:post_id",
    element: <ViewPost />,
  },
  {
    path: "/posts/:post_id/edit",
    element: <EditPost />,
  },
  {
    path: "/search",
    element: <SearchPost />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);