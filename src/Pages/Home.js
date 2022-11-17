import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/esm/Row";
import { connect } from "react-redux";
import { setName } from "../Store/actions";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
function Home(props) {
  const navigate = useNavigate();

  function removeSpace(str) {
    str = str.replace(/^\s+|\s+$/gm, "");
    return str;
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (/^ *$/.test(Name)) {
      setErorr("Please enter your name");
      setName("");
    } else {
      const check = removeSpace(Name);

      props.setName(check);
      navigate("/Meet");
    }
  };

  const [Name, setName] = useState("");
  const [Error, setErorr] = useState(null);

  const handleChange = (event) => {
    setErorr(null);
    setName(event.target.value);
  };

  return (
    <div className="App">
      <Container className="homescreen">
        <Row style={{ alignContent: "center", justifyContent: "center" }}>
          <Form onSubmit={handleOnSubmit} className="formname">
            <div className="title">Welcome</div>
            <div className="subtitle">
              Please enter your name to join the the room
            </div>
            <Form.Group className="placeholdertext">
              <Form.Control
                isInvalid={!!Error}
                type="text"
                placeholder="Name"
                onChange={handleChange}
                value={Name}
              />

              <Form.Control.Feedback type="invalid">
                {Error}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid ">
              <Button
                variant="secondary"
                type="submit"
                size="lg"
                style={{ background: "#845695", fontWeight: "bold" }}
              >
                Go to room ➔
              </Button>
            </div>
          </Form>
        </Row>
      </Container>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setName: (name) => dispatch(setName(name)),
  };
};

export default connect(null, mapDispatchToProps)(Home);
