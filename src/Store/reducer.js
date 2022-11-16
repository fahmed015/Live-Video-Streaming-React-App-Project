import {
  ADD_MEMBER,
  SET_USER,
  REMOVE_MEMBER,
  UPDATE_USER,
  UPDATE_MEMBER,
  SET_MAIN_STREAM,
  ADD_CHAT,
  SET_NAME,
  SET_TIME,
} from "./actiontypes";

import { createOffer, Listensers } from "../FirebaseServer/firebase";

function generateLightColorHex() {
  let color = "#";
  for (let i = 0; i < 3; i++)
    color += (
      "0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)
    ).slice(-2);
  return color;
}

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
        "stun:stun.services.mozilla.com",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

let intialstate = {
  name: null,
  time: null,
  members: {},
  currentUser: null,
  mainStream: null,
  chat: {},
};

export const userReducer = (state = intialstate, action) => {
  switch (action.type) {
    case SET_NAME: {
      state.name = action.payload.nameset;

      return state;
    }
    case SET_TIME: {
      state.time = action.payload.timeenter;
      console.log(state);
      return state;
    }

    case SET_MAIN_STREAM: {
      state = { ...state, ...action.payload };

      return state;
    }

    case SET_USER: {
      state = { ...state, currentUser: { ...action.payload.currentUser } };
      const userid = Object.keys(state.currentUser)[0];
      Listensers(userid);

      return state;
    }

    case UPDATE_USER: {
      state = { ...state, currentUser: { ...action.payload.currentUser } };

      return state;
    }

    case UPDATE_MEMBER: {
      const memberid = Object.keys(action.payload.newUser)[0];

      const test = state.members[memberid];
      if (test.currentUser) {
        action.payload.newUser[memberid].currentUser = true;
      }
      action.payload.newUser[memberid].avatarColor = test.avatarColor;
      if (test.peerConnection) {
        action.payload.newUser[memberid].peerConnection = test.peerConnection;
      }

      let members = { ...state.members, ...action.payload.newUser };

      state = { ...state, members };

      return state;
    }

    case ADD_MEMBER: {
      const userid = Object.keys(state.currentUser)[0];
      const memberid = Object.keys(action.payload.newUser)[0];

      action.payload.newUser[memberid].avatarColor = generateLightColorHex();
      if (userid === memberid) {
        action.payload.newUser[memberid].currentUser = true;
      } else {
        if (state.mainStream) {
          action.payload.newUser = addConnection(
            state.currentUser,
            action.payload.newUser,
            state.mainStream
          );
        }
      }

      let members = { ...state.members, ...action.payload.newUser };
      state = { ...state, members };

      return state;
    }

    case ADD_CHAT: {
      let chat = { ...state.chat, ...action.payload.messnew };
      state = { ...state, chat };

      return state;
    }

    case REMOVE_MEMBER: {
      delete state.members[action.payload.id];

      state = { ...state, members: { ...state.members } };

      return state;
    }

    default: {
      return state;
    }
  }
};

export const addConnection = (currentuser, newuser, mediastream) => {
  const peerconnection = new RTCPeerConnection(servers);

  mediastream.getTracks().forEach((track) => {
    peerconnection.addTrack(track, mediastream);
  });

  const userid = Object.keys(currentuser)[0];
  const memberid = Object.keys(newuser)[0];

  const offerIds = [memberid, userid].sort((a, b) => a.localeCompare(b));

  newuser[memberid].peerConnection = peerconnection;

  if (offerIds[0] !== userid)
    createOffer(peerconnection, offerIds[0], offerIds[1]);
  return newuser;
};
