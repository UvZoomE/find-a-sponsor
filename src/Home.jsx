import "./styles/Home.css";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";
import UserModal from "./UserModal";
import MessageModal from "./MessageModal"
import BuildProfile from "./BuildProfile"

import {
  MailLockTwoTone,
  PersonSearchTwoTone,
  StyleTwoTone,
  ThumbDownTwoTone,
  ThumbUpTwoTone,
  LogoDevTwoTone,
  AlternateEmailTwoTone,
  MessageTwoTone,
} from "@mui/icons-material";

import {
  IconButton,
  Tooltip,
  Fade,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import {createContext, useEffect, useRef, useState } from "react";
import hacker from "./hacker.jpg";
import universe from "./universe.jpg"

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, EffectCards, Navigation, Pagination, Scrollbar } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-cards"
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { getAuth, signOut } from "firebase/auth";
import { child, get, getDatabase, orderByKey, ref } from "firebase/database";

const signInContext = createContext();
export {signInContext};

const createAccountContext = createContext();
export {createAccountContext};

const modalContext = createContext();
export {modalContext};

const messageModalContext = createContext();
export {messageModalContext};

const userContext = createContext();
export {userContext};

const avatarEditorContext = createContext();
export {avatarEditorContext};

const Home = () => {
  const [alignment, setAlignment] = useState("sponsor");
  const [signIn, setSignIn] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [messageSomeone, setMessageSomeone] = useState(false);
  const [user, setUser] = useState("");
  const [realtimeUser, setRealtimeUser] = useState("");
  const [avatarEditor, setAvatarEditor] = useState(false);
  const [image, setImage] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const auth = getAuth();
  const database = getDatabase();
  const [users, setUsers] = useState([]);
  const [clickedUser, setClickedUser] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch all users from Firebase Realtime Database
    const fetchUsers = async() => {
      const usersRef = ref(database);
      const usersList = [];
      get(child(usersRef, "users/"))
      .then((snapshot) => {
        snapshot.forEach(snap => {
          usersList.push(snap.val());
        });
        setUsers(usersList);
      }).catch((err) => {
        console.log(err);
      })
    };
    fetchUsers();
  }, []);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setSignIn(!signIn);
  };

  const handleMessageModal = (e) => {
    e.preventDefault();
    setMessageSomeone(true);
  }

  const handleMenuItem = (e) => {
    e.preventDefault();
    setMenuVisible(!menuVisible);
  }

  const handleLogout = (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
      setRealtimeUser("");
      alert("You have successfully logged out of your account, see you soon!");
    })
    .catch((error) => {
      console.log("Error signing out: " + error);
    })
  }

  const handleSwiperClick = (e) => {
    setClickedUser(users[currentIndex]);
    setModalOpen(true);
  }

  return (
        <div className="home-container">
          <div className="left-child-container">
            <div className="profile-header">
              {realtimeUser ? 
                <>
                <div className="profile-image-container">
                  <img className="profile-image" src={realtimeUser.photoURL100} alt="Profile" onClick={handleMenuItem} />
                </div>
                {menuVisible && 
                  <div className="logout-container">
                    <a href="#" onClick={handleLogout}>Log out</a>
                  </div>
                }
                <h3>@{realtimeUser.username}</h3>
              </> : 
              <a
                className="sign-in-link"
                href="/sign-in"
                onClick={handleSignIn}
              >
                Sign In
              </a>}
            </div>
            <div className="banner-container">
              <StyleTwoTone sx={{ fontSize: "64px" }} className="style-icon" />
              <div className="banner-text">
                <h3 className="unlock-text">Unlock the 12-steps</h3>
                {realtimeUser ? 
                <h5>Start liking to find a sponsor/sponsee!</h5> :
                <h5 className="unlock-subtext">
                  Sign in to find a sponsor or sponsee!
                </h5>}
              </div>
            </div>
            <div className="messages-text-container">
              <h6 className="messages-text">Messages</h6>
            </div>
            <div className="message-container">
              <MailLockTwoTone />
              <h5 className="sign-in-warning-message">You must sign in to view messages</h5>
              <h5 className="sign-in-warning-message-mobile">Sign in to see messages</h5>
            </div>
          </div>
          <div className="right-child-container">
          {realtimeUser ? 
            <div className="profile-header-mobile">
            <div className="profile-image-container-mobile">
              <img className="profile-image-mobile" src={realtimeUser.photoURL100} alt="Profile" onClick={handleMenuItem}/>
            </div>
            {menuVisible && 
                  <div className="logout-container-mobile">
                    <a href="#" onClick={handleLogout}>Log out</a>
                  </div>
            }
            <h3>@{realtimeUser.username}</h3>
            </div>: <a
                className="sign-in-link-mobile"
                href="/sign-in"
                onClick={handleSignIn}
              >
                Sign In
              </a>}
            <div className="logo">
              <LogoDevTwoTone className="logo-itself"></LogoDevTwoTone>
            </div>
            <div className="toggle-buttons">
              <ToggleButtonGroup
                value={alignment}
                color="primary"
                exclusive
                aria-label="group"
                onChange={handleChange}
                className="sponsor-sponsee-buttons"
              >
                <ToggleButton value="sponsor">Sponsors</ToggleButton>
                <ToggleButton value="sponsee">Sponsees</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <Swiper
            effect={'cards'}
            modules={[EffectCards, Navigation, Pagination, Scrollbar, A11y]}
            navigation={true}
            pagination={true}
            grabCursor={true}
            className="my-swiper"
            onClick={handleSwiperClick}
            onSlideChange={(swiper) => {
              setCurrentIndex(swiper.activeIndex);
            }}
            >
              {users.map((user, index) => (
                <SwiperSlide key={index} className="swiper-slide">
                  <img src={user.photoURL}/>
                  <h3>{user.username}</h3>
                </SwiperSlide>
              ))}
      </Swiper>
      <input type="button" value="View Profile" onClick={() => handleSwiperClick(currentIndex)} className="view-profile-button"/>
            <div className="swipe-icons">
              <Tooltip
                title="Hit dislike to temporarily take this person off your swipe list"
                placement="top"
                TransitionComponent={Fade}
              >
                <IconButton disabled={!realtimeUser}>
                  <ThumbDownTwoTone fontSize="large" color={realtimeUser ? "primary" : "disabled"}/>
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Request to message this person"
                placement="top"
                TransitionComponent={Fade}
              >
                <IconButton disabled={!realtimeUser} onClick={(e) => handleMessageModal(e)}>
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
        { signIn ?
        <signInContext.Provider value={{setUser, setSignIn, signIn, setCreateAccount, setRealtimeUser, setMenuVisible}}>
          <SignIn/>
        </signInContext.Provider> : createAccount ?
        <createAccountContext.Provider value={{setCreateAccount, createAccount, setSignIn}}>
          <CreateAccount />
        </createAccountContext.Provider> : modalOpen ? 
        <modalContext.Provider value={{modalOpen, setModalOpen, clickedUser, realtimeUser}}>
          <UserModal />
        </modalContext.Provider> : messageSomeone ?
        <messageModalContext.Provider value={{messageSomeone, setMessageSomeone, modalOpen, setModalOpen}}>
          <MessageModal />
        </messageModalContext.Provider> : user ?
        <userContext.Provider value={{user, setUser, setSignIn, image, setImage, setAvatarEditor, avatarEditor, setMenuVisible}}>
          <BuildProfile />
        </userContext.Provider> : ""}
        </div>
  );
};

export default Home;
