import { useParams } from "react-router-dom"
import apiClient from "../api/axiosInstance.ts";
import {useState} from "react";


export default function UserProfile() {
  const [ user, setUser ] = useState<string[]>([])
  const params = useParams<{username: string}>();

  apiClient.get('/users/' + params.username as string)
    .then((response)=> {
      // handle success
      console.log(response.data.users.username);
      setUser(response.data.users.username);
    })
    .catch((error)=> {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

  return (
        <div>
            I am {user}
        </div>
    )
}