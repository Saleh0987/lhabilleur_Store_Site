import React, {useState} from "react";
import Helmet from "../components/Helmet/Helmet";
import {Container, Row, Col, Form, FormGroup} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import "../styles/login.css";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase.config";
import {toast} from "react-toastify";
import Loader from "../components/Ui/Loader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const signin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setLoading(false);
      toast.success("Successfully logged in");
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Helmet title="Login min-h-[100vh]">
      <section className="log">
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <Loader />
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Login</h3>
                <Form className="auth__form" onSubmit={signin}>
                  <FormGroup className="form__groub">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__groub">
                    <div className="password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="toggle-password"
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </FormGroup>
                  <button type="submit" className="buy__btn auth__btn">
                    Login
                  </button>
                  <p>
                    Don't have an account?{" "}
                    <Link to="/signup">Create an account</Link>
                  </p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default LogIn;
