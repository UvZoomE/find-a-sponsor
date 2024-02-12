import { CloseTwoTone } from "@mui/icons-material";
import './styles/CreateAccount.css'
import { useState } from "react";
import { SocialIcon } from "react-social-icons";
import { createAccountContext } from "./Home";
import { useContext } from "react";

const CreateAccount = () => {
    const [firstname, setFirstname] = useState("");
    const [lastInitial, setLastInitial] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [programOfChoice, setProgramOfChoice] = useState("");
    const accountContextValue = useContext(createAccountContext);
    const {setCreateAccount, createAccount, setSignIn} = accountContextValue;

    const handleCreateAccount = (e) => {
        e.preventDefault();
        setCreateAccount(false);
    }

    const handleAccountCreation = async(e) => {
        e.preventDefault();
    }

    return (
        <>
        {createAccount ? 
        <div className="create-account-container">
            <div className="create-account-box-container">
                <CloseTwoTone className="create-account-container-close-icon" onClick={(e) => handleCreateAccount(e)}/>
                <h3 className="create-account-container-header-text">Create Account</h3>
                    <form onSubmit={handleAccountCreation} className="create-account-form-container">
                        <input required type="text" value={firstname} placeholder="First Name" onChange={(e) => setFirstname(e.target.value)}/>
                        <input required type="text" value={lastInitial} placeholder="Last Initial" onChange={(e) => setLastInitial(e.target.value)}/>
                        <input required type="text" value={emailAddress} placeholder="Email Address" onChange={(e) => setEmailAddress(e.target.value)}/>
                        <input required type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                        <input required type="text" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                        <input required type="password" value={confirmPassword} placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)}/>
                        <label htmlFor="programs">Program of Choice:</label>
                        <select required name="programs" onSelect={(e) => setProgramOfChoice(e.target.value)}>
                            <option value="AA">(AA) Alcoholoics Anonymous</option>
                            <option value="SA">(SA) Sexaholics Anonymous</option>
                        </select>
                    </form>
                <p>Or use your social media account to sign in!</p>
                <div className="social-media-icons">
                    <SocialIcon network='google' onClick={() => handleSocialSignIn('google')}/>
                    <SocialIcon network='facebook' onClick={() => handleSocialSignIn('facebook')}/>
                    <SocialIcon network='x' onClick={() => handleSocialSignIn('twitter')}/>
                </div>
                <hr className="horizontal-line"/>
                <h3>Have an account? <a href='#' className="sign-in-link" onClick={() => {
                    setSignIn(true)
                    setCreateAccount(false)}}>Sign In</a></h3>
            </div>
        </div> : ""}
        </>
    )
}

export default CreateAccount;