import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiCreditCard, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchCart } from '../store/slices/cartSlice';
import { createOrder, processPayment } from '../store/slices/orderSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading: cartLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading: orderLoading, error: orderError } = useSelector((state) => state.orders);

  const [formData, setFormData] = useState({
    shipping_address: user?.address || '',
    shipping_city: user?.city || '',
    shipping_postal_code: user?.postal_code || '',
    shipping_phone: user?.phone_number || '',
    payment_method: 'online',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCart());
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
    
    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'آدرس ارسال الزامی است';
    }
    
    if (!formData.shipping_city.trim()) {
      newErrors.shipping_city = 'شهر الزامی است';
    }
    
    if (!formData.shipping_postal_code.trim()) {
      newErrors.shipping_postal_code = 'کد پستی الزامی است';
    }
    
    if (!formData.shipping_phone.trim()) {
      newErrors.shipping_phone = 'شماره تماس الزامی است';
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
      const result = await dispatch(createOrder(formData)).unwrap();
      
      if (result.order) {
        // Process payment
        await dispatch(processPayment(result.order.id)).unwrap();
        
        // Redirect to order detail page
        navigate(`/order/${result.order.id}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (cartLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" size="lg" className="text-primary" />
          <p className="mt-3 text-muted">در حال بارگذاری...</p>
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          سبد خرید شما خالی است. لطفاً ابتدا محصولی به سبد خرید اضافه کنید.
        </Alert>
        <Button variant="primary" onClick={() => navigate('/')}>
          بازگشت به صفحه اصلی
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Row>
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Header>
                <h4 className="mb-0">
                  <FiTruck className="me-2" />
                  اطلاعات ارسال
                </h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Label>آدرس کامل *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="shipping_address"
                        value={formData.shipping_address}
                        onChange={handleInputChange}
                        isInvalid={!!errors.shipping_address}
                        placeholder="آدرس کامل خود را وارد کنید"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.shipping_address}
                      </Form.Control.Feedback>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Label>شهر *</Form.Label>
                      <Form.Control
                        type="text"
                        name="shipping_city"
                        value={formData.shipping_city}
                        onChange={handleInputChange}
                        isInvalid={!!errors.shipping_city}
                        placeholder="نام شهر"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.shipping_city}
                      </Form.Control.Feedback>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Label>کد پستی *</Form.Label>
                      <Form.Control
                        type="text"
                        name="shipping_postal_code"
                        value={formData.shipping_postal_code}
                        onChange={handleInputChange}
                        isInvalid={!!errors.shipping_postal_code}
                        placeholder="کد پستی 10 رقمی"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.shipping_postal_code}
                      </Form.Control.Feedback>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Label>شماره تماس *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="shipping_phone"
                        value={formData.shipping_phone}
                        onChange={handleInputChange}
                        isInvalid={!!errors.shipping_phone}
                        placeholder="09123456789"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.shipping_phone}
                      </Form.Control.Feedback>
                    </Col>
                    
                    <Col md={12} className="mb-3">
                      <Form.Label>یادداشت (اختیاری)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="یادداشت یا توضیحات اضافی"
                      />
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header>
                <h4 className="mb-0">
                  <FiCreditCard className="me-2" />
                  روش پرداخت
                </h4>
              </Card.Header>
              <Card.Body>
                <Form.Check
                  type="radio"
                  id="online"
                  name="payment_method"
                  value="online"
                  checked={formData.payment_method === 'online'}
                  onChange={handleInputChange}
                  label="پرداخت آنلاین (زرین‌پال)"
                />
                <Form.Check
                  type="radio"
                  id="cash"
                  name="payment_method"
                  value="cash"
                  checked={formData.payment_method === 'cash'}
                  onChange={handleInputChange}
                  label="پرداخت در محل"
                />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">خلاصه سفارش</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <h6>محصولات:</h6>
                    {items && items.length > 0 ? items.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between mb-2">
                        <span className="small">
                          {item.product.title} × {item.quantity}
                        </span>
                        <span className="small">
                          {item.total_price.toLocaleString()} تومان
                        </span>
                      </div>
                    )) : (
                      <div className="text-muted">محصولی در سبد خرید وجود ندارد</div>
                    )}
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>مجموع قیمت:</span>
                    <span>{totalPrice.toLocaleString()} تومان</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>هزینه ارسال:</span>
                    <span className="text-success">رایگان</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>مالیات:</span>
                    <span>{(totalPrice * 0.09).toLocaleString()} تومان</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">مجموع کل:</span>
                    <span className="fw-bold text-primary h5">
                      {(totalPrice * 1.09).toLocaleString()} تومان
                    </span>
                  </div>
                  
                  {orderError && (
                    <Alert variant="danger" className="mb-3">
                      {typeof orderError === 'string' ? orderError : JSON.stringify(orderError)}
                    </Alert>
                  )}
                  
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100"
                    onClick={handleSubmit}
                    disabled={orderLoading}
                  >
                    {orderLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        در حال پردازش...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="me-2" />
                        تکمیل سفارش
                      </>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default Checkout;
