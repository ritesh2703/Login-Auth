import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import "../styles/Login.css";
import { auth, googleProvider, facebookProvider, githubProvider } from "../firebase/firebase";
import Logo from "../img/logo.png";  

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("user", JSON.stringify({ email }));
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid Email or Password");
    }
  };

  // Handle Social Logins
  const handleSocialLogin = async (provider) => {
    try {
      if (window.innerWidth < 768) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Failed:", error.message);
    }
  };

  // Handle Forgot Password
  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetMessage("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setResetMessage("Error: " + error.message);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
      <Row className="shadow-lg rounded overflow-hidden w-75">
        {/* Left Side (Image) */}
        <Col md={6} className="d-none d-md-block p-0 position-relative">
          <img src={Logo} alt="Welcome" className="img-fluid w-100 h-100 object-fit-cover" />
          <div className="overlay-text position-absolute top-50 start-50 translate-middle text-white text-center px-4">
            <h2>Welcome Back!</h2>
            <p>Sign in to continue and explore amazing features.</p>
          </div>
        </Col>

        {/* Right Side (Login Form) */}
        <Col md={6} className="p-4 bg-white">
          <Card className="border-0">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>

                <div className="text-center mt-3">
                  <Button variant="link" onClick={() => setShowResetModal(true)}>
                    Forgot Password?
                  </Button>
                </div>
              </Form>

              {/* Social Logins */}
              <div className="text-center mt-3">
                <Button variant="outline-danger" className="w-100 my-2 d-flex align-items-center justify-content-center" onClick={() => handleSocialLogin(googleProvider)}>
                  <FcGoogle className="me-2" size={20} /> Login with Google
                </Button>

                <Button variant="outline-primary" className="w-100 my-2 d-flex align-items-center justify-content-center" onClick={() => handleSocialLogin(facebookProvider)}>
                  <FaFacebook className="me-2" size={20} /> Login with Facebook
                </Button>

                <Button variant="outline-dark" className="w-100 my-2 d-flex align-items-center justify-content-center" onClick={() => handleSocialLogin(githubProvider)}>
                  <FaGithub className="me-2" size={20} /> Login with GitHub
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Forgot Password Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Enter your email:</Form.Label>
            <Form.Control
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </Form.Group>
          {resetMessage && <p className="text-success">{resetMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handlePasswordReset}>Send Reset Link</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Login;
