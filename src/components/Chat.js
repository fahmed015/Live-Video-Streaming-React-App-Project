import Card from "react-bootstrap/Card";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { addchat } from "../Store/actions";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Message from "./Message";
import "../App.css";
import dbref, {
  child,
  push,
  onChildAdded,
  query,
  startAfter,
  orderByChild,
} from "../FirebaseServer/firebase";

function Chat(props) {
  const messagesRef = child(dbref, "chat");
  const user = useSelector((state) => state.currentUser);
  const time = useSelector((state) => state.time);
  const bottomRef = useRef(null);
  var name = "";
  var userkey = null;

  if (user) {
    userkey = Object.keys(user)[0];
    name = user[userkey].userName;
  }

  const Messages = useSelector((state) => state.chat);
  const Messageskey = Object.keys(Messages);
  const [NewMessage, setNewMessage] = useState({
    text: "",
  });

  const handleOnChange = (e) => {
    setNewMessage({ ...NewMessage, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (/^ *$/.test(NewMessage.text)) {
    } else {
      push(messagesRef, {
        text: NewMessage.text,
        username: name,
        userid: userkey,
        timestamp: Date.now(),
      });
    }

    setNewMessage({
      text: "",
    });
  };

  useEffect(() => {
    if (user && time) {
      const messtime = query(
        messagesRef,
        orderByChild("timestamp"),
        startAfter(time)
      );

      onChildAdded(messtime, (data) => {
        props.addchat({
          [data.key]: {
            text: data.val().text,
            username: data.val().username,
            userid: data.val().userid,
            timestamp: data.val().timestamp,
          },
        });
      });
    }
  }, [user, time]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Messages]);

  return (
    <Container fluid className="chatscreen">
      <Container fluid className="chatbar">
        <Card className="cardchat">
          <div className="title2"> 💬 Chat </div>
          <div className="subtitle2">Welcome to the room {name} !</div>

          {Messageskey.map((id) => {
            const infomember = Messages[id];

            return <Message key={id} info={infomember}></Message>;
          })}
        </Card>
        <div ref={bottomRef} />
      </Container>

      <Container fluid className="sendmessage">
        <Row>
          <Form onSubmit={handleOnSubmit} className="sendmess">
            <InputGroup>
              <Form.Control
                value={NewMessage.text}
                type="text"
                name="text"
                placeholder="Type your message here..."
                onChange={handleOnChange}
              />
            </InputGroup>
          </Form>
        </Row>
      </Container>
    </Container>
  );
}
const mapStateToProps = (state) => {
  return {
    chat: state.chat,
    currentUser: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addchat: (user) => dispatch(addchat(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
//export default Controls
