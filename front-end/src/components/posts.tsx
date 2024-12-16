import { useState, useEffect } from "react";
import apiClient from "../api/axiosInstance";
import { Navigate } from "react-router-dom";

interface Post {
    title: string;
    content: string;
    username: string;
    user_id: number;
}

function Posts() {
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        apiClient.get('/posts')
          .then((response) => {
              console.log(response.data)
              setPosts(response.data.post)
          }).catch((err: Error): void => {
              console.log(err)
        })
    },[]);

    if (posts.length === 0) {
        return <p className="bg-secondary rounded-lg p-6 m-4">there's nothing here</p>
    } else {
        return (
          <>
              {posts.map((post) => (
                <>
                    <div className="bg-secondary rounded-lg p-6 m-2 w-1/2 h-fit max-h-1/3 shadow-md">
                        <div>
                          <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{post.title}</h2>
                            <p className="text-sm text-light float-right top-4">{post.username}</p>
                          </div>
                          <p>{post.content}</p>
                        </div>
                        <br />
                        <div className="flex flex-row place-items-center">
                            <button className="hover:ring-1 hover:ring-amber-950 hover:bg-dark hover:text-white flex-grow hover:flex-grow-[2] duration-100  ">up</button>
                            <button className="hover:ring-1 hover:ring-amber-950 hover:bg-dark hover:text-white flex-grow hover:flex-grow-[2] duration-100  ">down</button>
                            <button className="hover:ring-1 hover:ring-amber-950 hover:bg-dark hover:text-white flex-grow hover:flex-grow-[2] duration-100  ">left</button>
                            <button className="hover:ring-1 hover:ring-amber-950 hover:bg-dark hover:text-white flex-grow hover:flex-grow-[2] duration-100  ">right</button>
                        </div>
                        <div className="flex flex-row items-center mt-3">
                            <input type="text" name="comment" placeholder="reply..." className="w-full bg-light p-2 rounded-sm h-10"/>
                            <button className="ml-1 bg-dark text-light p-1 h-10 rounded-sm hover:bg-amber-950 duration-150">submit</button>
                        </div>
                    </div>
            
                </>
              ))}
          </>
        )
    }

}

function MakePost() {
    const [ post , setPost ] = useState<Post>({
        title: "",
        content: "",
        username: "",
        user_id: 0
    });

    const username: string = String(localStorage.getItem("username"));
    const user_id: number = Number(localStorage.getItem("user_id"));
    

    async function handleSubmit(): Promise<void> {
        try {
            // First, check if the user exists
            const response = await apiClient.get("/users", {
                params: {
                    user_id: user_id
                }
            });

            // If the user exists, alert the user to log in first
            if (response.data && response.data.users[0].username !== username) {
                alert("Please log in first!");
                return;
            }

            // If the title or content is empty, alert the user to fill both fields
            if (post.title === "" || post.content === "") {
                alert("Please write both title and content.");
                return;
            }

            // Set the post with user information before posting
            const updatedPost = {
                ...post,
                username: username,
                user_id: user_id
            };

            // Send the post request to the server
            try {
                await apiClient.post('/posts', updatedPost);
                alert('Posted successfully!');
            } catch (error) {
                console.error("Error posting:", error);
                alert(`Failed to post: ${error.response?.data || error.message}`);
            }
        } catch (error) {
            console.error("Error checking user existence:", error);
            alert("Error checking user existence. Please try again.");
        }
    }


    return (
        <>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl">What's on your mind?</h1>
                <div className="flex flex-col">
                    <input type="text" placeholder="Title" onChange={e => setPost({...post, title: e.target.value})} className="m-1 p-1 w-96"/>
                    <input type="text" placeholder="Content" onChange={e => setPost({ ...post, content: e.target.value })} className="m-1 p-1 w-96 transition-all duration-300 ease-in-out" />
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </>
    );
}
export {Posts, MakePost};