import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Badge, Tabs, Tab, ListGroup, Modal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FiPackage, FiShoppingBag, FiEye, FiCalendar, FiUser, FiSettings, 
  FiHeart, FiTruck, FiShield, FiTrendingUp, FiDollarSign,
  FiEdit, FiSave, FiX, FiBell, FiClock, FiCheckCircle,
  FiCreditCard, FiRefreshCw
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { fetchOrders } from '../store/slices/orderSlice';
import AnimatedCanvas from '../components/AnimatedCanvas';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.orders);
  
  // State for dashboard features
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Helper functions
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'در انتظار', icon: FiClock },
      processing: { variant: 'info', text: 'در حال پردازش', icon: FiRefreshCw },
      shipped: { variant: 'primary', text: 'ارسال شده', icon: FiTruck },
      delivered: { variant: 'success', text: 'تحویل داده شده', icon: FiCheckCircle },
      cancelled: { variant: 'danger', text: 'لغو شده', icon: FiX }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status, icon: FiPackage };
    const IconComponent = config.icon;
    return (
      <Badge bg={config.variant} className="d-flex align-items-center gap-1">
        <IconComponent size={12} />
        {config.text}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'در انتظار پرداخت', icon: FiClock },
      paid: { variant: 'success', text: 'پرداخت شده', icon: FiCheckCircle },
      failed: { variant: 'danger', text: 'پرداخت ناموفق', icon: FiX },
      refunded: { variant: 'info', text: 'بازگردانده شده', icon: FiRefreshCw }
    };
    
    const config = statusConfig[paymentStatus] || { variant: 'secondary', text: paymentStatus, icon: FiCreditCard };
    const IconComponent = config.icon;
    return (
      <Badge bg={config.variant} className="d-flex align-items-center gap-1">
        <IconComponent size={12} />
        {config.text}
      </Badge>
    );
  };

  // Calculate statistics
  const stats = {
    totalOrders: orders.length,
    completedOrders: orders.filter(order => order.status === 'delivered').length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    totalSpent: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / orders.length : 0
  };

  // Recent orders (last 5)
  const recentOrders = orders.slice(0, 5);

  // Handle profile update
  const handleProfileUpdate = () => {
    // Here you would typically make an API call to update the profile
    toast.success('پروفایل با موفقیت به‌روزرسانی شد!');
    setEditingProfile(false);
    setShowProfileModal(false);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative" style={{ background: 'var(--bg-primary)' }}>
        {/* Background Canvas */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
          <AnimatedCanvas 
            width={typeof window !== 'undefined' ? window.innerWidth : 1200} 
            height={typeof window !== 'undefined' ? window.innerHeight : 800} 
            type="particles"
            className="w-100 h-100"
          />
        </div>
        
        <Container className="position-relative text-center" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Spinner animation="border" size="lg" className="text-primary mb-3" />
            <h4 className="text-primary">در حال بارگذاری داشبورد...</h4>
            <p className="text-muted">لطفاً صبر کنید</p>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 position-relative" style={{ background: 'var(--bg-primary)' }}>
      {/* Background Canvas */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
        <AnimatedCanvas 
          width={typeof window !== 'undefined' ? window.innerWidth : 1200} 
          height={typeof window !== 'undefined' ? window.innerHeight : 800} 
          type="geometric"
          className="w-100 h-100"
        />
      </div>

      <Container className="py-5 position-relative" style={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <Row className="mb-5">
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-circle p-3 me-3" style={{
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiUser size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="display-6 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      خوش آمدید، {user?.first_name || user?.email}!
                    </h1>
                    <p className="text-muted mb-0">مدیریت پنل کاربری تکنولا</p>
                  </div>
                </div>
              </motion.div>
            </Col>
            <Col lg={4} className="text-lg-end">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="d-flex gap-2 justify-content-lg-end"
              >
                <Button
                  variant="outline-primary"
                  onClick={() => setShowProfileModal(true)}
                  className="d-flex align-items-center gap-2"
                >
                  <FiUser size={16} />
                  پروفایل
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowSettingsModal(true)}
                  className="d-flex align-items-center gap-2"
                >
                  <FiSettings size={16} />
                  تنظیمات
                </Button>
              </motion.div>
            </Col>
          </Row>

          {/* Stats Cards */}
          <Row className="mb-5">
            <Col lg={3} md={6} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="h-100 border-0 shadow-lg" style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                  <Card.Body className="text-center p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <FiPackage size={24} className="text-white" />
                    </div>
                    <h3 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {stats.totalOrders}
                    </h3>
                    <p className="text-muted mb-0">کل سفارشات</p>
                    <small className="text-success">
                      <FiTrendingUp className="me-1" />
                      +12% از ماه گذشته
                    </small>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="h-100 border-0 shadow-lg" style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  <Card.Body className="text-center p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #22c55e, #10b981)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <FiCheckCircle size={24} className="text-white" />
                    </div>
                    <h3 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {stats.completedOrders}
                    </h3>
                    <p className="text-muted mb-0">سفارشات تکمیل شده</p>
                    <small className="text-success">
                      <FiTrendingUp className="me-1" />
                      +8% از ماه گذشته
                    </small>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="h-100 border-0 shadow-lg" style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                  <Card.Body className="text-center p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #f59e0b, #fb923c)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <FiClock size={24} className="text-white" />
                    </div>
                    <h3 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {stats.pendingOrders}
                    </h3>
                    <p className="text-muted mb-0">در انتظار</p>
                    <small className="text-warning">
                      <FiTrendingUp className="me-1" />
                      +3% از ماه گذشته
                    </small>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col lg={3} md={6} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card className="h-100 border-0 shadow-lg" style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <Card.Body className="text-center p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <FiDollarSign size={24} className="text-white" />
                    </div>
                    <h3 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {stats.totalSpent.toLocaleString()}
                    </h3>
                    <p className="text-muted mb-0">کل خرید (تومان)</p>
                    <small className="text-success">
                      <FiTrendingUp className="me-1" />
                      +15% از ماه گذشته
                    </small>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* Main Content Tabs */}
          <Row>
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card className="border-0 shadow-lg" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Card.Body className="p-0">
                    <Tabs
                      activeKey={activeTab}
                      onSelect={(k) => setActiveTab(k)}
                      className="border-0"
                      style={{
                        borderBottom: '1px solid var(--border-color)'
                      }}
                    >
                      <Tab eventKey="overview" title={
                        <span className="d-flex align-items-center gap-2">
                          <FiPackage size={16} />
                          نمای کلی
                        </span>
                      }>
                        <div className="p-4">
                          {/* Quick Actions */}
                          <Row className="mb-4">
                            <Col>
                              <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                اقدامات سریع
                              </h5>
                              <div className="d-flex gap-3 flex-wrap">
                                <Button
                                  variant="primary"
                                  onClick={() => navigate('/products')}
                                  className="d-flex align-items-center gap-2"
                                >
                                  <FiShoppingBag size={16} />
                                  خرید جدید
                                </Button>
                                <Button
                                  variant="outline-primary"
                                  onClick={() => navigate('/cart')}
                                  className="d-flex align-items-center gap-2"
                                >
                                  <FiShoppingBag size={16} />
                                  سبد خرید
                                </Button>
                                <Button
                                  variant="outline-success"
                                  onClick={() => setShowProfileModal(true)}
                                  className="d-flex align-items-center gap-2"
                                >
                                  <FiUser size={16} />
                                  ویرایش پروفایل
                                </Button>
                              </div>
                            </Col>
                          </Row>

                          {/* Recent Orders */}
                          <Row>
                            <Col>
                              <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                سفارشات اخیر
                              </h5>
                              {recentOrders.length === 0 ? (
                                <div className="text-center py-5">
                                  <FiPackage size={64} className="text-muted mb-3" />
                                  <h5 className="text-muted">هنوز سفارشی ثبت نکرده‌اید</h5>
                                  <p className="text-muted mb-4">
                                    اولین سفارش خود را ثبت کنید
                                  </p>
                                  <Button variant="primary" onClick={() => navigate('/products')}>
                                    شروع خرید
                                  </Button>
                                </div>
                              ) : (
                                <div className="table-responsive">
                                  <Table hover className="mb-0">
                                    <thead style={{
                                      background: 'var(--bg-tertiary)',
                                      color: 'var(--text-primary)'
                                    }}>
                                      <tr>
                                        <th>شماره سفارش</th>
                                        <th>تاریخ</th>
                                        <th>مبلغ</th>
                                        <th>وضعیت</th>
                                        <th>پرداخت</th>
                                        <th>عملیات</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {recentOrders.map((order, index) => (
                                        <motion.tr
                                          key={order.id}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ duration: 0.3, delay: index * 0.1 }}
                                          style={{
                                            background: 'var(--bg-card)',
                                            color: 'var(--text-primary)'
                                          }}
                                        >
                                          <td>
                                            <span className="fw-bold">#{order.order_number}</span>
                                          </td>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <FiCalendar className="me-2 text-muted" size={14} />
                                              {new Date(order.created_at).toLocaleDateString('fa-IR')}
                                            </div>
                                          </td>
                                          <td>
                                            <span className="fw-bold text-primary">
                                              {order.total_amount?.toLocaleString()} تومان
                                            </span>
                                          </td>
                                          <td>{getStatusBadge(order.status)}</td>
                                          <td>{getPaymentStatusBadge(order.payment_status)}</td>
                                          <td>
                                            <Button
                                              variant="outline-primary"
                                              size="sm"
                                              onClick={() => navigate(`/order/${order.id}`)}
                                              className="d-flex align-items-center gap-1"
                                            >
                                              <FiEye size={14} />
                                              مشاهده
                                            </Button>
                                          </td>
                                        </motion.tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </div>
                              )}
                            </Col>
                          </Row>
                        </div>
                      </Tab>
                      
                      <Tab eventKey="orders" title={
                        <span className="d-flex align-items-center gap-2">
                          <FiShoppingBag size={16} />
                          همه سفارشات
                        </span>
                      }>
                        <div className="p-4">
                          {orders.length === 0 ? (
                            <div className="text-center py-5">
                              <FiPackage size={64} className="text-muted mb-3" />
                              <h5 className="text-muted">هنوز سفارشی ثبت نکرده‌اید</h5>
                              <p className="text-muted mb-4">
                                اولین سفارش خود را ثبت کنید
                              </p>
                              <Button variant="primary" onClick={() => navigate('/products')}>
                                شروع خرید
                              </Button>
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <Table hover className="mb-0">
                                <thead style={{
                                  background: 'var(--bg-tertiary)',
                                  color: 'var(--text-primary)'
                                }}>
                                  <tr>
                                    <th>شماره سفارش</th>
                                    <th>تاریخ</th>
                                    <th>مبلغ</th>
                                    <th>وضعیت</th>
                                    <th>پرداخت</th>
                                    <th>عملیات</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders.map((order, index) => (
                                    <motion.tr
                                      key={order.id}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: index * 0.05 }}
                                      style={{
                                        background: 'var(--bg-card)',
                                        color: 'var(--text-primary)'
                                      }}
                                    >
                                      <td>
                                        <span className="fw-bold">#{order.order_number}</span>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <FiCalendar className="me-2 text-muted" size={14} />
                                          {new Date(order.created_at).toLocaleDateString('fa-IR')}
                                        </div>
                                      </td>
                                      <td>
                                        <span className="fw-bold text-primary">
                                          {order.total_amount?.toLocaleString()} تومان
                                        </span>
                                      </td>
                                      <td>{getStatusBadge(order.status)}</td>
                                      <td>{getPaymentStatusBadge(order.payment_status)}</td>
                                      <td>
                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          onClick={() => navigate(`/order/${order.id}`)}
                                          className="d-flex align-items-center gap-1"
                                        >
                                          <FiEye size={14} />
                                          مشاهده
                                        </Button>
                                      </td>
                                    </motion.tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          )}
                        </div>
                      </Tab>
                    </Tabs>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </Container>

      {/* Profile Modal */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <Modal.Title style={{ color: 'var(--text-primary)' }}>
            <FiUser className="me-2" />
            پروفایل کاربری
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'var(--bg-primary)' }}>
          {editingProfile ? (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>نام</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>نام خانوادگی</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ایمیل</Form.Label>
                    <Form.Control
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>تلفن</Form.Label>
                    <Form.Control
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>آدرس</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => setEditingProfile(false)}
                >
                  <FiX className="me-1" />
                  لغو
                </Button>
                <Button
                  variant="primary"
                  onClick={handleProfileUpdate}
                >
                  <FiSave className="me-1" />
                  ذخیره
                </Button>
              </div>
            </Form>
          ) : (
            <div>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>نام:</strong>
                    <p className="text-muted">{profileData.firstName || 'تعریف نشده'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>نام خانوادگی:</strong>
                    <p className="text-muted">{profileData.lastName || 'تعریف نشده'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>ایمیل:</strong>
                    <p className="text-muted">{profileData.email}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>تلفن:</strong>
                    <p className="text-muted">{profileData.phone || 'تعریف نشده'}</p>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    <strong>آدرس:</strong>
                    <p className="text-muted">{profileData.address || 'تعریف نشده'}</p>
                  </div>
                </Col>
              </Row>
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="primary"
                  onClick={() => setEditingProfile(true)}
                >
                  <FiEdit className="me-1" />
                  ویرایش پروفایل
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Settings Modal */}
      <Modal
        show={showSettingsModal}
        onHide={() => setShowSettingsModal(false)}
        size="md"
        centered
      >
        <Modal.Header closeButton style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <Modal.Title style={{ color: 'var(--text-primary)' }}>
            <FiSettings className="me-2" />
            تنظیمات
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'var(--bg-primary)' }}>
          <ListGroup variant="flush">
            <ListGroup.Item style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}>
              <div className="d-flex align-items-center">
                <FiBell className="me-3" />
                <div>
                  <strong>اعلان‌ها</strong>
                  <p className="text-muted mb-0 small">مدیریت اعلان‌های سیستم</p>
                </div>
              </div>
            </ListGroup.Item>
            <ListGroup.Item style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}>
              <div className="d-flex align-items-center">
                <FiShield className="me-3" />
                <div>
                  <strong>امنیت</strong>
                  <p className="text-muted mb-0 small">تنظیمات امنیتی حساب</p>
                </div>
              </div>
            </ListGroup.Item>
            <ListGroup.Item style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}>
              <div className="d-flex align-items-center">
                <FiHeart className="me-3" />
                <div>
                  <strong>علاقه‌مندی‌ها</strong>
                  <p className="text-muted mb-0 small">مدیریت محصولات مورد علاقه</p>
                </div>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
