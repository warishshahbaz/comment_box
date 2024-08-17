import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CommentInput = ({ onSubmit }) => {
  const [comment, setComment] = useState("");
  const handleCommentChange = (value) => {
    if (value.length <= 250) {
      setComment(value);
    }
  };

  const handleSubmit = () => {
    onSubmit(comment);
    setComment("");
  };

  return (
    <div>
      <ReactQuill value={comment} onChange={handleCommentChange} />
      <button onClick={handleSubmit}>Post Comment</button>
    </div>
  );
};

export default CommentInput;
