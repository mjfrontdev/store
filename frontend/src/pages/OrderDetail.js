import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiTruck, FiCreditCard, FiCalendar } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import { fetchOrder, processPayment } from '../store/slices/orderSlice';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrder(id));
    }
  }, [dispatch, id]);

  const handlePayment = async () => {
    try {
      await dispatch(processPayment(id)).unwrap();
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'در انتظار' },
      processing: { variant: 'info', text: 'در حال پردازش' },
      shipped: { variant: 'primary', text: 'ارسال شده' },
      delivered: { variant: 'success', text: 'تحویل داده شده' },
      cancelled: { variant: 'danger', text: 'لغو شده' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant} className="fs-6">{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'در انتظار پرداخت' },
      paid: { variant: 'success', text: 'پرداخت شده' },
      failed: { variant: 'danger', text: 'پرداخت ناموفق' },
      refunded: { variant: 'info', text: 'بازگردانده شده' }
    };
    
    const config = statusConfig[paymentStatus] || { variant: 'secondary', text: paymentStatus };
    return <Badge bg={config.variant} className="fs-6">{config.text}</Badge>;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" size="lg" className="text-primary" />
          <p className="mt-3 text-muted">در حال بارگذاری سفارش...</p>
        </div>
      </Container>
    );
  }

  if (error || !currentOrder) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {typeof error === 'string' ? (error || 'سفارش یافت نشد') : JSON.stringify(error)}
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
          <FiArrowLeft className="me-1" />
          بازگشت به داشبورد
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
        <Button
          variant="outline-primary"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <FiArrowLeft className="me-1" />
          بازگشت به داشبورد
        </Button>

        <Row>
          <Col lg={8}>
            {/* Order Items */}
            <Card className="shadow-sm mb-4">
              <Card.Header>
                <h4 className="mb-0">
                  <FiPackage className="me-2" />
                  محصولات سفارش
                </h4>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>محصول</th>
                      <th>قیمت واحد</th>
                      <th>تعداد</th>
                      <th>مجموع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrder.items && currentOrder.items.length > 0 ? currentOrder.items.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.product.image || '/placeholder-image.jpg'}
                              alt={item.product.title}
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              className="rounded me-3"
                            />
                            <div>
                              <h6 className="mb-1">{item.product.title}</h6>
                              <small className="text-muted">
                                {item.product.category?.name}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-bold">
                            {item.price.toLocaleString()} تومان
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary fs-6">
                            {item.quantity}
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold text-primary">
                            {item.total_price.toLocaleString()} تومان
                          </span>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          <p className="text-muted">محصولی در این سفارش وجود ندارد</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Shipping Information */}
            <Card className="shadow-sm">
              <Card.Header>
                <h4 className="mb-0">
                  <FiTruck className="me-2" />
                  اطلاعات ارسال
                </h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6>آدرس:</h6>
                    <p className="text-muted">{currentOrder.shipping_address}</p>
                  </Col>
                  <Col md={3}>
                    <h6>شهر:</h6>
                    <p className="text-muted">{currentOrder.shipping_city}</p>
                  </Col>
                  <Col md={3}>
                    <h6>کد پستی:</h6>
                    <p className="text-muted">{currentOrder.shipping_postal_code}</p>
                  </Col>
                </Row>
                {currentOrder.shipping_phone && (
                  <Row>
                    <Col md={6}>
                      <h6>شماره تماس:</h6>
                      <p className="text-muted">{currentOrder.shipping_phone}</p>
                    </Col>
                  </Row>
                )}
                {currentOrder.notes && (
                  <Row>
                    <Col>
                      <h6>یادداشت:</h6>
                      <p className="text-muted">{currentOrder.notes}</p>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Order Summary */}
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">خلاصه سفارش</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>شماره سفارش:</span>
                    <span className="fw-bold">#{currentOrder.order_number}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>تاریخ سفارش:</span>
                    <span>
                      <FiCalendar className="me-1" />
                      {new Date(currentOrder.created_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>وضعیت سفارش:</span>
                    {getStatusBadge(currentOrder.status)}
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>وضعیت پرداخت:</span>
                    {getPaymentStatusBadge(currentOrder.payment_status)}
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>مجموع قیمت:</span>
                    <span>{currentOrder.subtotal.toLocaleString()} تومان</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>هزینه ارسال:</span>
                    <span>{currentOrder.shipping_cost.toLocaleString()} تومان</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>مالیات:</span>
                    <span>{currentOrder.tax_amount.toLocaleString()} تومان</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">مجموع کل:</span>
                    <span className="fw-bold text-primary h5">
                      {currentOrder.total_amount.toLocaleString()} تومان
                    </span>
                  </div>
                  
                  {currentOrder.payment_status === 'pending' && (
                    <Button
                      variant="success"
                      size="lg"
                      className="w-100"
                      onClick={handlePayment}
                    >
                      <FiCreditCard className="me-1" />
                      پرداخت سفارش
                    </Button>
                  )}
                </Card.Body>
              </Card>

              {/* Order Actions */}
              <Card className="shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">عملیات</h5>
                </Card.Header>
                <Card.Body>
                  <Button
                    variant="outline-primary"
                    className="w-100 mb-2"
                    onClick={() => navigate('/')}
                  >
                    خرید جدید
                  </Button>
                  
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => navigate('/dashboard')}
                  >
                    بازگشت به داشبورد
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

export default OrderDetail;
