import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiSearch, FiShoppingBag, FiRefreshCw } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedCanvas from '../components/AnimatedCanvas';

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const quickLinks = [
    { icon: <FiHome size={20} />, title: 'صفحه اصلی', path: '/', color: 'primary' },
    { icon: <FiShoppingBag size={20} />, title: 'محصولات', path: '/products', color: 'success' },
    { icon: <FiSearch size={20} />, title: 'جستجو', path: '/products', color: 'info' },
  ];

  return (
    <div className="min-vh-100 d-flex align-items-center not-found-container position-relative">
      {/* Background Canvas */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
        <AnimatedCanvas 
          width={typeof window !== 'undefined' ? window.innerWidth : 1200} 
          height={typeof window !== 'undefined' ? window.innerHeight : 800} 
          type="floating"
          className="w-100 h-100"
        />
      </div>
      
      {/* Background Pattern */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        zIndex: 1
      }}></div>

      <Container className="position-relative" style={{ zIndex: 2 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              {/* 404 Number */}
              <motion.div
                variants={itemVariants}
                className="mb-4"
              >
                <motion.div
                  variants={floatingVariants}
                  animate="floating"
                  className="position-relative d-inline-block"
                >
                  <div className="display-1 fw-bold error-number" style={{
                    fontSize: '8rem',
                    lineHeight: '1'
                  }}>
                    404
                  </div>
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}></div>
                </motion.div>
              </motion.div>

              {/* Error Message */}
              <motion.div variants={itemVariants} className="mb-4">
                <h2 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  صفحه مورد نظر یافت نشد!
                </h2>
                <p className="lead text-muted mb-4" style={{ color: 'var(--text-secondary)' }}>
                  متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
                  <br />
                  لطفاً آدرس را بررسی کنید یا از لینک‌های زیر استفاده کنید.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="mb-5">
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => navigate('/')}
                      className="rounded-pill px-4 py-3"
                      style={{
                        background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      <FiHome className="me-2" />
                      بازگشت به خانه
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={() => navigate(-1)}
                      className="rounded-pill px-4 py-3"
                      style={{
                        border: '1px solid var(--primary-color)',
                        color: 'var(--primary-color)'
                      }}
                    >
                      <FiArrowLeft className="me-2" />
                      صفحه قبلی
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline-secondary"
                      size="lg"
                      onClick={() => window.location.reload()}
                      className="rounded-pill px-4 py-3"
                    >
                      <FiRefreshCw className="me-2" />
                      بارگذاری مجدد
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div variants={itemVariants}>
                <Card className="theme-card border-0 shadow-lg" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      لینک‌های مفید
                    </h5>
                    <Row className="g-3">
                      {quickLinks.map((link, index) => (
                        <Col md={4} key={index}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              to={link.path}
                              className="text-decoration-none"
                            >
                              <div className={`d-flex align-items-center p-3 rounded-3 bg-${link.color} bg-opacity-10 border border-${link.color} border-opacity-25 quick-link-card`}>
                                <div className={`text-${link.color} me-3`}>
                                  {link.icon}
                                </div>
                                <div>
                                  <div className={`fw-semibold text-${link.color}`}>
                                    {link.title}
                                  </div>
                                  <small className="text-muted">
                                    {link.path === '/' ? 'صفحه اصلی فروشگاه' : 
                                     link.path === '/products' ? 'مشاهده تمام محصولات' : 
                                     'جستجو در محصولات'}
                                  </small>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Search Box */}
              <motion.div variants={itemVariants} className="mt-5">
                <Card className="theme-card border-0 shadow-lg" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      جستجو در سایت
                    </h6>
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control rounded-pill"
                        placeholder="چه چیزی می‌خواهید پیدا کنید؟"
                        style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <Button
                        variant="primary"
                        className="rounded-pill px-4"
                        style={{
                          background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                          border: 'none'
                        }}
                      >
                        <FiSearch />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>

              {/* Fun Animation */}
              <motion.div
                variants={itemVariants}
                className="mt-5"
              >
                <div className="d-flex justify-content-center gap-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="fs-1 floating-emoji"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      {i === 1 ? '🛍️' : i === 2 ? '😊' : '🎉'}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default NotFound;
