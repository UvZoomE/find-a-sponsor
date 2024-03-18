import { useContext } from "react"
import { messageModalContext } from "./Home"

import "./styles/MessageModal.css"

import {
  CloseTwoTone,
  ArrowBackTwoTone
} from "@mui/icons-material";

import crypto from "crypto";

import universe from "./universe.jpg"
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";

const MessageModal = () => {
    const contextValue = useContext(messageModalContext);
    const { messageSomeone, setMessageSomeone, modalOpen, setModalOpen } = contextValue;
    const database = getDatabase();
    const auth = getAuth();

    const handleGoBack = (e) => {
        e.preventDefault();
        setMessageSomeone(false);
        setModalOpen(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Generate a random key
        const key = crypto.randomBytes(32); // 256 bits (32 bytes) key

        // Generate a random initialization vector (IV)
        const iv = crypto.randomBytes(16); // 128 bits (16 bytes) IV for AES

        // Create a Cipher object with AES algorithm in CBC mode
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // Encrypt the message
        let encrypted = cipher.update(message, 'utf-8', 'hex');
        encrypted += cipher.final('hex');            
        
        // Store user in realtime database first to check if username already exists, if it does then throw an error
        await set(ref(database, 'sent-messages/' + auth.currentUser.uid), { // Use ref and set from the database object
            sender: auth.currentUser,
            recipient: recipient,
            encryptedMessage: encrypted,
            timestamp: database.ServerValue.TIMESTAMP,
        });
    }

    return (
        <>
        {messageSomeone ? (
        <div className="message-someone-container">
          <div className="message-outbox-container">
            <div className="icons-container">
                <ArrowBackTwoTone fontSize="large" className="message-container-back-icon" onClick={(e) => handleGoBack(e)} />
                <CloseTwoTone fontSize="large" className="message-container-close-icon" onClick={() => setMessageSomeone(false)}/>
            </div>
            <hr className="horizontal-line"/>
            <form action="send_message.php" method="post" className="message-template-container" onSubmit={(e) => handleSubmit(e)}>
                <div className="to-someone-container">
                    <label for="to">To:</label>
                    <input type="text" id="to" name="to" value="@username" required/>
                </div>

                <div className="from-myself-container">
                    <label for="from">From:</label>
                    <input type="text" id="from" name="from" value="@currentUser" required/>
                </div>

                <div className="message-body-container">
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" placeholder="Type your message here for @username..." required></textarea>
                </div>

                <input type="submit" value="Send Message"/>
            </form>
          </div>
        </div> ) : ""}
        </>
    )
}

export default MessageModal;