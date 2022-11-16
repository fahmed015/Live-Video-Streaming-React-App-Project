import {
  ADD_MEMBER,
  ADD_CHAT,
  SET_USER,
  SET_TIME,
  SET_NAME,
  REMOVE_MEMBER,
  RESET,
  UPDATE_USER,
  UPDATE_MEMBER,
  SET_MAIN_STREAM,
} from "./actiontypes";

export const setMainStream = (stream) => {
  return {
    type: SET_MAIN_STREAM,
    payload: {
      mainStream: stream,
    },
  };
};
export const setName = (name) => {
  return {
    type: SET_NAME,
    payload: {
      nameset: name,
    },
  };
};
export const setTime = (time) => {
  return {
    type: SET_TIME,
    payload: {
      timeenter: time,
    },
  };
};

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: {
      currentUser: user,
    },
  };
};

export const addmember = (user) => {
  return {
    type: ADD_MEMBER,
    payload: {
      newUser: user,
    },
  };
};
export const addchat = (chat) => {
  return {
    type: ADD_CHAT,
    payload: {
      messnew: chat,
    },
  };
};
export const reset = () => {
  return {
    type: RESET,
  };
};

export const updateUser = (user) => {
  return {
    type: UPDATE_USER,
    payload: {
      currentUser: user,
    },
  };
};

export const updatemember = (user) => {
  return {
    type: UPDATE_MEMBER,
    payload: {
      newUser: user,
    },
  };
};
export const removemember = (userId) => {
  return {
    type: REMOVE_MEMBER,
    payload: {
      id: userId,
    },
  };
};
