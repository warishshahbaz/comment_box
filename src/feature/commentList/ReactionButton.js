import React, { useState } from "react";

const relativeTimePeriods = [
  [31536000, "year"],
  [2419200, "month"],
  [604800, "week"],
  [86400, "day"],
  [3600, "hour"],
  [60, "minute"],
  [1, "second"],
];

function relativeTime(date, isUtc = true) {
  if (!(date instanceof Date)) date = new Date(date * 1000);
  const seconds = (new Date() - date) / 1000;
  for (let [secondsPer, name] of relativeTimePeriods) {
    if (seconds >= secondsPer) {
      console.log(seconds, secondsPer, name);
      const amount = Math.floor(seconds / secondsPer);
      return `${amount} ${name}${amount ? "s" : ""}s ago`;
    }
  }
  return "Just now";
}

const ReactionButton = ({
  localReactions,
  handleReaction,
  showReplyEditor,
  setShowReplyEditor,
  comment,
}) => {
  console.log(comment?.createdAt?.second, "comment?.createdAt");
  return (
    <>
      <div className="flex items-center space-x-2 mt-2">
        <button
          onClick={() => handleReaction("like")}
          className="text-blue-500 text-[10px] border-solid border-[1px] border-slate-300 rounded-xl px-2 py-1"
        >
          👍 {localReactions.like || 0}
        </button>
        <button
          onClick={() => handleReaction("anger")}
          className="text-red-500 text-[10px] border-solid border-[1px] border-slate-300 rounded-xl px-2 py-1"
        >
          😠 {localReactions.anger || 0}
        </button>
        {!showReplyEditor && (
          <button
            onClick={() => setShowReplyEditor(true)}
            className=" text-[10px] border-solid border-[1px] border-slate-300 px-2 py-1 rounded-xl "
          >
            Reply
          </button>
        )}
        <p className="text-[12px] text-gray-500">
          {relativeTime(comment?.createdAt?.seconds)}
        </p>
      </div>
    </>
  );
};

export default ReactionButton;
