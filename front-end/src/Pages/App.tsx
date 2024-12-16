import {Posts, MakePost} from "../components/posts.tsx";
import UITemplate from "../components/sidebar.tsx"


export default function App() {
    return (
        <>
			<UITemplate>
					<div className="flex flex-col flex-grow place-items-center">
						<h1 className="text-center text-6xl text-text font-extrabold m-12">Welcome to this forum</h1>
						<MakePost />
					<br/>
						<Posts/>
					</div>
			</UITemplate>
        </>   
    ) 
}