import { CloseTwoTone } from '@mui/icons-material';
import './styles/SignIn.css'
import { SocialIcon } from 'react-social-icons';
import { useContext, useState } from 'react';
import { signInContext } from './Home';
// auth0.js
import auth0 from 'auth0-js';

var webAuth = new auth0.WebAuth({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientID: import.meta.env.VITE_AUTH0_CLIENT,
  responseType: "token id_token"
})

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT,
  redirect_uri: window.location.origin,
  audience: import.meta.env.VITE_API_IDENTIFIER, // (Optional) The identifier of the API to request access tokens for
};

const SignIn = () => {
  const contextValue = useContext(signInContext);
  const { setSignIn, signIn, setCreateAccount} = contextValue;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    setSignIn(false);
  }
  const handleSocialSignIn = async (provider) => {
    if (provider === 'google') {
      window.location.href = `https://${auth0Config.domain}/authorize?response_type=code&connection=google-oauth2&redirect_uri=${encodeURIComponent(auth0Config.redirect_uri)}&client_id=${auth0Config.clientId}`;
    } else if (provider === 'facebook') {
      window.location.href = `https://${auth0Config.domain}/authorize?response_type=code&connection=facebook&redirect_uri=${encodeURIComponent(auth0Config.redirect_uri)}&client_id=${auth0Config.clientId}`;
    } else if (provider === 'twitter') {
      window.location.href = `https://${auth0Config.domain}/authorize?response_type=code&connection=twitter&redirect_uri=${encodeURIComponent(auth0Config.redirect_uri)}&client_id=${auth0Config.clientId}`;
    } else {
      console.log('Invalid provider');
    }
  };

  const handleManualSignIn = async (e) => {
    e.preventDefault();
    webAuth.login({
      username: username,
      password: password,
      realm: import.meta.env.VITE_REALM_NAME
    })
  };

  return (
    <>
    {signIn ? (
    <div className="sign-in-container">
      <div className="sign-in-box-container">
        <CloseTwoTone className="sign-in-container-close-icon" onClick={(e) => handleSignIn(e)}/>
        <h3 className="sign-in-container-header-text">Sign In</h3>
        <form className="sign-in-form-container" onSubmit={handleManualSignIn}>
          <input type="text" value={username} placeholder="Email/ Username" onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">Sign In</button>
        </form>
        <p>Or use your social media account to sign in!</p>
        <div className="social-media-icons">
          <SocialIcon network='google' onClick={() => handleSocialSignIn('google')}/>
          <SocialIcon network='facebook' onClick={() => handleSocialSignIn('facebook')}/>
          <SocialIcon network='x' onClick={() => handleSocialSignIn('twitter')}/>
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