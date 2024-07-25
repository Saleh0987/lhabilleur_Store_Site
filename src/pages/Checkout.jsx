import React, {useState, useEffect} from 'react';
import CommonSection from '../components/Ui/CommonSection';
import Helmet from '../components/Helmet/Helmet';
import { Container, Row, Col, Form, FormGroup } from 'react-bootstrap';
import '../styles/checkout.css';
import { useSelector, useDispatch  } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../custom-hooks/useAuth';
import { cartActions } from '../redux/slices/cartSlice';

const Checkout = () => {
  const { currentUser } = useAuth();
  const totalQty = useSelector(state => state.cart.totalQuantity);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem('checkoutFormData');
    return savedFormData ? JSON.parse(savedFormData) : {
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    };
  });

  const { name, email, phoneNumber, address, city, postalCode, country } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }, [formData]);

  const done = () => {
    if (totalQty === 0) {
      toast.error('Your cart is empty');
      return navigate('/shop');
    }
    
    if (!currentUser) {
      toast.error('Please log in to place an order');
      return setTimeout(() => {
        navigate('/login');
      }, 2000);
    }

    if (
      name.trim() === '' ||
      email.trim() === '' ||
      phoneNumber.trim() === '' ||
      address.trim() === '' ||
      city.trim() === '' ||
      postalCode.trim() === '' ||
      country.trim() === ''
    ) {
      toast.error('Please fill in all the fields');
      return;
    }
    
    dispatch(cartActions.clearCart());
    toast.success('Order placed successfully');
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    });

    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <Helmet title='Checkout'>
      <CommonSection title='Checkout' />
      <section>
        <Container>
          <Row>
            <Col lg='8'>
              <h6 className="mb-4 fw-bold">Billing Information</h6>
              <Form className='billing__form'>
                <FormGroup className='form__groub'>
                  <input type="text" placeholder='Enter your name' name='name' value={name} onChange={handleChange}/>
                </FormGroup>
                <FormGroup className='form__groub'>
                  <input type="email" placeholder='Enter your email' name='email' value={email} onChange={handleChange}/>
                </FormGroup>
                <FormGroup className='form__groub'>
                  <input type="number" placeholder='Phone Number' name='phoneNumber' value={phoneNumber} onChange={handleChange}/>
                </FormGroup>
                <FormGroup className='form__groub'>
                  <input type="text" placeholder='Street address' name='address' value={address} onChange={handleChange}/>
                </FormGroup>
                <FormGroup className='form__groub'>
                  <input type="text" placeholder='City' name='city' value={city} onChange={handleChange}/>
                </FormGroup>
                <FormGroup className='form__groub'>
                  <input type="text" placeholder='Postal code' name='postalCode' value={postalCode} onChange={handleChange}/>
                </FormGroup>
                <FormGroup className='form__groub'>
                  <input type="text" placeholder='Country' name='country' value={country} onChange={handleChange}/>
                </FormGroup>
              </Form>
            </Col>
            <Col lg='4'>
              <div className="checkout__cart">
                <h6>Total Qty: <span>{totalQty} items</span></h6>
                <h6>Subtotal: <span>${totalAmount}</span></h6>
                <h6><span>Shipping: <br/> free shipping</span> <span>$0</span></h6>
                <h4>Total Cost: <span>${totalAmount}</span></h4>             
                <Link onClick={done} to='#'
                  className="buy__btn auth__btn mt-3 d-block text-center w-100 bg-white text-black fw-bold">
                  Place an order</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  )
}

export default Checkout;