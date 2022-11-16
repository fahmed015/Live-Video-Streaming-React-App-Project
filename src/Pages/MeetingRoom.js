import dbref, {
  connectref,
  onChildAdded,
  onValue,
  removeuser,
  push,
  child,
  onDisconnect,
  onChildRemoved,
  onChildChanged,
} from "../FirebaseServer/firebase";
import { useEffect } from "react";
import { connect } from "react-redux";

import {
  setUser,
  addmember,
  removemember,
  updatemember,
  setMainStream,
  setTime,
  reset,
} from "../Store/actions";
import "../App.css";
import Members from "../components/Members";
import Controls from "../components/Controls";
import Chat from "../components/Chat";

function MeetingRoom(props) {
  const membersref = child(dbref, "members");

  const userName = props.Name;

  window.onpopstate = (event) => {
    if (event) {
      const userid = Object.keys(props.User)[0];
      removeuser(userid);
      props.reset();
      props.Mainstream.getTracks().forEach((track) => track.stop());
    }
  };

  // window.onbeforeunload = (event) => {
  //   const e = event || window.event;
  //   e.preventDefault();
  //   // if (e) {
  //   //   e.returnValue = ''; // Legacy method for cross browser support
  //   // }
  //   // return ''; // Legacy method for cross browser support
  // };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((mediastream) => {
        mediastream.getVideoTracks()[0].enabled = false;

        props.setMainStream(mediastream);
      });

    onValue(connectref, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const defaultPreference = {
          audio: true,
          screen: false,
          video: false,
        };
        const userref = push(membersref, { userName, defaultPreference });

        props.setUser({
          [userref.key]: {
            userName,
            defaultPreference,
          },
        });

        props.setTime(Date.now());

        onDisconnect(userref)
          .remove()
          .catch((err) => {
            if (err) {
              console.error("could not establish onDisconnect event", err);
            }
          });
      }
    });
  }, []);

  const isUserSet = !!props.User;
  const isStreamSet = !!props.Mainstream;

  useEffect(() => {
    if (isUserSet && isStreamSet) {
      onChildAdded(membersref, (data) => {
        const defaultPreference = data.val().defaultPreference;
        const userName = data.val().userName;

        props.addMember({
          [data.key]: {
            userName,
            defaultPreference,
          },
        });
      });

      onChildChanged(membersref, (data) => {
        const userName = data.val().userName;
        const defaultPreference = data.val().defaultPreference;

        const payload = {
          [data.key]: {
            userName,
            defaultPreference,
          },
        };

        props.updatemember(payload);
      });

      onChildRemoved(membersref, (data) => {
        props.removeMember(data.key);
      });
    }
  }, [isUserSet, isStreamSet]);

  return (
    <div>
      <Members></Members>
      <Controls></Controls>

      <Chat></Chat>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    User: state.currentUser,
    Name: state.name,
    Members: state.members,
    Mainstream: state.mainStream,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    addMember: (user) => dispatch(addmember(user)),
    setUser: (user) => dispatch(setUser(user)),
    setTime: (time) => dispatch(setTime(time)),
    reset: () => dispatch(reset()),
    removeMember: (userId) => dispatch(removemember(userId)),
    updatemember: (user) => dispatch(updatemember(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingRoom);

//export default App;
