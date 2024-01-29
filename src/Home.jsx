import "./styles/Home.css";
import SignIn from "./SignIn";

import {
  MailLockTwoTone,
  PersonSearchTwoTone,
  StyleTwoTone,
  ThumbDownTwoTone,
  ThumbUpTwoTone,
  HandshakeTwoTone,
  LogoDevTwoTone,
  UndoTwoTone,
  EmailTwoTone,
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
  CardActions,
} from "@mui/material";

import {useLayoutEffect, useRef, useState } from "react";
import hacker from "./hacker.jpg";
import { Button } from "@mui/base";

const Home = () => {
  const [alignment, setAlignment] = useState("sponsor");
  const [widthOfImage, setWidthOfImage] = useState(0);
  const [minWidthOfImage, setMinWidthOfImage] = useState(0);
  const [signIn, setSignIn] = useState(false);
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
    <>
      {signIn ? (
        <SignIn />
      ) : (
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
              <PersonSearchTwoTone fontSize="large" className="search-icon" />
            </div>
            <div className="banner-container">
              <StyleTwoTone sx={{ fontSize: "64px" }} className="style-icon" />
              <div className="banner-text">
                <h3 className="unlock-text">Unlock the 12-steps</h3>
                <h5 className="unlock-subtext">
                  Start swiping to find a sponsor or sponsee!
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
            <div className="logo">
            <a
                className="sign-in-link-mobile"
                href="/sign-in"
                onClick={handleSignIn}
              >
                Sign In
              </a>
              <LogoDevTwoTone></LogoDevTwoTone>
              <PersonSearchTwoTone fontSize="large" className="search-icon-mobile" />
            </div>
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
                <Card>
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
                  <ThumbDownTwoTone fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="You must sign in to undo previous swipes"
                placement="top"
                TransitionComponent={Fade}
              >
                <IconButton>
                  <UndoTwoTone fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="You must sign in to choose this sponsor"
                placement="top"
                TransitionComponent={Fade}
              >
                <IconButton>
                  <ThumbUpTwoTone fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
