import { ReactElement, useRef, useState } from "react";
import { ExtendedJwtPayload } from "./auth";
import apiClient from "../api/axiosInstance";
import { FaSquareCaretUp, FaSquareCaretDown } from "react-icons/fa6";

type VoteStatus = boolean | undefined;

interface UpvoteStatus {
  count: number;
  userVoted: VoteStatus;
}

export default function Votes({
  post_id,
  user,
  count,
  voted
}: {
  post_id: number;
  user: ExtendedJwtPayload | null;
  count: number;
  voted: boolean;
}): ReactElement {
  const [upvotes, setUpvotes] = useState<UpvoteStatus>({
    count: count,
    userVoted: voted,
  });
  const params =
    useRef<Record<string, string | undefined | number>>({
      user_id: user?.userID,
      post_id: post_id,
    });


  function vote(event: React.MouseEvent<HTMLButtonElement>, vote: VoteStatus) {
    event.preventDefault();
    console.log("params as of voting", params.current, upvotes);
    if (!user) {
      alert("please log in first");
      return;
    }
    const currVote = upvotes.userVoted;
    //remove existing vote
    if (currVote !== undefined) {
      console.log("current status:", params.current, upvotes);
      apiClient
        .delete("/votes", { params: params.current })
        .then((res) => {
          console.log(
            `vote by ${user?.username} for post ${post_id} has been removed`,
            res,
          );
          setUpvotes((upvotes) => ({
            ...upvotes,
            count: upvotes.count + (currVote ? -1 : 1),
          }));
        })
        .catch((err) => {
          alert("unable to perform action");
          console.log("unable to remove vote", err);
          return;
        });
    }

    //post vote
    if (vote !== upvotes.userVoted) {
      apiClient
        .post("/votes", {
          ...params.current,
          vote: vote,
        })
        .then((res) => {
          console.log("vote posted", res);
          setUpvotes((upvotes) => ({
            count: upvotes.count + (vote ? 1 : -1),
            userVoted: vote,
          }));
        })
        .catch((err) => {
          alert("Unable to vote, check console for details");
          console.log("unable to vote", err);
        });
    } else {
      setUpvotes((upvotes) => ({
        ...upvotes,
        userVoted: undefined,
      }));
    }
  }

  return (
    <>
      <div className="bg-bg flex flex-col place-items-center rounded p-0">
        <button onClick={(e) => vote(e, true)}>
          <FaSquareCaretUp
            className={
              upvotes.userVoted === true
                ? "fill-dark hover:fill-secondary size-6 origin-center duration-100 hover:scale-125 hover:shadow-md"
                : "fill-primary hover:fill-dark size-6 origin-center duration-100 hover:scale-125 hover:shadow-md"
            }
          />
        </button>
        <div className="font-primary p-1 text-sm">{upvotes?.count}</div>
        <button onClick={(e) => vote(e, false)}>
          <FaSquareCaretDown
            className={
              upvotes.userVoted === false
                ? "fill-dark hover:fill-secondary size-6 origin-center duration-100 hover:scale-125 hover:shadow-md"
                : "fill-primary hover:fill-dark size-6 origin-center duration-100 hover:scale-125 hover:shadow-md"
            }
          />
        </button>
      </div>
    </>
  );
}
