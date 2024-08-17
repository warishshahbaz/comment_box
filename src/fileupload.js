import React, { useState } from "react";
import { storage } from "./firebaseConfig";

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = () => {
    if (file) {
      const storageRef = storage.ref(`files/${file.name}`);
      storageRef.put(file).then((snapshot) => {
        storageRef.getDownloadURL().then((url) => {
          onFileUpload(url);
          setFile(null);
        });
      });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload File</button>
    </div>
  );
};

export default FileUpload;
