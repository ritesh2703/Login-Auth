import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container, Modal } from "react-bootstrap";
import { auth } from "../firebase/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import DefaultProfile from "../img/default-profile.png"; // Default profile image

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [show, setShow] = useState(false); // State to control profile image popup

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  return (
    <>
      {/* Responsive Full-Width Navbar */}
      <Navbar bg="warning" variant="dark" className="py-2 rounded shadow" style={{height :"50px" }}>
        <Container>
          <Navbar.Brand href="/" className="fs-5">Dashboard</Navbar.Brand>
          <Nav className="ms-auto d-flex align-items-center">
            <span className="text-white me-2">{user.displayName || user.email}</span>
            
            {/* Clickable Profile Image */}
            <img
              src={user.photoURL || DefaultProfile}
              alt="Profile"
              className="rounded-circle"
              width="35"
              height="35"
              style={{ cursor: "pointer" }}
              onClick={() => setShow(true)}
            />

            {/* Logout Button */}
            <Button variant="danger" className="ms-3 btn-sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Welcome Message Below Navbar */}
      <Container className="text-center mt-5">
        <h2>Welcome, {user?.displayName || user?.email || "User"}!</h2>
        <p className="lead">Glad to have you here. Explore and enjoy the features!</p>
      </Container>

      {/* Modal for Enlarged Profile Image */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Body className="text-center">
          <img
            src={user.photoURL || DefaultProfile}
            alt="Profile"
            className="img-fluid rounded-circle"
            style={{ width: "150px", height: "150px" }}
          />
          <h5 className="mt-3">{user.displayName || user.email}</h5>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Dashboard;
