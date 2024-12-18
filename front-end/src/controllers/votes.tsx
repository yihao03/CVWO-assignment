import { ReactElement, useEffect, useState } from "react";
import { ExtendedJwtPayload } from "./auth";
import apiClient from "../api/axiosInstance";

type VoteStatus = boolean | undefined;

interface UpvoteStatus {
  count: number;
  userVoted: VoteStatus;
}

export default function Upvotes({
  post_id,
  user,
}: {
  post_id: string;
  user: ExtendedJwtPayload | null;
}): ReactElement {
  const [upvotes, setUpvotes] = useState<UpvoteStatus>({
    count: 0,
    userVoted: undefined,
  });
  const [params, setParams] = useState<Record<string, string | undefined>>();

  //Initialise and fetch upvote count
  function getInitial() {
    const currentParams: Record<string, string | undefined> = { post_id };
    if (user) {
      currentParams.user_id = String(user.userID);
    }

    setParams(currentParams);

    apiClient
      .get(`/votes`, { params: currentParams })
      .then((res) => {
        console.log(post_id, res);
        setUpvotes({
          count: res.data.count,
          userVoted: res.data.userVoted,
        });
      })
      .catch((err) => {
        setUpvotes({
          count: -1,
          userVoted: undefined,
        });
        console.log("unable to get votes", err);
      });
  }

  function vote(event: React.MouseEvent<HTMLButtonElement>, vote: VoteStatus) {
    event.stopPropagation();

    //remove existing vote
    if (upvotes?.userVoted !== undefined) {
      apiClient
        .delete("/votes", params)
        .then((res) =>
          console.log(
            `vote by ${user?.username} for post ${post_id} has been removed`,
            res
          )
        )
        .catch((err) => {
          alert("unable to perform action");
          console.log("unable to remove vote", err);
          return;
        });
    }

    //post vote
    apiClient
      .post("/votes", {
        ...params,
        vote: vote,
      })
      .then((res) => {
        console.log("vote posted", res);
      })
      .catch((err) => {
        alert("Unable to vote, check console for details");
        console.log("unable to vote", err);
      });
  }

  useEffect(getInitial, []);
  return (
    <>
      <div className="flex flex-row place-items-center">
        <button
          onClick={(e) => vote(e, true)}
          className="hover:ring-1 hover:ring-amber-950 hover:bg-dark hover:text-white flex-grow hover:grow-[2] duration-100  "
        >
          upvote
        </button>
        <div className="p-1">{upvotes?.count}</div>
        <button
          onClick={(e) => vote(e, false)}
          className="hover:ring-1 hover:ring-amber-950 hover:bg-dark hover:text-white flex-grow hover:grow-[2] duration-100  "
        >
          downvote
        </button>
      </div>
    </>
  );
}
