import React from 'react';
import {NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { motion } from 'framer-motion';
import logo from '../../assets/images/eco-logo.png';
import userIcon from '../../assets/images/user-icon.png';
import { Container, Row } from 'react-bootstrap';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAuth from '../../custom-hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { toast } from 'react-toastify';


const nav__links = [
  {
    path: 'home',
    display: 'Home'
  },
  {
    path: 'shop',
    display: 'Shop'
  },
  {
    path: 'cart',
    display: 'Cart'
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const profileActionRef = useRef(null);
  const menuRef = useRef(null);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const location = useLocation();

  const stickyHeaderFunc = () => {
    if (window.scrollY > 80) {
      headerRef.current.classList.add('sticky__header');
    } else {
      headerRef.current.classList.remove('sticky__header');
    }
  };

const logout = () => {
  const shouldLogout = window.confirm('Are you sure you want to log out?');

  if (shouldLogout) {
    signOut(auth)
      .then(() => {
        toast.success('Logged out');
        navigate('/home');
      })
      .catch(err => {
        toast.error(err.message);
      });
  }
};

  useEffect(() => {
    window.addEventListener('scroll', stickyHeaderFunc);

    return () => {
      window.removeEventListener('scroll', stickyHeaderFunc);
    };
  }, []);

  const menuToggle = () => menuRef.current.classList.toggle('active__menu');

  const navigateToCart = () => {
    navigate('/cart');
  };

  const toggleProfileActions = () =>
    profileActionRef.current.classList.toggle('show__profileActions');

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            {/* Logo */}
            <NavLink to="/home" className="logo">
              <img src={logo} alt="logo" />
              <div>
                <h1>L'HABILLEUR</h1>
              </div>
            </NavLink>

            {/* Links */}
            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? 'nav__active' : ''
                      }>
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Icons */}
            <div className="nav__icons">
              {currentUser && location.pathname.startsWith('/') && !location.pathname.startsWith('/login') &&(
                <>
                  <h6 className="username">
                    {currentUser.displayName}
                  </h6>
            
                  <div className="profile">
                  
                    <motion.img
                      whileTap={{ scale: 1.2 }}
                      src={currentUser.photoURL || userIcon}
                      alt="userIcon"
                      onClick={toggleProfileActions}
                    />

                    <div
                      className="profile__actions"
                      ref={profileActionRef}
                      onClick={toggleProfileActions}>
                      <NavLink className="out" onClick={logout}>
                        Logout
                      </NavLink>
                    </div>
                  </div>
                </>
              )}
                  
              {!currentUser && (
                <div className="profile">
                  <NavLink to="/signup" className={({ isActive }) => isActive ? "up btn__active" : "up"} >
                    Signup
                  </NavLink>
                  <NavLink to="/login" className={({ isActive }) => isActive ? "in btn__active" : "in"}>
                    Login
                  </NavLink>
                </div>
              )}

              <span className="cart__icon" onClick={navigateToCart}>
                <i className="ri-shopping-bag-line"></i>
                <span className="badge">{totalQuantity}</span>
              </span>

              {/* Mobile Menu */}
              <div className="mobile__menu">
                <span onClick={menuToggle}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Row >
      </Container>
    </header>
  );
};
export default Header;