import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import { register, clearError } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear error when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'نام کاربری الزامی است';
    } else if (formData.username.length < 3) {
      newErrors.username = 'نام کاربری باید حداقل 3 کاراکتر باشد';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'نام الزامی است';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'نام خانوادگی الزامی است';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل 6 کاراکتر باشد';
    }
    
    if (!formData.password_confirm.trim()) {
      newErrors.password_confirm = 'تکرار رمز عبور الزامی است';
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'رمز عبور و تکرار آن یکسان نیستند';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">ثبت نام</h2>
                  <p className="text-muted">حساب کاربری جدید ایجاد کنید</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>نام</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          isInvalid={!!errors.first_name}
                          placeholder="نام خود را وارد کنید"
                          className="ps-5"
                        />
                        <FiUser className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      </div>
                      <Form.Control.Feedback type="invalid">
                        {errors.first_name}
                      </Form.Control.Feedback>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Label>نام خانوادگی</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        isInvalid={!!errors.last_name}
                        placeholder="نام خانوادگی خود را وارد کنید"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.last_name}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>نام کاربری</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      isInvalid={!!errors.username}
                      placeholder="نام کاربری خود را وارد کنید"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>ایمیل</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                        placeholder="ایمیل خود را وارد کنید"
                        className="ps-5"
                      />
                      <FiMail className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>رمز عبور</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        isInvalid={!!errors.password}
                        placeholder="رمز عبور خود را وارد کنید"
                        className="ps-5 pe-5"
                      />
                      <FiLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <Button
                        type="button"
                        variant="link"
                        className="position-absolute top-50 end-0 translate-middle-y p-0 me-3 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>تکرار رمز عبور</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPasswordConfirm ? 'text' : 'password'}
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleInputChange}
                        isInvalid={!!errors.password_confirm}
                        placeholder="رمز عبور را مجدداً وارد کنید"
                        className="ps-5 pe-5"
                      />
                      <FiLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                      <Button
                        type="button"
                        variant="link"
                        className="position-absolute top-50 end-0 translate-middle-y p-0 me-3 text-muted"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      >
                        {showPasswordConfirm ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.password_confirm}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        در حال ثبت نام...
                      </>
                    ) : (
                      'ثبت نام'
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="text-muted">
                    قبلاً حساب کاربری دارید؟{' '}
                    <Link to="/login" className="text-primary text-decoration-none">
                      وارد شوید
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
