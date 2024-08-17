import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { formatDistanceToNow, format } from "date-fns"; // Import format from date-fns
import moment from "moment";
import { timeago } from "./feature/timeAgo";
import ReactQuill from "react-quill";
import DisplayText from "./feature/commentList/displayText";
import ReactionButton from "./feature/commentList/ReactionButton";
import { ReplyEditor } from "./feature/commentList/replyEditor";
import { Reply } from "./feature/commentList/Reply";

const CommentList = ({ comments, setComments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(comments.length / pageSize);
  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);

  const paginate = (comments, pageSize, currentPage) => {
    const startIndex = (currentPage - 1) * pageSize;
    return comments.slice(startIndex, startIndex + pageSize);
  };

  const paginatedItems =
    comments.length > 9 ? paginate(comments, pageSize, currentPage) : comments;

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {paginatedItems.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      {comments.length > 10 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          handleClick={handleClick}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      )}
    </div>
  );
};

const Comment = ({ comment, sortByPopular, sortByLatest }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [user] = useAuthState(auth);
  const [localReactions, setLocalReactions] = useState(comment.reactions || {});
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplyEditor, setShowReplyEditor] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleReaction = async (reactionType) => {
    const commentRef = doc(db, "comments", comment.id);
    const updatedReactions = {
      ...localReactions,
      [reactionType]: (localReactions[reactionType] || 0) + 1,
    };

    setLocalReactions(updatedReactions);
    await updateDoc(commentRef, { reactions: updatedReactions });
  };

  const handleReplySubmit = async () => {
    if (replyText.trim() === "") return;

    const commentRef = doc(db, "comments", comment.id);
    const newReply = {
      userName: user.displayName,
      userPhoto: user.photoURL,
      text: replyText,
      createdAt: new Date(),
    };

    setReplies((prevReplies) => [...prevReplies, newReply]);
    setReplyText("");
    setShowReplyEditor(false);

    await updateDoc(commentRef, {
      replies: arrayUnion(newReply),
    });
  };

  const renderText = () => {
    if (comment.text.length <= 250) {
      return (
        <div
          className="comment-text"
          dangerouslySetInnerHTML={{ __html: comment.text }}
        />
      );
    }

    if (isExpanded) {
      return (
        <>
          <div
            className="comment-text"
            dangerouslySetInnerHTML={{ __html: comment.text }}
          />
          <span
            onClick={toggleReadMore}
            className="text-blue-500 cursor-pointer"
          >
            Read Less
          </span>
        </>
      );
    } else {
      return (
        <>
          <div
            className="comment-text"
            dangerouslySetInnerHTML={{
              __html: comment.text.slice(0, 250) + "...",
            }}
          />
          <span
            onClick={toggleReadMore}
            className="text-blue-500 cursor-pointer"
          >
            Read More
          </span>
        </>
      );
    }
  };

  return (
    <div className="p-4 border-b flex w-full">
      <div className="flex items-start justify-end">
        <img
          src={comment?.userPhoto ?? ""}
          alt={comment.userName}
          className="w-[40px] h-[40px] rounded-full mr-3"
        />
      </div>
      <div className="flex flex-col w-full ml-2">
        <DisplayText comment={comment} renderText={renderText} />
        <ReactionButton
          localReactions={localReactions}
          handleReaction={handleReaction}
          comment={comment}
          showReplyEditor={showReplyEditor}
          setShowReplyEditor={setShowReplyEditor}
        />
        <ReplyEditor
          showReplyEditor={showReplyEditor}
          setShowReplyEditor={setShowReplyEditor}
          replyText={replyText}
          setReplyText={setReplyText}
          handleReplySubmit={handleReplySubmit}
        />

        <div className="mt-2">
          <Reply replies={replies} />
        </div>
      </div>
    </div>
  );
};

export default CommentList;

const Pagination = ({
  currentPage,
  handleClick,
  totalPages,
  pageNumbers,
  handleNextPage,
  handlePrevPage,
}) => {
  return (
    <>
      <div className=" flex justify-center gap-3 mt-2 ">
        <button
          className={`${
            currentPage === 1
              ? "text-slate-400 cursor-not-allowed "
              : " cursor-pointer "
          }`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handleClick(number)}
            className={
              number === currentPage
                ? "bg-blue-500 text-white rounded-md px-2 py-1 cursor-pointer  "
                : " cursor-pointer px-2 py-1 border-[1px] border-solid border-slate-400 rounded-md "
            }
          >
            {number}
          </button>
        ))}

        <button
          className={`${
            currentPage === totalPages
              ? "text-slate-400 cursor-not-allowed "
              : " cursor-pointer "
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};
