import React from "react";

const DisplayText = ({ comment, renderText }) => {
  return (
    <>
      <div className="flex justify-between">
        <div className="font-semibold  ">{comment.userName}</div>
        <div className="text-sm text-gray-500"></div>
      </div>
      <div className="text-[14px] text-slate-500 ">{renderText()}</div>
      {comment.fileUrl && (
        <a
          href={comment.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          View Attached File
        </a>
      )}
    </>
  );
};

export default DisplayText;
