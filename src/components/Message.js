import Card from "react-bootstrap/Card";
import React from "react";
import { useSelector } from "react-redux";
import Row from "react-bootstrap/esm/Row";

function Message(props) {
  const { info } = props;
  const user = useSelector((state) => state.currentUser);
  const userkey = Object.keys(user)[0];

  return (
    <Row className="rowmessage">
      <Card
        className="card2"
        style={
          info.userid === userkey
            ? { marginLeft: "auto", background: "#845695" }
            : { marginRight: "auto" }
        }
      >
        <Card.Body>
          {info.userid === userkey ? (
            ""
          ) : (
            <Card.Title>{info.username} </Card.Title>
          )}

          <Card.Text>{info.text}</Card.Text>
        </Card.Body>
      </Card>
    </Row>
  );
}

export default Message;
