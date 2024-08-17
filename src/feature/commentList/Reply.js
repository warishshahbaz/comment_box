import React from "react";

export const Reply = ({ replies }) => {
  return (
    <>
      {replies.map((reply, index) => (
        <div key={index} className="p-2 border-t border-gray-200 flex ">
          <div className="flex items-start">
            <img
              src={reply.userPhoto}
              alt={reply.userName}
              className="w-[30px] h-[30px] rounded-full mr-2"
            />
          </div>
          <div>
            <div className="font-semibold text-[15px] ">{reply.userName}</div>
            <div
              className="mt-1 text-[14px] text-gray-500"
              dangerouslySetInnerHTML={{ __html: reply.text }}
            />
          </div>
        </div>
      ))}
    </>
  );
};
