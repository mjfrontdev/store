import React, { useState } from 'react';
import { Navbar as BSNavbar, Nav, Container, Badge, Dropdown, Button as BSButton } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { motion } from 'framer-motion';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

import { logout } from '../store/slices/authSlice';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <BSNavbar bg="white" expand="lg" className="shadow-sm sticky-top border-bottom">
      <Container fluid>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold text-primary d-flex align-items-center">
          <span className="fs-3 me-2">🛒</span>
          <div>
            <div className="fw-bold">تکنولا</div>
            <small className="text-muted">بهترین محصولات با کیفیت</small>
          </div>
        </BSNavbar.Brand>

        <BSNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={toggleMenu}
          className="border-0"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </BSNavbar.Toggle>

        <BSNavbar.Collapse id="basic-navbar-nav" className={isOpen ? 'show' : ''}>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={() => setIsOpen(false)} className="fw-semibold">
              🏠 خانه
            </Nav.Link>
            <Nav.Link as={Link} to="/products" onClick={() => setIsOpen(false)} className="fw-semibold">
              📱 محصولات
            </Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={() => setIsOpen(false)} className="fw-semibold">
              ℹ️ درباره ما
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={() => setIsOpen(false)} className="fw-semibold">
              📞 تماس با ما
            </Nav.Link>
          </Nav>

          <Nav className="d-flex align-items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/cart" className="position-relative btn btn-outline-primary rounded-pill px-3">
                  <FiShoppingCart size={18} className="me-1" />
                  سبد خرید
                  {totalItems > 0 && (
                    <Badge 
                      bg="danger" 
                      className="position-absolute top-0 start-100 translate-middle rounded-pill"
                      style={{ fontSize: '0.6rem', minWidth: '18px', height: '18px' }}
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Nav.Link>

                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-secondary" className="d-flex align-items-center">
                    <FiUser size={18} className="me-1" />
                    {user?.first_name || user?.email}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="border-0 shadow">
                    <Dropdown.Item as={Link} to="/dashboard" className="py-2">
                      📊 داشبورد
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile" className="py-2">
                      👤 پروفایل
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="py-2 text-danger">
                      <FiLogOut className="me-2" />
                      خروج
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <BSButton as={Link} to="/login" variant="outline-primary" className="rounded-pill">
                  ورود
                </BSButton>
                <BSButton as={Link} to="/register" variant="primary" className="rounded-pill">
                  ثبت نام
                </BSButton>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
