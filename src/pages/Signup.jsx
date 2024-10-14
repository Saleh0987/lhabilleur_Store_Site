import React, { useState } from 'react';
import Helmet from '../components/Helmet/Helmet';
import { Container, Row, Col, Form, FormGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/login.css';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore';
import { storage, db, auth } from '../firebase.config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Ui/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateUsername = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
    return regex.test(value);
  };

  const validatePassword = (value) => {
    return value.length >= 10;
  };

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateUsername(username)) {
        toast.error('Username must contain at least one uppercase and one lowercase letter.');
        setLoading(false);
        return;
      }

      if (!validatePassword(password)) {
        toast.error('Password must be at least 10 characters long.');
        setLoading(false);
        return;
      }

      if (!file) {
        toast.error('Please upload an image.');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const storageRef = ref(storage, `images/${Date.now() + username}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            await updateProfile(user, {
              displayName: username,
              photoURL: downloadUrl,
            });

            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              displayName: username,
              email,
              photoURL: downloadUrl,
            });
          });
        }
      );

      setLoading(false);
      toast.success('Account Created');
      navigate('/');
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered.');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Helmet title='Signup'>
      <section className='log'>
        <Container>
          <Row>
            {loading ? (
              <Col lg='12' className='text-center h-100'>
                <Loader />
              </Col>
            ) : (
              <Col lg='6' className='m-auto text-center'>
                <h3 className='fw-bold mb-4'>Signup</h3>
                <Form className='auth__form' onSubmit={signup}>
                  <FormGroup className='form__groub'>
                    <input
                      type='text'
                      placeholder='Username'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className='form__groub'>
                    <input
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className='form__groub'>
                    <div className="password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button type="button" onClick={togglePassword} className="toggle-password">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </FormGroup>
                  <div className="file">
                    <FormGroup className='form__groub'>
                      <input type='file' onChange={(e) => setFile(e.target.files[0])} />
                    </FormGroup>
                  </div>
                  <button type='submit' className='auth__btn'>
                    Create an account
                  </button>
                  <p>
                    Already have an account? <Link to='/login'>Login</Link>
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

export default Signup;