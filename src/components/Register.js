import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { auth, googleProvider, facebookProvider, githubProvider } from "../firebase/firebase";
import Logo from "../img/logo.png"; 

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Password Validation Regex
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!password.match(passwordRegex)) {
      setErrorMessage("Password must be at least 8 characters, include a number and a special symbol.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      // Store user data
      const user = {
        displayName: username,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL || "",
      };
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email is already in use. Try logging in.");
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  // Handle Social Logins
  const handleSocialLogin = async (provider) => {
    try {
      if (window.innerWidth < 768) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        const user = {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL || "",
        };
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Social Login Failed:", error.message);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
      <Row className="shadow-lg rounded overflow-hidden w-75">
        {/* Left Side (Image Section) */}
        <Col md={6} className="d-none d-md-block p-0 position-relative">
          <img src={Logo} alt="Register" className="img-fluid w-100 h-100 object-fit-cover" />
          <div className="overlay-text position-absolute top-50 start-50 translate-middle text-white text-center px-4">
            <h2>Join Us Today!</h2>
            <p>Create an account to access exclusive features.</p>
          </div>
        </Col>

        {/* Right Side (Registration Form) */}
        <Col md={6} className="p-4 bg-white">
          <Card className="border-0">
            <Card.Body>
              <h2 className="text-center mb-4">Register</h2>

              {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

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

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Register
                </Button>

                <div className="text-center mt-3">
                  <p>Already have an account? <a href="/login">Login</a></p>
                </div>
              </Form>

              {/* Social Media Sign-Up */}
              <div className="text-center mt-3">
                <Button variant="outline-danger" className="w-100 my-2" onClick={() => handleSocialLogin(googleProvider)}>
                  <FcGoogle size={20} /> Sign Up with Google
                </Button>

                <Button variant="outline-primary" className="w-100 my-2" onClick={() => handleSocialLogin(facebookProvider)}>
                  <FaFacebook size={20} /> Sign Up with Facebook
                </Button>

                <Button variant="outline-dark" className="w-100 my-2" onClick={() => handleSocialLogin(githubProvider)}>
                  <FaGithub size={20} /> Sign Up with GitHub
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
