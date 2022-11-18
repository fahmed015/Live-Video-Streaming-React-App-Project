import { store } from "..";
import dbref, { onChildAdded, push, child } from "./firebase";

const membersref = child(dbref, "members");

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun.stunprotocol.org",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
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

export const createOffer = async (peerConnection, receiverId, createdID) => {
  const recieverref = child(membersref, receiverId);

  peerConnection.onicecandidate = (event) => {
    event.candidate &&
      push(child(recieverref, "offerCandidates"), {
        ...event.candidate.toJSON(),
        userId: createdID,
      });
  };

  const offer = await peerConnection.createOffer();

  await peerConnection.setLocalDescription(offer);

  const offerpayload = {
    sdp: offer.sdp,
    type: offer.type,
    userId: createdID,
  };

  const offerref = child(recieverref, "offers");
  push(offerref, { offerpayload });
};

const createAnswer = async (offerUserId, userId) => {
  const pc = store.getState().members[offerUserId].peerConnection;

  const recieverref = child(membersref, offerUserId);

  pc.onicecandidate = (event) => {
    event.candidate &&
      push(child(recieverref, "answerCandidates"), {
        ...event.candidate.toJSON(),
        userId: userId,
      });
  };

  const Answer = await pc.createAnswer();

  await pc.setLocalDescription(Answer);

  const answerpayload = {
    sdp: Answer.sdp,
    type: Answer.type,
    userId: userId,
  };

  const answerref = child(recieverref, "answer");
  push(answerref, { answerpayload });
};

export const Listensers = async (userId) => {
  const userref = child(membersref, userId);
  const offerref = child(userref, "offers");
  const offercand = child(userref, "offerCandidates");
  const answerref = child(userref, "answer");
  const answercand = child(userref, "answerCandidates");

  onChildAdded(offerref, async (data) => {
    const dataex = data.val().offerpayload;

    if (dataex) {
      const offersentid = data.val().offerpayload.userId;
      const x = store.getState().members[offersentid].peerConnection;
      await x.setRemoteDescription(
        new RTCSessionDescription(data.val().offerpayload)
      );

      await createAnswer(offersentid, userId);
    }
  });

  onChildAdded(offercand, (data) => {
    const dataex = data.val().userId;

    if (dataex) {
      const offersentid = data.val().userId;
      const x = store.getState().members[offersentid].peerConnection;

      x.addIceCandidate(new RTCIceCandidate(data.val()));
    }
  });

  onChildAdded(answerref, (data) => {
    const dataex = data.val().answerpayload;
    if (dataex) {
      const answerid = data.val().answerpayload.userId;
      const x = store.getState().members[answerid].peerConnection;
      const answerDescription = new RTCSessionDescription(
        data.val().answerpayload
      );
      x.setRemoteDescription(answerDescription);
    }
  });

  onChildAdded(answercand, (data) => {
    const dataex = data.val().userId;
    if (dataex) {
      const offersentid = data.val().userId;
      const x = store.getState().members[offersentid].peerConnection;
      x.addIceCandidate(new RTCIceCandidate(data.val()));
    }
  });
};
