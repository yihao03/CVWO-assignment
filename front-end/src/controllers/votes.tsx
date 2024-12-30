import { ReactElement, useEffect, useState } from "react";
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
}: {
  post_id: number;
  user: ExtendedJwtPayload | null;
}): ReactElement {
  const [upvotes, setUpvotes] = useState<UpvoteStatus>({
    count: 0,
    userVoted: undefined,
  });
  const [params, setParams] =
    useState<Record<string, string | undefined | number>>();

  //Initialise and fetch upvote count
  function getInitial() {
    const currentParams: Record<string, number | undefined> = {
      post_id: Number(post_id),
    };
    if (user) {
      currentParams.user_id = user.userID;
    }

    setParams(currentParams);
    console.log(currentParams);

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
    event.preventDefault();
    console.log("params as of voting", params, upvotes);
    if (!user) {
      alert("please log in first");
      return;
    }
    const currVote = upvotes.userVoted;
    //remove existing vote
    if (currVote !== undefined) {
      console.log("current status:", params, upvotes);
      apiClient
        .delete("/votes", { params: params })
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
          ...params,
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

  //eslint-disable-next-line
  useEffect(getInitial, []);

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
