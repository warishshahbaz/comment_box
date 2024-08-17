import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom toolbar options
const modules = {
  toolbar: [
    [{ bold: true }, { italic: true }, { underline: true }],
    ["image"],
    ["clean"], // Remove formatting button
  ],
};

const CommentInput = ({ comments, setComments }) => {
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [user] = useAuthState(auth); // Get the current logged-in user
  const [isActive, setIsActive] = useState("latest");

  const handleSubmit = async () => {
    let fileUrl = "";

    if (file) {
      const fileRef = ref(storage, `files/${file.name}`);
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
    }

    // Save the comment to Firestore
    if (user) {
      await addDoc(collection(db, "comments"), {
        text: comment,
        fileUrl: fileUrl,
        userName: user.displayName,
        userPhoto: user.photoURL,
        userId: user.uid,
        createdAt: serverTimestamp(), // Store the time the comment was created
        reactions: {
          like: 0,
          anger: 0,
        }, // You can initialize reactions here if needed
      });
    }

    // Reset the input fields
    setComment("");
    setFile(null);
  };

  const sortByLatest = () => {
    setIsActive("latest");
    const sorted = [...comments].sort((a, b) => {
      // Ensure createdAt is a timestamp and compare it
      const dateA = a.createdAt ? a.createdAt.toMillis() : 0;
      const dateB = b.createdAt ? b.createdAt.toMillis() : 0;
      return dateB - dateA;
    });
    setComments(sorted);
  };

  const sortByPopular = () => {
    setIsActive("popular");
    const sorted = [...comments].sort((a, b) => {
      // Ensure reactions are numbers and compare their sum
      const reactionCountA =
        (a.reactions?.like || 0) + (a.reactions?.anger || 0);
      const reactionCountB =
        (b.reactions?.like || 0) + (b.reactions?.anger || 0);

      return reactionCountB - reactionCountA; // Sort by the total number of reactions
    });
    setComments(sorted);
  };

  const isEditorEmpty = (content) => {
    const textContent = content.replace(/<[^>]*>?/gm, "").trim();
    return !textContent;
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold mb-1 ">Comments ({comments.length}) </h3>
        <div className="flex space-x-2">
          <button
            className={isActive === "latest" ? " " : "text-slate-400"}
            onClick={sortByLatest}
          >
            Latest
          </button>
          <button
            className={isActive === "popular" ? " " : "text-slate-400"}
            onClick={sortByPopular}
          >
            Popular
          </button>
        </div>
      </div>

      <ReactQuill
        value={comment}
        onChange={setComment}
        placeholder="Write a comment..."
        modules={modules} // Apply the custom toolbar options
      />

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isEditorEmpty(comment)}
          className={`bg-blue-500 text-white px-4 py-1 mt-2 rounded ${
            isEditorEmpty(comment) ? "opacity-50" : ""
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
