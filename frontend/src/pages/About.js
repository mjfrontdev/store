import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiTruck, FiShield, FiHeadphones, FiAward, FiUsers } from 'react-icons/fi';
import AnimatedCanvas from '../components/AnimatedCanvas';

const About = () => {
  const features = [
    {
      icon: <FiShoppingBag size={40} />,
      title: 'محصولات متنوع',
      description: 'بیش از 1000 محصول با کیفیت از برندهای معتبر',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FiTruck size={40} />,
      title: 'ارسال سریع',
      description: 'ارسال رایگان برای خریدهای بالای 500 هزار تومان',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <FiShield size={40} />,
      title: 'امنیت بالا',
      description: 'پرداخت امن و محافظت از اطلاعات شخصی',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <FiHeadphones size={40} />,
      title: 'پشتیبانی 24/7',
      description: 'تیم پشتیبانی حرفه‌ای در تمام ساعات شبانه‌روز',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: <FiAward size={40} />,
      title: 'کیفیت تضمینی',
      description: 'تضمین کیفیت و اصالت تمام محصولات',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: <FiUsers size={40} />,
      title: 'جامعه بزرگ',
      description: 'بیش از 50 هزار مشتری راضی در سراسر کشور',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const stats = [
    { number: '50K+', label: 'مشتری راضی' },
    { number: '1000+', label: 'محصول متنوع' },
    { number: '99%', label: 'رضایت مشتری' },
    { number: '24/7', label: 'پشتیبانی' }
  ];

  return (
    <div className="min-vh-100" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="py-5 position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Background Canvas */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
          <AnimatedCanvas 
            width={typeof window !== 'undefined' ? window.innerWidth : 1200} 
            height={400} 
            type="waves"
            className="w-100 h-100"
          />
        </div>
        
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-3 px-3 py-2" style={{
                  background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                  fontSize: '0.9rem'
                }}>
                  درباره فروشگاه ما
                </Badge>
                <h1 className="display-4 fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  تجربه خرید 
                  <span className="text-gradient" style={{
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    مدرن و آسان
                  </span>
                </h1>
                <p className="lead mb-4" style={{ color: 'var(--text-secondary)' }}>
                  فروشگاه آنلاین ما با بیش از 5 سال تجربه در زمینه فروش آنلاین، 
                  متعهد به ارائه بهترین محصولات و خدمات به مشتریان عزیز است.
                </p>
                <div className="d-flex gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-lg">
                      شروع خرید
                    </button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button className="btn btn-outline-primary btn-lg px-4 py-3 rounded-pill">
                      تماس با ما
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="position-relative">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-5 shadow-xl" style={{
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))'
                  }}>
                    <div className="text-white">
                      <h3 className="fw-bold mb-3">فروشگاه آنلاین</h3>
                      <p className="mb-4">بهترین تجربه خرید آنلاین</p>
                      <div className="d-flex justify-content-center gap-4">
                        <div className="text-center">
                          <div className="fs-2 fw-bold">50K+</div>
                          <small>مشتری</small>
                        </div>
                        <div className="text-center">
                          <div className="fs-2 fw-bold">1000+</div>
                          <small>محصول</small>
                        </div>
                        <div className="text-center">
                          <div className="fs-2 fw-bold">99%</div>
                          <small>رضایت</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              چرا ما را انتخاب کنید؟
            </h2>
            <p className="lead" style={{ color: 'var(--text-secondary)' }}>
              ویژگی‌های منحصر به فرد که ما را از رقبا متمایز می‌کند
            </p>
          </motion.div>

          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-100 border-0 shadow-lg theme-card" style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.3s ease'
                  }}>
                    <Card.Body className="p-4 text-center">
                      <div className={`bg-gradient-to-r ${feature.color} rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3 text-white`}>
                        {feature.icon}
                      </div>
                      <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                        {feature.title}
                      </h5>
                      <p className="text-muted mb-0" style={{ color: 'var(--text-secondary)' }}>
                        {feature.description}
                      </p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5" style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col md={3} sm={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-4 text-white shadow-lg" style={{
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))'
                  }}>
                    <div className="display-4 fw-bold mb-2">{stat.number}</div>
                    <div className="fw-semibold">{stat.label}</div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="display-5 fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  ماموریت ما
                </h2>
                <p className="lead mb-4" style={{ color: 'var(--text-secondary)' }}>
                  ما متعهد به ارائه بهترین تجربه خرید آنلاین با تمرکز بر کیفیت، 
                  امنیت و رضایت مشتری هستیم. هدف ما ایجاد پلی بین نیازهای مشتریان 
                  و بهترین محصولات موجود در بازار است.
                </p>
                <div className="d-flex gap-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle p-2 me-3">
                      <FiAward className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>کیفیت تضمینی</div>
                      <small className="text-muted">تمام محصولات</small>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-0 shadow-xl" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Card.Body className="p-5">
                    <h4 className="fw-bold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
                      ارزش‌های ما
                    </h4>
                    <div className="space-y-3">
                      <div className="d-flex align-items-center p-3 rounded-3" style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}>
                        <div className="bg-primary rounded-circle p-2 me-3">
                          <FiShield className="text-white" size={18} />
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>امنیت</div>
                          <small className="text-muted">حفاظت از اطلاعات شما</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center p-3 rounded-3" style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div className="bg-success rounded-circle p-2 me-3">
                          <FiAward className="text-white" size={18} />
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>کیفیت</div>
                          <small className="text-muted">بهترین محصولات</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center p-3 rounded-3" style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        <div className="bg-warning rounded-circle p-2 me-3">
                          <FiHeadphones className="text-white" size={18} />
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>پشتیبانی</div>
                          <small className="text-muted">24/7 در خدمت شما</small>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;