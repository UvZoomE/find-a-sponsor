import { CloseTwoTone } from '@mui/icons-material';
import './styles/SignIn.css'
import { SocialIcon } from 'react-social-icons';
import { useContext, useState } from 'react';
import { signInContext } from './Home';
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { getDatabase, ref, get } from 'firebase/database';
import { useEffect } from 'react';

const SignIn = () => {
  const contextValue = useContext(signInContext);
  const { setSignIn, signIn, setCreateAccount} = contextValue;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();

  const handleSignIn = (e) => {
    e.preventDefault();
    setSignIn(false);
  }

  const handleManualSignIn = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  };

  return (
    <>
    {signIn ? (
    <div className="sign-in-container">
      <div className="sign-in-box-container">
        <CloseTwoTone className="sign-in-container-close-icon" onClick={(e) => handleSignIn(e)}/>
        <h3 className="sign-in-container-header-text">Sign In</h3>
        <form className="sign-in-form-container" onSubmit={handleManualSignIn}>
          <input type="text" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">Sign In</button>
        </form>
        <hr className="horizontal-line"/>
          <h3>Don't have an account? <a href='#' className="create-account-link" onClick={() => {
            setCreateAccount(true)
          setSignIn(false)}}>Create One</a></h3>
      </div>
      
    </div> ) : ""}
    </>
  )
}

export default SignIn;