import React from "react";
import { useSelector } from "react-redux";
import Member from "./Member";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "../App.css";
function Members() {
  const members = useSelector((state) => state.members);

  const memberskey = Object.keys(members);

  var sizerow = 1;

  if (memberskey.length > 1) {
    if (memberskey.length >= 2) {
      sizerow = 2;
    }
    if (memberskey.length > 4) {
      sizerow = 4;
    }
  }

  return (
    <Container fluid className="mainscreen">
      <Row md={sizerow} xs={1}>
        {memberskey.map((elem, index) => {
          const infomember = members[elem];

          return <Member key={index} info={infomember}></Member>;
        })}
      </Row>
    </Container>
  );
}

export default Members;
