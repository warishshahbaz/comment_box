// src/Auth.js
import React from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import google from "./images/Logo-google-icon-PNG.png";

const Auth = () => {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex justify-end items-center mb-2 ">
      <div onClick={signInWithGoogle} className="flex items-center gap-3 ">
        <img src={google} width={30} height={30} alt="google" />
        <span className="font-semibold cursor-pointer ">
          {" "}
          Sign with the Google
        </span>
      </div>
    </div>
  );
};

export default Auth;
