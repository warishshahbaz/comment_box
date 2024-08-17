import React, { useState } from "react";
import Auth from "./auth";
import CommentInput from "./comment";
import CommentList from "./commentList";
import "./App.css";

function App() {
  const [comments, setComments] = useState([]);
  return (
    <div className=" w-[500px] mx-auto p-4">
      <Auth />
      <CommentInput comments={comments} setComments={setComments} />
      <CommentList comments={comments} setComments={setComments} />
    </div>
  );
}

export default App;
