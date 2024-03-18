import { useContext } from "react"
import { modalContext } from "./Home"

import "./styles/UserModal.css"

import {
  ThumbDownTwoTone,
  ThumbUpTwoTone,
  PlaceTwoTone,
  CloseTwoTone,
  MessageTwoTone
} from "@mui/icons-material";
import {
  IconButton,
  Tooltip,
  Fade,
} from "@mui/material";

import universe from "./universe.jpg"

const UserModal = () => {
    const contextValue = useContext(modalContext);
    const { modalOpen, setModalOpen, clickedUser, realtimeUser } = contextValue;

    console.log(clickedUser);

    return (
        <>
        {modalOpen ? (
        <div className="modal-container">
          <div className="modal-box-container">
            <CloseTwoTone fontSize="large" className="modal-container-close-icon" onClick={() => setModalOpen(false)}/>
            <img src={clickedUser.photoURL}/>
            <div className="profile-information-container">
              <h3>{clickedUser.firstname}</h3>
              <h3>{clickedUser.programOfChoice}</h3>
              <h3>{clickedUser.soberDate}</h3>
              <PlaceTwoTone className="place-icon"/> <h4 className="country">{clickedUser.country}</h4>
              <hr className="horizontal-line"/>
              <article>
                <p className="bio-information">
                  {clickedUser.bio}
                </p>
              </article>
              <hr className="horizontal-line" />
              <div className="swipe-icons">
                <Tooltip
                title="Hit dislike to temporarily remove this person from your swiper list"
                placement="top"
                TransitionComponent={Fade}
                >
                  <IconButton disabled={!realtimeUser}>
                    <ThumbDownTwoTone fontSize="large" color={realtimeUser ? "primary" : "disabled"}/>
                  </IconButton>
                </Tooltip>
                <Tooltip
                title="Send a message request to this person"
                placement="top"
                TransitionComponent={Fade}
                >
                  <IconButton disabled={!realtimeUser}>
                    <MessageTwoTone fontSize="large" color={realtimeUser ? "primary" : "disabled"}/>
                  </IconButton>
                </Tooltip>
                <Tooltip
                title="Hit like to potentially match with this person!"
                placement="top"
                TransitionComponent={Fade}
                >
                  <IconButton disabled={!realtimeUser}>
                    <ThumbUpTwoTone fontSize="large" color={realtimeUser ? "primary" : "disabled"}/>
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </div> ) : ""}
        </>
    )
}

export default UserModal;