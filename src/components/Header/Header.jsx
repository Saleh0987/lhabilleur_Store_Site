import React, { useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { motion } from 'framer-motion';
import logo from '../../assets/images/eco-logo.png';
import userIcon from '../../assets/images/user-icon.png';
import { Container, NavItem, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import useAuth from '../../custom-hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { toast } from 'react-toastify';

const navLinks = [
  { path: '', display: 'Home' },
  { path: 'shop', display: 'Shop' },
  { path: 'cart', display: 'Cart' },
];

const Header = () => {
  const headerRef = useRef(null);
  const profileActionRef = useRef(null);
  const menuRef = useRef(null);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const stickyHeader = () => {
      if (window.scrollY > 80) {
        headerRef.current.classList.add('sticky__header');
      } else {
        headerRef.current.classList.remove('sticky__header');
      }
    };

    const handleClickOutside = (event) => {
      if (profileActionRef.current && !profileActionRef.current.contains(event.target)) {
        profileActionRef.current.classList.remove('show__profileActions');
      }
    };
    
    window.addEventListener('scroll', stickyHeader);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', stickyHeader);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      signOut(auth)
        .then(() => {
          toast.success('Logged out');
          navigate('/Login');
        })
        .catch(err => toast.error(err.message));
    }
  };

  const toggleMenu = () => menuRef.current.classList.toggle('active__menu');
  const toggleProfileActions = () => {
    profileActionRef.current.classList.toggle('show__profileActions');
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <NavLink to={currentUser ? '/' : '/Signup'} className="logo">
              <img src={logo} alt="logo" />
              <h1>L'HABILLEUR</h1>
            </NavLink>

            {currentUser && (
              <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                <ul className="menu">
                  {navLinks.map((item, index) => (
                    <li className="nav__item" key={index}>
                      <NavLink to={item.path} className={({ isActive }) => (isActive ? 'active-link' : '')}>
                        {item.display}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="nav__icons">
              {currentUser ? (
                <>
                  <div className="profile" onClick={toggleProfileActions}>
                    <motion.img
                      whileTap={{ scale: 1.2 }}
                      src={currentUser.photoURL || userIcon}
                      alt="userIcon"
                      className="profile-picture"
                    />
                    <div className="profile-details" ref={profileActionRef}>
                      <h6 className="username">{currentUser.displayName}</h6>
                      <button className="logout" onClick={logout}>Logout</button>
                    </div>
                  </div>
                  <span className="cart__icon" onClick={() => navigate('/cart')}>
                    <i className="ri-shopping-bag-line"></i>
                    <span className="badge">{totalQuantity}</span>
                  </span>
                  <div className="mobile__menu" onClick={toggleMenu}>
                    <i className="ri-menu-line"></i>
                  </div>
                </>
              ) : (
                <div className="auth-links">
                  <NavLink to="/signup" className={({ isActive }) => (isActive ? "up btn__active" : "up")}>Signup</NavLink>
                  <NavLink to="/login" className={({ isActive }) => (isActive ? "in btn__active" : "in")}>Login</NavLink>
                </div>
              )}
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
