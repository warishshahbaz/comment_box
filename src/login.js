import React from 'react';
import { auth } from './firebaseConfig';

const Login = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  );
};

export default Login;
