import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert, Badge, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiHeart, FiArrowLeft, FiTruck, FiShield, FiAward } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import AnimatedCanvas from '../components/AnimatedCanvas';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, loading, error } = useSelector((state) => state.cart);
  const [showClearModal, setShowClearModal] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const [favoriteItems, setFavoriteItems] = useState(new Set());

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    setRemovingItem(itemId);
  };

  const confirmRemoveItem = () => {
    if (removingItem) {
      dispatch(removeFromCart(removingItem));
      setRemovingItem(null);
    }
  };

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    dispatch(clearCart());
    setShowClearModal(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleToggleFavorite = (itemId) => {
    setFavoriteItems(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Spinner animation="border" size="lg" className="text-primary" />
            <p className="mt-3 text-muted">در حال بارگذاری سبد خرید...</p>
          </motion.div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="danger">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </Alert>
        </motion.div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-vh-100 position-relative" style={{ background: 'var(--bg-primary)' }}>
        {/* Background Canvas */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
          <AnimatedCanvas 
            width={typeof window !== 'undefined' ? window.innerWidth : 1200} 
            height={typeof window !== 'undefined' ? window.innerHeight : 800} 
            type="floating"
            className="w-100 h-100"
          />
        </div>
        
        <Container className="py-5 position-relative" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                 style={{ 
                   width: '120px', 
                   height: '120px',
                   background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))'
                 }}>
              <FiShoppingBag size={48} className="text-white" />
            </div>
            <h3 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              سبد خرید شما خالی است
            </h3>
            <p className="text-muted mb-4 lead">
              محصولات مورد نظر خود را به سبد خرید اضافه کنید
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/')}
                  className="rounded-pill px-4"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                    border: 'none'
                  }}
                >
                  شروع خرید
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={() => navigate('/products')}
                  className="rounded-pill px-4"
                >
                  مشاهده محصولات
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'var(--bg-primary)' }}>
      <Container className="py-5">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="d-flex justify-content-between align-items-center mb-4"
          >
            <div>
              <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                سبد خرید شما
              </h2>
              <p className="text-muted mb-0">
                {totalItems} محصول در سبد خرید شما موجود است
              </p>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearCart}
              className="rounded-pill"
            >
              <FiTrash2 className="me-1" />
              خالی کردن سبد
            </Button>
          </motion.div>

          <Row>
            {/* Cart Items */}
            <Col lg={8} className="mb-4">
              <motion.div variants={itemVariants}>
                <Card className="theme-card border-0 shadow-lg" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Card.Header className="bg-transparent border-0 pb-0" style={{
                    background: 'var(--bg-secondary)',
                    borderBottom: '2px solid var(--border-color)',
                    borderRadius: '12px 12px 0 0'
                  }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0" style={{ 
                        color: 'var(--text-primary)',
                        fontSize: '1.1rem',
                        fontWeight: '600'
                      }}>
                        محصولات انتخابی
                      </h5>
                      <Badge 
                        className="px-3 py-2"
                        style={{
                          background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}
                      >
                        {totalItems} محصول
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0" style={{ background: 'var(--bg-card)' }}>
                    <div className="table-responsive">
                      <Table className="mb-0" style={{
                        background: 'var(--bg-card)',
                        borderRadius: '0 0 12px 12px',
                        overflow: 'hidden'
                      }}>
                        <thead style={{ 
                          background: 'var(--bg-secondary)',
                          borderBottom: '2px solid var(--border-color)'
                        }}>
                          <tr>
                            <th className="border-0 py-3 px-4 fw-bold" style={{ 
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              textAlign: 'right'
                            }}>
                              محصول
                            </th>
                            <th className="border-0 py-3 px-4 fw-bold" style={{ 
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              textAlign: 'center'
                            }}>
                              قیمت
                            </th>
                            <th className="border-0 py-3 px-4 fw-bold" style={{ 
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              textAlign: 'center'
                            }}>
                              تعداد
                            </th>
                            <th className="border-0 py-3 px-4 fw-bold" style={{ 
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              textAlign: 'center'
                            }}>
                              مجموع
                            </th>
                            <th className="border-0 py-3 px-4 fw-bold" style={{ 
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              textAlign: 'center'
                            }}>
                              عملیات
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence>
                            {items && items.length > 0 ? items.map((item, index) => (
                              <motion.tr
                                key={item.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                style={{ 
                                  borderBottom: '1px solid var(--border-color)',
                                  background: 'var(--bg-card)',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                <td className="py-4 px-4" style={{ textAlign: 'right' }}>
                                  <div className="d-flex align-items-center">
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <img
                                        src={item.product.image || '/placeholder-image.jpg'}
                                        alt={item.product.title}
                                        style={{ 
                                          width: '80px', 
                                          height: '80px', 
                                          objectFit: 'cover',
                                          borderRadius: '12px'
                                        }}
                                        className="me-3"
                                      />
                                    </motion.div>
                                    <div className="flex-grow-1">
                                      <h6 className="mb-1 fw-semibold" style={{ 
                                        color: 'var(--text-primary)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.4'
                                      }}>
                                        {item.product.title}
                                      </h6>
                                      <Badge 
                                        variant="secondary" 
                                        className="rounded-pill px-2 py-1"
                                        style={{
                                          background: 'var(--bg-tertiary)',
                                          color: 'var(--text-secondary)',
                                          fontSize: '0.7rem',
                                          fontWeight: '500'
                                        }}
                                      >
                                        {item.product.category?.name}
                                      </Badge>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4" style={{ textAlign: 'center' }}>
                                  <span className="fw-bold h6" style={{ 
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                  }}>
                                    {item.product.price.toLocaleString()} تومان
                                  </span>
                                </td>
                                <td className="py-4 px-4" style={{ textAlign: 'center' }}>
                                  <div className="d-flex align-items-center justify-content-center">
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="rounded-circle"
                                        style={{
                                          width: '32px',
                                          height: '32px',
                                          padding: '0',
                                          border: '1px solid var(--border-color)',
                                          background: 'var(--bg-primary)',
                                          color: 'var(--text-primary)'
                                        }}
                                      >
                                        <FiMinus size={12} />
                                      </Button>
                                    </motion.div>
                                    <span className="mx-3 fw-semibold" style={{ 
                                      color: 'var(--text-primary)',
                                      minWidth: '30px',
                                      textAlign: 'center',
                                      fontSize: '1rem'
                                    }}>
                                      {item.quantity}
                                    </span>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        className="rounded-circle"
                                        style={{
                                          width: '32px',
                                          height: '32px',
                                          padding: '0',
                                          border: '1px solid var(--border-color)',
                                          background: 'var(--bg-primary)',
                                          color: 'var(--text-primary)'
                                        }}
                                      >
                                        <FiPlus size={12} />
                                      </Button>
                                    </motion.div>
                                  </div>
                                </td>
                                <td className="py-4 px-4" style={{ textAlign: 'center' }}>
                                  <span className="fw-bold h6 text-primary" style={{ fontSize: '1rem' }}>
                                    {item.total_price.toLocaleString()} تومان
                                  </span>
                                </td>
                                <td className="py-4 px-4" style={{ textAlign: 'center' }}>
                                  <div className="d-flex gap-2 justify-content-center">
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => handleToggleFavorite(item.id)}
                                        className="p-2 text-decoration-none"
                                        style={{
                                          color: favoriteItems.has(item.id) ? '#ef4444' : 'var(--text-muted)'
                                        }}
                                      >
                                        <FiHeart 
                                          size={16}
                                          style={{
                                            fill: favoriteItems.has(item.id) ? 'currentColor' : 'none'
                                          }}
                                        />
                                      </Button>
                                    </motion.div>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="p-2 rounded-circle"
                                        style={{
                                          width: '32px',
                                          height: '32px',
                                          padding: '0'
                                        }}
                                      >
                                        <FiTrash2 size={14} />
                                      </Button>
                                    </motion.div>
                                  </div>
                                </td>
                              </motion.tr>
                            )) : null}
                          </AnimatePresence>
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Order Summary */}
            <Col lg={4}>
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="theme-card border-0 shadow-lg sticky-top" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  top: '20px'
                }}>
                  <Card.Header className="bg-transparent border-0 pb-0">
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                      خلاصه سفارش
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="space-y-3">
                      <div className="d-flex justify-content-between py-2">
                        <span className="text-muted">تعداد محصولات:</span>
                        <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                          {totalItems}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between py-2">
                        <span className="text-muted">مجموع قیمت:</span>
                        <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                          {totalPrice.toLocaleString()} تومان
                        </span>
                      </div>
                      <div className="d-flex justify-content-between py-2">
                        <span className="text-muted">هزینه ارسال:</span>
                        <span className="text-success fw-semibold">رایگان</span>
                      </div>
                      <div className="d-flex justify-content-between py-2">
                        <span className="text-muted">تخفیف:</span>
                        <span className="text-success fw-semibold">0 تومان</span>
                      </div>
                    </div>
                    
                    <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />
                    
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fw-bold h5" style={{ color: 'var(--text-primary)' }}>
                        مجموع کل:
                      </span>
                      <span className="fw-bold h4 text-primary">
                        {totalPrice.toLocaleString()} تومان
                      </span>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-100 rounded-pill py-3 mb-3"
                        onClick={handleCheckout}
                        style={{
                          background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                          border: 'none',
                          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                        }}
                      >
                        ادامه فرآیند خرید
                      </Button>
                    </motion.div>

                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="w-100 rounded-pill py-3"
                      onClick={() => navigate('/')}
                      style={{
                        border: '1px solid var(--primary-color)',
                        color: 'var(--primary-color)'
                      }}
                    >
                      <FiArrowLeft className="me-2" />
                      ادامه خرید
                    </Button>

                    {/* Features */}
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                      <div className="row g-2">
                        <div className="col-4 text-center">
                          <div className="p-2 rounded-3" style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)'
                          }}>
                            <FiTruck className="text-primary mb-1" size={20} />
                            <div className="small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                              ارسال رایگان
                            </div>
                          </div>
                        </div>
                        <div className="col-4 text-center">
                          <div className="p-2 rounded-3" style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)'
                          }}>
                            <FiShield className="text-success mb-1" size={20} />
                            <div className="small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                              ضمانت کیفیت
                            </div>
                          </div>
                        </div>
                        <div className="col-4 text-center">
                          <div className="p-2 rounded-3" style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)'
                          }}>
                            <FiAward className="text-warning mb-1" size={20} />
                            <div className="small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                              اصالت کالا
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </Container>

      {/* Clear Cart Confirmation Modal */}
      <Modal
        show={showClearModal}
        onHide={() => setShowClearModal(false)}
        centered
        size="sm"
        style={{ background: 'var(--bg-card)' }}
      >
        <Modal.Body className="text-center p-4" style={{
          background: 'var(--bg-card)',
          color: 'var(--text-primary)'
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15 
            }}
          >
            <div className="bg-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '60px', height: '60px' }}>
              <FiTrash2 size={24} className="text-white" />
            </div>
            <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              خالی کردن سبد خرید
            </h5>
            <p className="text-muted mb-3">
              آیا مطمئن هستید که می‌خواهید تمام محصولات را از سبد خرید حذف کنید؟
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setShowClearModal(false)}
                className="rounded-pill"
              >
                انصراف
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={confirmClearCart}
                className="rounded-pill"
              >
                حذف همه
              </Button>
            </div>
          </motion.div>
        </Modal.Body>
      </Modal>

      {/* Remove Item Confirmation Modal */}
      <Modal
        show={!!removingItem}
        onHide={() => setRemovingItem(null)}
        centered
        size="sm"
        style={{ background: 'var(--bg-card)' }}
      >
        <Modal.Body className="text-center p-4" style={{
          background: 'var(--bg-card)',
          color: 'var(--text-primary)'
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15 
            }}
          >
            <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '60px', height: '60px' }}>
              <FiTrash2 size={24} className="text-white" />
            </div>
            <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              حذف محصول
            </h5>
            <p className="text-muted mb-3">
              آیا مطمئن هستید که می‌خواهید این محصول را از سبد خرید حذف کنید؟
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setRemovingItem(null)}
                className="rounded-pill"
              >
                انصراف
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={confirmRemoveItem}
                className="rounded-pill"
              >
                حذف
              </Button>
            </div>
          </motion.div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Cart;