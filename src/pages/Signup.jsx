import React, { useState } from 'react';
import Helmet from '../components/Helmet/Helmet';
import { Container, Row, Col, Form, FormGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/login.css';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore';
import { storage } from '../firebase.config';
import { db } from '../firebase.config';
import { auth } from '../firebase.config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateUsername = (value) => {
    // Ensure that the username contains at least one lowercase and one uppercase letter
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
    return regex.test(value);
  };

  const validatePassword = (value) => {
    // Ensure that the password is at least 10 characters long
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
      navigate('/login');
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong');
    }
  };

  return (
    <Helmet title='Signup'>
      <section className='log'>
        <Container>
          <Row>
            {loading ? (
              <Col lg='12' className='text-center'>
                <h5 className='fw-bold'>Loading....</h5>
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
                  <input
                    type='password'
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className='form__groub'>
                  <input type='file' onChange={(e) => setFile(e.target.files[0])} />
                </FormGroup>

                <button type='submit' className='buy__btn auth__btn'>
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