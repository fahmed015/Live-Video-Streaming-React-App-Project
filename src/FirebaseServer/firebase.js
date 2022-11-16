import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  serverTimestamp,
  get,
  set,
  onChildAdded,
  push,
  startAfter,
  endAt,
  orderByKey,
  orderByValue,
  orderByChild,
  child,
  onValue,
  onDisconnect,
  onChildRemoved,
  update,
  onChildChanged,
  query,
  remove,
} from "firebase/database";
import { store } from "..";

const firebaseConfig = {
  apikey: "AIzaSyCxnTzMYHpTGiwPfnsDSQ7vAa7YiyXIWOw",
  databaseURL: "https://video-streaming-791fd-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

var dbref = ref(database);

const connectref = ref(database, ".info/connected");
const membersref = child(dbref, "members");

let currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);

const date = new Date(currentDate);
const timestamp = date.getTime();

const messagesRef = child(dbref, "chat");
const chatdatabase = query(
  messagesRef,
  orderByChild("timestamp"),
  endAt(timestamp)
);

onChildAdded(chatdatabase, (data) => {
  const mesref = child(messagesRef, data.key);
  remove(mesref);
});

onValue(connectref, (snap) => {
  if (snap.val() === true) {
    console.log("connected");
  } else {
    console.log("not connected");
  }
});

export const removeuser = (userid) => {
  const userref = child(membersref, userid);
  remove(userref);
};

export const updatepref = (userid, updates) => {
  const userref = child(membersref, userid);
  const prefref = child(userref, "defaultPreference");

  update(prefref, updates);
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

const createAnswer = async (otherUserId, userId) => {
  const pc = store.getState().members[otherUserId].peerConnection;

  const recieverref = child(membersref, otherUserId);

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

export {
  onValue,
  child,
  set,
  get,
  serverTimestamp,
  ref,
  onChildAdded,
  orderByKey,
  push,
  endAt,
  startAfter,
  orderByValue,
  connectref,
  onDisconnect,
  onChildRemoved,
  onChildChanged,
  query,
  orderByChild,
};
export default dbref;
