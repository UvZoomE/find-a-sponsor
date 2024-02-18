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

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result.credential) {
        // This gives you the OAuth access token and ID token
        const credential = result.credential;
      }
      // The signed-in user info
      const user = result.user;
      console.log(user);
    }).catch((error) => {
      // Handle errors here
      console.error(error);
    });
  }, []);
  

  const handleSignIn = (e) => {
    e.preventDefault();
    setSignIn(false);
  }

  const handleSocialSignIn = async (e, provider) => {
    e.preventDefault();
    if (provider === 'google') {
      signInWithRedirect(auth, new GoogleAuthProvider());
    }

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
        <p>Or use your social media account to sign in!</p>
        <div className="social-media-icons">
          <SocialIcon network='google' onClick={(e) => handleSocialSignIn(e, 'google')}/>
          <SocialIcon network='facebook' onClick={(e) => handleSocialSignIn(e, 'facebook')}/>
          <SocialIcon network='x' onClick={(e) => handleSocialSignIn(e, 'twitter')}/>
        </div>
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