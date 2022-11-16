import Button from "react-bootstrap/Button";

import React, { useState } from "react";

import { connect } from "react-redux";
import { updatemember, updateUser, setMainStream } from "../Store/actions";
import Container from "react-bootstrap/Container";
import { updatepref, removeuser } from "../FirebaseServer/firebase";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/esm/Row";

function Controls(props) {
  const [controlState, setControlState] = useState({
    audio: true,
    video: false,
    screen: false,
  });

  const navigate = useNavigate();

  function End() {
    const userid = Object.keys(props.currentUser)[0];
    removeuser(userid);

    props.stream.getTracks().forEach((track) => track.stop());

    navigate("/");
  }

  function Mute() {
    if (props.stream) {
      const userid = Object.keys(props.currentUser)[0];
      const audionew = props.currentUser[userid].defaultPreference.audio;

      const userName = props.currentUser[userid].userName;
      const defaultPreference = {
        audio: !audionew,
        screen: props.currentUser[userid].defaultPreference.screen,
        video: props.currentUser[userid].defaultPreference.video,
      };

      props.stream.getAudioTracks()[0].enabled = !audionew;

      const payload = {
        [userid]: {
          userName,
          defaultPreference,
        },
      };

      updatepref(userid, {
        audio: !audionew,
      });
      props.updateUser(payload);
      // props.updatemember(payload);

      setControlState((previousState) => {
        return { ...previousState, audio: !audionew };
      });
    }
  }

  function Camera() {
    if (props.stream) {
      const userid = Object.keys(props.currentUser)[0];
      const vidnew = props.currentUser[userid].defaultPreference.video;

      const userName = props.currentUser[userid].userName;

      const defaultPreference = {
        audio: props.currentUser[userid].defaultPreference.audio,
        screen: props.currentUser[userid].defaultPreference.screen,
        video: !vidnew,
      };

      props.stream.getVideoTracks()[0].enabled = !vidnew;

      const payload = {
        [userid]: {
          userName,
          defaultPreference,
        },
      };

      updatepref(userid, { video: !vidnew });
      props.updateUser(payload);
      //  props.updatemember(payload);
      setControlState((previousState) => {
        return { ...previousState, video: !vidnew };
      });
    }
  }

  return (
    // variant={!controlState.audio ? "danger" :"secondary"}
    <Container fluid className="controlscreen">
      <Row>
        <div className="btncontrol">
          <Button
            onClick={Mute}
            variant="secondary"
            className="button"
            style={{ background: "#845695" }}
          >
            <FontAwesomeIcon
              icon={!controlState.audio ? faMicrophoneSlash : faMicrophone}
            />
          </Button>

          <Button
            onClick={Camera}
            variant="secondary"
            className="button"
            style={{ background: "#845695" }}
          >
            <FontAwesomeIcon
              icon={!controlState.video ? faVideoSlash : faVideo}
            />
          </Button>

          <Button onClick={End} variant="danger" className="button">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </Button>
        </div>
      </Row>
    </Container>
  );
}
const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    currentUser: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    updateUser: (user) => dispatch(updateUser(user)),
    updatemember: (user) => dispatch(updatemember(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
//export default Controls
