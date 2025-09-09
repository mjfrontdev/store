import React, { useState } from 'react';
import { Modal, Button, Form, Card, Badge, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSearch, FiHelpCircle, FiPackage, FiTruck, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AIAssistant = () => {
  const [show, setShow] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);

  const handleOpenAssistant = () => {
    if (!isAuthenticated) {
      toast.warning('لطفاً ابتدا وارد حساب کاربری خود شوید', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setShow(true);
    setShowIntro(true);
    setOrderInfo(null);
    setChatMessages([]);
  };

  const handleClose = () => {
    setShow(false);
    setShowIntro(true);
    setOrderNumber('');
    setOrderInfo(null);
    setChatMessages([]);
    setCurrentMessage('');
    setShowHelp(false);
  };

  const handleOrderSearch = async () => {
    if (!orderNumber.trim()) {
      toast.error('لطفاً شماره سفارش را وارد کنید', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    
    try {
      // Extract order ID from format like ORD-1F30C01D
      const orderId = orderNumber.trim().toUpperCase();
      let searchId = orderId;
      
      // If format is ORD-XXXXX, extract the ID part
      if (orderId.startsWith('ORD-')) {
        searchId = orderId.replace('ORD-', '');
      }
      
      // Search in orders array
      const foundOrder = orders?.find(order => {
        // Try different matching strategies
        const orderIdStr = order.id.toString();
        return orderIdStr === searchId || 
               orderIdStr === orderId || 
               order.order_number === orderId ||
               order.order_number === orderNumber.trim();
      });
      
      if (foundOrder) {
        setOrderInfo(foundOrder);
        setShowIntro(false);
        setChatMessages([
          {
            id: 1,
            type: 'assistant',
            message: `سلام! سفارش شما با شماره ${orderNumber} پیدا شد.`,
            timestamp: new Date()
          },
          {
            id: 2,
            type: 'assistant',
            message: `وضعیت سفارش: ${getOrderStatus(foundOrder.status)}`,
            timestamp: new Date()
          },
          {
            id: 3,
            type: 'assistant',
            message: 'چطور می‌تونم کمکتون کنم؟',
            timestamp: new Date()
          }
        ]);
        toast.success('سفارش پیدا شد!', {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        // If not found in local orders, try to fetch from API
        try {
          const response = await fetch(`http://localhost:8000/api/orders/search/?order_number=${encodeURIComponent(orderNumber.trim())}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const orderData = await response.json();
            if (orderData) {
              setOrderInfo(orderData);
              setShowIntro(false);
              setChatMessages([
                {
                  id: 1,
                  type: 'assistant',
                  message: `سلام! سفارش شما با شماره ${orderNumber} پیدا شد.`,
                  timestamp: new Date()
                },
                {
                  id: 2,
                  type: 'assistant',
                  message: `وضعیت سفارش: ${getOrderStatus(orderData.status)}`,
                  timestamp: new Date()
                },
                {
                  id: 3,
                  type: 'assistant',
                  message: 'چطور می‌تونم کمکتون کنم؟',
                  timestamp: new Date()
                }
              ]);
              toast.success('سفارش پیدا شد!', {
                position: "top-right",
                autoClose: 2000,
              });
            } else {
              throw new Error('Order not found');
            }
          } else {
            throw new Error('API call failed');
          }
        } catch (apiError) {
          toast.error('سفارش با این شماره پیدا نشد. لطفاً شماره سفارش را بررسی کنید.', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    } catch (error) {
      toast.error('خطا در جستجوی سفارش. لطفاً دوباره تلاش کنید.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatus = (status) => {
    const statusMap = {
      'pending': 'در انتظار پرداخت',
      'paid': 'پرداخت شده',
      'processing': 'در حال پردازش',
      'shipped': 'ارسال شده',
      'delivered': 'تحویل داده شده',
      'cancelled': 'لغو شده'
    };
    return statusMap[status] || status;
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentMessage);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        message: aiResponse,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const generateAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('وضعیت') || lowerMessage.includes('status')) {
      return 'وضعیت سفارش شما در بالا نمایش داده شده است. اگر سوال خاصی دارید، بفرمایید.';
    } else if (lowerMessage.includes('زمان') || lowerMessage.includes('delivery')) {
      return 'زمان تحویل معمولاً 2-3 روز کاری است. برای اطلاعات دقیق‌تر، با پشتیبانی تماس بگیرید.';
    } else if (lowerMessage.includes('لغو') || lowerMessage.includes('cancel')) {
      return 'برای لغو سفارش، لطفاً با پشتیبانی تماس بگیرید یا از طریق پنل کاربری اقدام کنید.';
    } else if (lowerMessage.includes('تغییر') || lowerMessage.includes('change')) {
      return 'برای تغییر آدرس یا اطلاعات سفارش، با پشتیبانی تماس بگیرید.';
    } else if (lowerMessage.includes('بازگشت') || lowerMessage.includes('return')) {
      return 'برای بازگشت کالا، لطفاً با پشتیبانی تماس بگیرید تا راهنمایی‌های لازم را دریافت کنید.';
    } else {
      return 'متوجه نشدم. لطفاً سوال خود را واضح‌تر بپرسید یا با پشتیبانی تماس بگیرید.';
    }
  };

  const helpQuestions = [
    'وضعیت سفارش من چطوره؟',
    'زمان تحویل سفارش چقدره؟',
    'چطور می‌تونم سفارشم رو لغو کنم؟',
    'آدرس تحویل رو چطور تغییر بدم؟',
    'چطور می‌تونم کالا رو برگردونم؟',
    'مشکلی با سفارشم دارم، چیکار کنم؟'
  ];

  return (
    <>
      {/* AI Assistant Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="position-fixed"
        style={{
          bottom: '20px',
          left: '20px',
          zIndex: 1000
        }}
      >
        <Button
          onClick={handleOpenAssistant}
          className="rounded-circle p-3 ai-float"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            width: '60px',
            height: '60px'
          }}
        >
          <FiMessageCircle size={24} className="text-white" />
        </Button>
      </motion.div>

      {/* AI Assistant Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        className="ai-assistant-modal"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Modal.Body className="p-0 liquid-glass" style={{
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center p-4" style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div className="d-flex align-items-center">
              <div className="me-3" style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiMessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h5 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
                  دستیار هوشمند
                </h5>
                <small className="text-muted">در خدمت شما هستم</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowHelp(!showHelp)}
                className="p-2 text-decoration-none"
                style={{ color: 'var(--text-primary)' }}
              >
                <FiHelpCircle size={18} />
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={handleClose}
                className="p-2 text-decoration-none"
                style={{ color: 'var(--text-primary)' }}
              >
                <FiX size={18} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4" style={{ minHeight: '500px' }}>
            {showIntro && !orderInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Introduction */}
                <div className="text-center mb-4">
                  <div className="mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <FiMessageCircle size={32} className="text-white" />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    خوش آمدید! 👋
                  </h4>
                  <p className="text-muted mb-4">
                    من دستیار هوشمند شما هستم و می‌تونم در موارد زیر کمکتون کنم:
                  </p>
                </div>

                {/* Features */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <Card className="h-100 border-0 liquid-glass" style={{
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <Card.Body className="text-center p-3">
                        <FiPackage className="text-primary mb-2" size={24} />
                        <h6 className="mb-1" style={{ color: 'var(--text-primary)' }}>
                          پیگیری سفارش
                        </h6>
                        <small className="text-muted">وضعیت سفارش شما</small>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-6">
                    <Card className="h-100 border-0 liquid-glass" style={{
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <Card.Body className="text-center p-3">
                        <FiTruck className="text-success mb-2" size={24} />
                        <h6 className="mb-1" style={{ color: 'var(--text-primary)' }}>
                          اطلاعات ارسال
                        </h6>
                        <small className="text-muted">زمان و نحوه تحویل</small>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-6">
                    <Card className="h-100 border-0 liquid-glass" style={{
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <Card.Body className="text-center p-3">
                        <FiClock className="text-warning mb-2" size={24} />
                        <h6 className="mb-1" style={{ color: 'var(--text-primary)' }}>
                          زمان تحویل
                        </h6>
                        <small className="text-muted">تخمین زمان رسیدن</small>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-6">
                    <Card className="h-100 border-0 liquid-glass" style={{
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <Card.Body className="text-center p-3">
                        <FiCheckCircle className="text-info mb-2" size={24} />
                        <h6 className="mb-1" style={{ color: 'var(--text-primary)' }}>
                          پشتیبانی
                        </h6>
                        <small className="text-muted">راهنمایی و کمک</small>
                      </Card.Body>
                    </Card>
                  </div>
                </div>

                {/* Order Search */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    برای شروع، شماره سفارش خود را وارد کنید:
                  </h6>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="ORD-1F30C01D یا شماره سفارش..."
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'var(--text-primary)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Button
                      onClick={handleOrderSearch}
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        minWidth: '120px'
                      }}
                    >
                      {loading ? <Spinner size="sm" /> : <><FiSearch className="me-2" />جستجو</>}
                    </Button>
                  </div>
                </div>

                {/* Help Section */}
                {showHelp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <Card className="border-0 liquid-glass" style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <Card.Header className="bg-transparent border-0">
                        <h6 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
                          <FiHelpCircle className="me-2" />
                          سوالات متداول
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="row g-2">
                          {helpQuestions.map((question, index) => (
                            <div key={index} className="col-12">
                              <Badge
                                className="w-100 text-start p-2"
                                style={{
                                  background: 'rgba(102, 126, 234, 0.2)',
                                  color: 'var(--text-primary)',
                                  border: '1px solid rgba(102, 126, 234, 0.3)',
                                  fontSize: '0.8rem'
                                }}
                              >
                                {question}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Order Info */}
            {orderInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="mb-4 border-0 liquid-glass" style={{
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Card.Header className="bg-transparent border-0">
                    <h6 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
                      اطلاعات سفارش #{orderInfo.id}
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="row g-3">
                      <div className="col-6">
                        <small className="text-muted">وضعیت:</small>
                        <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                          {getOrderStatus(orderInfo.status)}
                        </div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">تاریخ سفارش:</small>
                        <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                          {new Date(orderInfo.created_at).toLocaleDateString('fa-IR')}
                        </div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">مبلغ کل:</small>
                        <div className="fw-bold text-primary">
                          {orderInfo.total_price?.toLocaleString()} تومان
                        </div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">تعداد آیتم:</small>
                        <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                          {orderInfo.items?.length || 0} محصول
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Chat Messages */}
                <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <AnimatePresence>
                    {chatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mb-3 ${message.type === 'user' ? 'text-end' : 'text-start'}`}
                      >
                        <div
                          className={`d-inline-block p-3 rounded-3 ${
                            message.type === 'user'
                              ? 'text-white'
                              : 'text-dark'
                          }`}
                          style={{
                            background: message.type === 'user'
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            maxWidth: '80%',
                            fontSize: '0.9rem'
                          }}
                        >
                          {message.message}
                        </div>
                        <small className="text-muted d-block mt-1">
                          {message.timestamp.toLocaleTimeString('fa-IR')}
                        </small>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Message Input */}
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="پیام خود را بنویسید..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'var(--text-primary)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      minWidth: '80px'
                    }}
                  >
                    ارسال
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AIAssistant;
