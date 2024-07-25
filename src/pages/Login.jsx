import React from 'react';
import Helmet from '../components/Helmet/Helmet';
import { Container, Row, Col, Form, FormGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { toast } from 'react-toastify';



const LogIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      console.log(user);
      setLoading(false);
      toast.success('Successfuly logged in');
      navigate('/home'); 

    } catch (erorr) {
      setLoading(false);
      toast.error(erorr.message);
    }
  } 


  return (
    <Helmet title='Login'>
      <section className='log'>
        <Container>
          <Row>

            {loading ? (<Col lg='12' className='text-center'>
              <h5 className='fw-bold'>Loading......</h5></Col>) : (
                            <Col lg='6' className='m-auto text-center'>
                            <h3 className='fw-bold mb-4'>Login</h3>
                            <Form className='auth__form' onSubmit={signin}>
                              <FormGroup className='form__groub'>
                                <input type="email" placeholder='Enter your email' value={email} onChange={e => setEmail(e.target.value)}/>
                              </FormGroup>
                              <FormGroup className='form__groub'>
                                <input type="password" placeholder='Enter your password' value={password} onChange={e => setPassword(e.target.value)}/>
                              </FormGroup>
              
                              <button type='submit' className='buy__btn auth__btn'>Login</button>
                              <p>Don't have an account? <Link to='/signup'>Create an account</Link></p>
                            </Form>
                          </Col>
              )}


          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default LogIn;