import { initializeApp } from "firebase/app";

import {
  getDatabase,
  ref,
  get,
  onChildAdded,
  push,
  startAfter,
  endAt,
  orderByKey,
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

export {
  onValue,
  child,
  get,
  ref,
  onChildAdded,
  orderByKey,
  push,
  endAt,
  startAfter,
  connectref,
  onDisconnect,
  onChildRemoved,
  onChildChanged,
  query,
  orderByChild,
};
export default dbref;
