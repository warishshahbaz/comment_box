import React from "react";
import ReactQuill from "react-quill";

// Custom toolbar options
const modules = {
  toolbar: [
    [{ bold: true }, { italic: true }, { underline: true }],
    ["image"],
    ["clean"], // Remove formatting button
  ],
};

export const ReplyEditor = ({
  showReplyEditor,
  setShowReplyEditor,
  replyText,
  setReplyText,
  handleReplySubmit,
}) => {
  return (
    <div>
      {showReplyEditor && (
        <>
          <ReactQuill
            value={replyText}
            onChange={setReplyText}
            placeholder="Write a reply..."
            modules={modules} // Apply the custom toolbar options
          />

          <div className="flex space-x-2 mt-2 justify-end ">
            <button
              onClick={handleReplySubmit}
              className="bg-blue-500 text-white text-[12px] px-1 py-1 rounded"
            >
              Send
            </button>
            <button
              onClick={() => setShowReplyEditor(false)}
              className="bg-gray-500 text-white text-[12px] px-1 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};
