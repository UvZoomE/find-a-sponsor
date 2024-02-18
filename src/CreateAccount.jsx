import { CloseTwoTone } from "@mui/icons-material";
import './styles/CreateAccount.css'
import { useState } from "react";
import { createAccountContext } from "./Home";
import { useContext } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set} from "firebase/database";

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
    const auth = getAuth();
    const database = getDatabase();

    const handleCreateAccount = (e) => {
        e.preventDefault();
        setCreateAccount(false);
    }

    const handleAccountCreation = async (e) => {
        e.preventDefault();
        try {
            // Create user account using Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, emailAddress, password);
            const user = userCredential.user;

            // Update user profile with additional information
            await updateProfile(user, {
                displayName: username // Set username as displayName in Firebase Authentication
            });

            // Store additional user information in the Realtime Database
            await set(ref(database, 'users/' + user.uid), { // Use ref and set from the database object
                firstname: firstname,
                lastInitial: lastInitial,
                emailAddress: emailAddress,
                username: username,
                programOfChoice: programOfChoice
                // Add more user data as needed
            });

            console.log("User account created and data stored successfully!");
        } catch (error) {
            console.error("Error creating user account:", error.message);
        }
    };

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
                        <select required name="programs" onChange={(e) => setProgramOfChoice(e.target.value)}>
                            <option value="AA">(AA) Alcoholoics Anonymous</option>
                            <option value="SA">(SA) Sexaholics Anonymous</option>
                        </select>
                        <button type="submit">Create Account</button>
                    </form>
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