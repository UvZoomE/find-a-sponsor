import "./styles/Home.css";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";

import {
  MailLockTwoTone,
  PersonSearchTwoTone,
  StyleTwoTone,
  ThumbDownTwoTone,
  ThumbUpTwoTone,
  LogoDevTwoTone,
  UndoTwoTone,
  AlternateEmailTwoTone,
} from "@mui/icons-material";

import {
  IconButton,
  Tooltip,
  Fade,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

import {createContext, useLayoutEffect, useRef, useState, useEffect } from "react";
import hacker from "./hacker.jpg";

const signInContext = createContext();
export {signInContext};

const createAccountContext = createContext();
export {createAccountContext};

const Home = () => {
  const [alignment, setAlignment] = useState("sponsor");
  const [widthOfImage, setWidthOfImage] = useState(0);
  const [minWidthOfImage, setMinWidthOfImage] = useState(0);
  const [signIn, setSignIn] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [searchIconClicked, setSearchIconClicked] = useState(false);
  const containerRef = useRef(null);
  const toggleGroupRef = useRef(null);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (containerRef.current && toggleGroupRef.current) {
        const newWidth = containerRef.current.clientWidth / 3;
        setWidthOfImage(newWidth);
        const widthOfToggleGroup = toggleGroupRef.current.clientWidth;
        setMinWidthOfImage(widthOfToggleGroup);
      }
    };

    // Initial width calculation
    handleResize();

    // Attach event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [containerRef.current, toggleGroupRef.current]);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setSignIn(!signIn);
  };

  return (
        <div className="home-container">
          <div className="left-child-container">
            <div className="profile-header">
              <a
                className="sign-in-link"
                href="/sign-in"
                onClick={handleSignIn}
              >
                Sign In
              </a>
              {searchIconClicked ? <div className="search-box-container"><AlternateEmailTwoTone className="at-symbol" /><input type="text" className="search-box" placeholder="username" /></div> : 
              <PersonSearchTwoTone fontSize="large" className="search-icon" onClick={() => {
                setSearchIconClicked(true)
              }}/>}
            </div>
            <div className="banner-container">
              <StyleTwoTone sx={{ fontSize: "64px" }} className="style-icon" />
              <div className="banner-text">
                <h3 className="unlock-text">Unlock the 12-steps</h3>
                <h5 className="unlock-subtext">
                  Sign in to find a sponsor or sponsee!
                </h5>
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
          <div className="right-child-container" ref={containerRef}>
          <a
                className="sign-in-link-mobile"
                href="/sign-in"
                onClick={handleSignIn}
              >
                Sign In
              </a>
            <div className="logo">
              <LogoDevTwoTone className="logo-itself"></LogoDevTwoTone>
            </div>
            <PersonSearchTwoTone fontSize="large" className="search-icon-mobile" />
            <div className="toggle-buttons">
              <ToggleButtonGroup
                value={alignment}
                color="primary"
                exclusive
                aria-label="group"
                onChange={handleChange}
                ref={toggleGroupRef}
              >
                <ToggleButton value="sponsor">Sponsors</ToggleButton>
                <ToggleButton value="sponsee">Sponsees</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <div className="swipe-container">
                <Card className="card-itself">
                  {/* <CardActions className="view-profile-button">
                    <Button size='medium' color="primary">
                      View Profile
                    </Button>
                  </CardActions> */}
                  <CardActionArea>
                    <CardMedia component='img' width='400' height='400' image={hacker} title='hacker' className="user-picture"/>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Billy
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hi I am billy and I am sober
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
            </div>
            <div className="swipe-icons">
              <Tooltip
                title="You must sign in to not choose this sponsor"
                placement="top"
                TransitionComponent={Fade}
              >
                <IconButton>
                  <ThumbDownTwoTone fontSize="large" color="primary"/>
                </IconButton>
              </Tooltip>
              <Tooltip
                title="You must sign in to undo previous swipes"
                placement="top"
                TransitionComponent={Fade}
              >
                <IconButton>
                  <UndoTwoTone fontSize="large" color="primary"/>
                </IconButton>
              </Tooltip>
              <Tooltip
                title="You must sign in to choose this sponsor"
                placement="top"
                TransitionComponent={Fade}
              >
                <IconButton>
                  <ThumbUpTwoTone fontSize="large" color="primary"/>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        { signIn ?
        <signInContext.Provider value={{setSignIn, signIn, setCreateAccount}}>
          <SignIn/>
        </signInContext.Provider> : createAccount ?
        <createAccountContext.Provider value={{setCreateAccount, createAccount, setSignIn}}>
          <CreateAccount />
        </createAccountContext.Provider> : ""}
        </div>
  );
};

export default Home;
