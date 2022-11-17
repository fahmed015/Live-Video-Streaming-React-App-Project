import "../App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/esm/Row";
function PageNotFound() {
  return (
    <div className="App">
      <Container className="homescreen">
        <Row style={{ alignContent: "center", justifyContent: "center" }}>
          <h1 className="title">404 Page not found</h1>
        </Row>
      </Container>
    </div>
  );
}

export default PageNotFound;
