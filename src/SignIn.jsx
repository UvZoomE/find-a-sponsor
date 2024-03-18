import { CloseTwoTone } from '@mui/icons-material';
import './styles/SignIn.css'
import { useContext, useState } from 'react';
import { signInContext } from './Home';
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, onValue, ref } from 'firebase/database';

const SignIn = () => {
  const contextValue = useContext(signInContext);
  const { setUser, setSignIn, signIn, setCreateAccount, setRealtimeUser, setMenuVisible} = contextValue;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const database = getDatabase();

  const handleSignIn = (e) => {
    e.preventDefault();
    setSignIn(false);
  }

  const handleManualSignIn = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const userRef = ref(database, 'users/' + user.uid);
    onValue(userRef, (snapshot) => {
      // onValue will trigger regardless if SignIn is mounted on the DOM or not so that is why a user image automatically populates when he/she is done
      // building their profile
      const userData = snapshot.val();
      if (user.emailVerified) {
        if (!userData.minimalProfileBuilt) {
          // If minimal profile is not built, set user and sign in
          setSignIn(false);
          setUser(user);
        } else {
          // If minimal profile is already built, set realtimeUser
          setSignIn(false);
          setRealtimeUser(userData);
        }
      } else {
        alert("You must activate your account before you can sign in! Check your email's inbox or spam folder");
        sendEmailVerification(user);
      }
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.name);
    });
    }).catch((error) => {
      console.log(error);
    });
    setMenuVisible(false);
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