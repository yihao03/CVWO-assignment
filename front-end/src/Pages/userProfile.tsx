import { useParams } from "react-router-dom"
import apiClient from "../api/axiosInstance.ts";
import {useEffect, useState} from "react";


export default function UserProfile() {
  const [ user, setUser ] = useState<string[]>([])
  const {username} = useParams<{username: string}>();

  useEffect(() => {
    apiClient.get('/users/' + username as string)
      .then((response) => {
        // handle success
        console.log(response.data.users.username);
        setUser(response.data.users.username);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      })
  }, [username]);

  return (
        <div className="">
            I am {username}
        </div>
    )
}