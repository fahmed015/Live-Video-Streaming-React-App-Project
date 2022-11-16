import Card from "react-bootstrap/Card";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import Col from "react-bootstrap/Col";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
function Member(props) {
  const { info } = props;
  const vidref = useRef(null);

  const mainstream = useSelector((state) => state.mainStream);

  const remoteStream = new MediaStream();

  useEffect(() => {
    if (info.currentUser && mainstream) {
      vidref.current.srcObject = mainstream;
      vidref.current.muted = true;
    }
  }, [info.currentUser, mainstream]);

  useEffect(() => {
    if (info.peerConnection) {
      info.peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });

        vidref.current.srcObject = remoteStream;
      };
    }
  }, [info.peerConnection]);

  return (
    <Col>
      <Card className="card1">
        <video className="video" ref={vidref} autoPlay></video>

        <div className="name">
          {info.userName} {info.currentUser ? "(You)" : ""}
        </div>

        <div className="mute">
          {info.defaultPreference.audio ? (
            ""
          ) : (
            <FontAwesomeIcon
              icon={faMicrophoneSlash}
              style={{ color: "#b90e0a" }}
            />
          )}
        </div>
        <div className="avatarpos">
          {!info.defaultPreference.video ? (
            <div style={{ background: info.avatarColor }} className="avatar">
              {info.userName[0]}
            </div>
          ) : (
            ""
          )}
        </div>
      </Card>
    </Col>
  );
}

export default Member;
