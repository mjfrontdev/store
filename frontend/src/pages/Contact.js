import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageCircle } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <FiMail size={24} className="text-primary" />,
      title: "ایمیل",
      details: ["info@store.com", "support@store.com"],
      description: "برای سوالات و پشتیبانی"
    },
    {
      icon: <FiPhone size={24} className="text-success" />,
      title: "تلفن",
      details: ["+98 21 1234 5678", "+98 21 8765 4321"],
      description: "پشتیبانی 24 ساعته"
    },
    {
      icon: <FiMapPin size={24} className="text-warning" />,
      title: "آدرس",
      details: ["تهران، خیابان ولیعصر", "پلاک 123، طبقه 4"],
      description: "دفتر مرکزی"
    },
    {
      icon: <FiClock size={24} className="text-info" />,
      title: "ساعات کاری",
      details: ["شنبه تا پنج‌شنبه: 9-18", "جمعه: 10-16"],
      description: "پاسخگویی آنلاین"
    }
  ];

  return (
    <Container className="py-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-5"
      >
        <h1 className="display-4 fw-bold text-primary mb-3">
          تماس با ما
        </h1>
        <p className="lead text-muted">
          ما اینجا هستیم تا به سوالات شما پاسخ دهیم و کمک کنیم
        </p>
      </motion.div>

      <Row>
        {/* Contact Form */}
        <Col lg={8} className="mb-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0 d-flex align-items-center">
                  <FiMessageCircle className="me-2" />
                  ارسال پیام
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                {submitStatus === 'success' && (
                  <Alert variant="success" className="mb-4">
                    پیام شما با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>نام و نام خانوادگی *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="نام خود را وارد کنید"
                        className="border-0 bg-light"
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>ایمیل *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="ایمیل خود را وارد کنید"
                        className="border-0 bg-light"
                      />
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>موضوع *</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="موضوع پیام خود را وارد کنید"
                      className="border-0 bg-light"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>پیام *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="پیام خود را اینجا بنویسید..."
                      className="border-0 bg-light"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 rounded-pill"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <FiSend className="me-2" />
                        ارسال پیام
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        {/* Contact Info */}
        <Col lg={4}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">اطلاعات تماس</h5>
              </Card.Header>
              <Card.Body className="p-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="mb-4">
                    <div className="d-flex align-items-start">
                      <div className="me-3 mt-1">
                        {info.icon}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-2">{info.title}</h6>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="mb-1 text-muted small">{detail}</p>
                        ))}
                        <p className="mb-0 text-muted small">{info.description}</p>
                      </div>
                    </div>
                    {index < contactInfo.length - 1 && <hr className="my-3" />}
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Map Placeholder */}
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">موقعیت ما</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div 
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: '200px' }}
                >
                  <div className="text-center text-muted">
                    <FiMapPin size={48} className="mb-2" />
                    <p>نقشه موقعیت</p>
                    <small>تهران، خیابان ولیعصر</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-5"
      >
        <h3 className="text-center mb-4 fw-bold">سوالات متداول</h3>
        <Row>
          <Col md={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-bold">چگونه سفارش خود را پیگیری کنم؟</h6>
                <p className="text-muted small mb-0">
                  می‌توانید از طریق داشبورد کاربری خود وضعیت سفارش را مشاهده کنید.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-bold">آیا امکان بازگشت کالا وجود دارد؟</h6>
                <p className="text-muted small mb-0">
                  بله، تا 7 روز پس از دریافت کالا امکان بازگشت وجود دارد.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-bold">هزینه ارسال چقدر است؟</h6>
                <p className="text-muted small mb-0">
                  برای خریدهای بالای 500 هزار تومان ارسال رایگان است.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-bold">چگونه می‌توانم پرداخت کنم؟</h6>
                <p className="text-muted small mb-0">
                  پرداخت آنلاین، کارت به کارت و پرداخت در محل امکان‌پذیر است.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default Contact;
