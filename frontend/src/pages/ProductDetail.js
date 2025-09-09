import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiArrowRight, FiArrowLeft, FiHeart, FiShare2, FiTruck, FiShield, FiAward, FiMinus, FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProduct, clearCurrentProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (isAuthenticated) {
      dispatch(addToCart({ productId: currentProduct.id, quantity }));
      setShowAddToCartModal(true);
      
      setTimeout(() => {
        setShowAddToCartModal(false);
      }, 3000);
    } else {
      alert('لطفاً ابتدا وارد حساب کاربری خود شوید');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= currentProduct.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const productImages = [
    currentProduct?.image || '/placeholder-image.jpg',
    currentProduct?.image || '/placeholder-image.jpg',
    currentProduct?.image || '/placeholder-image.jpg'
  ];

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
            <p className="mt-3 text-muted">در حال بارگذاری محصول...</p>
          </motion.div>
        </div>
      </Container>
    );
  }

  if (error || !currentProduct) {
    return (
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="danger" className="mb-4">
            {typeof error === 'string' ? (error || 'محصول یافت نشد') : JSON.stringify(error)}
          </Alert>
          <Button variant="outline-primary" onClick={handleBack} className="rounded-pill">
            <FiArrowLeft className="me-1" />
            بازگشت
          </Button>
        </motion.div>
      </Container>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'var(--bg-primary)' }}>
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="outline-primary"
            onClick={handleBack}
            className="mb-4 rounded-pill"
          >
            <FiArrowLeft className="me-1" />
            بازگشت
          </Button>

          <Row>
            {/* Product Images */}
            <Col lg={6} className="mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="theme-card border-0 shadow-lg overflow-hidden" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div className="position-relative">
                    <motion.div
                      key={selectedImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card.Img
                        variant="top"
                        src={productImages[selectedImage]}
                        alt={currentProduct.title}
                        style={{ height: '400px', objectFit: 'cover' }}
                      />
                    </motion.div>
                    
                    {/* Favorite Button */}
                    <Button
                      variant="link"
                      className="position-absolute top-0 end-0 p-2 text-decoration-none"
                      onClick={handleToggleFavorite}
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FiHeart 
                        size={24} 
                        className={isFavorite ? 'text-danger' : 'text-muted'}
                        style={{
                          fill: isFavorite ? 'currentColor' : 'none'
                        }}
                      />
                    </Button>

                    {/* Share Button */}
                    <Button
                      variant="link"
                      className="position-absolute top-0 start-0 p-2 text-decoration-none"
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FiShare2 size={24} className="text-muted" />
                    </Button>
                  </div>
                </Card>

                {/* Thumbnail Images */}
                <div className="d-flex gap-2 mt-3">
                  {productImages.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`cursor-pointer ${selectedImage === index ? 'border-primary' : ''}`}
                        style={{
                          width: '80px',
                          height: '80px',
                          border: selectedImage === index ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedImage(index)}
                      >
                        <Card.Img
                          src={image}
                          alt={`تصویر ${index + 1}`}
                          style={{ height: '100%', objectFit: 'cover' }}
                        />
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Col>

            {/* Product Info */}
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mb-3">
                  <Badge 
                    className="px-3 py-2 me-2 rounded-pill"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                      fontSize: '0.8rem'
                    }}
                  >
                    {currentProduct.category?.name}
                  </Badge>
                  {!currentProduct.is_in_stock && (
                    <Badge 
                      className="px-3 py-2 rounded-pill"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        fontSize: '0.8rem'
                      }}
                    >
                      ناموجود
                    </Badge>
                  )}
                </div>

                <h1 className="h2 mb-3" style={{ color: 'var(--text-primary)' }}>
                  {currentProduct.title}
                </h1>

                <div className="d-flex align-items-center mb-4">
                  <div className="d-flex align-items-center me-4">
                    <FiStar className="text-warning me-1" size={20} />
                    <span className="fw-semibold me-1" style={{ color: 'var(--text-primary)' }}>
                      {currentProduct.rating}
                    </span>
                    <span className="text-muted">
                      ({currentProduct.rating_count} نظر)
                    </span>
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    <FiTruck className="me-1" />
                    <small>ارسال رایگان</small>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-primary mb-0 fw-bold" style={{ fontSize: '2rem' }}>
                    {currentProduct.price.toLocaleString()} تومان
                  </h3>
                  <small className="text-muted">قیمت نهایی</small>
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  <div className={`d-flex align-items-center p-3 rounded-3 ${currentProduct.is_in_stock ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                    <div className={`rounded-circle p-2 me-3 ${currentProduct.is_in_stock ? 'bg-success' : 'bg-danger'}`}>
                      <FiAward className="text-white" size={16} />
                    </div>
                    <div>
                      <div className={`fw-semibold ${currentProduct.is_in_stock ? 'text-success' : 'text-danger'}`}>
                        {currentProduct.is_in_stock 
                          ? `${currentProduct.stock_quantity} عدد موجود` 
                          : 'ناموجود'
                        }
                      </div>
                      <small className="text-muted">
                        {currentProduct.is_in_stock ? 'آماده ارسال' : 'موجود نیست'}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                {currentProduct.is_in_stock && (
                  <div className="mb-4">
                    <Row className="align-items-center">
                      <Col xs={6}>
                        <label className="form-label fw-semibold" style={{ color: 'var(--text-primary)' }}>
                          تعداد:
                        </label>
                        <div className="d-flex align-items-center border rounded-pill" style={{
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-primary)'
                        }}>
                          <Button
                            variant="link"
                            className="p-2 text-decoration-none"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                          >
                            <FiMinus size={16} />
                          </Button>
                          <Form.Control
                            type="number"
                            min="1"
                            max={currentProduct.stock_quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="border-0 text-center"
                            style={{
                              background: 'transparent',
                              color: 'var(--text-primary)',
                              width: '60px'
                            }}
                          />
                          <Button
                            variant="link"
                            className="p-2 text-decoration-none"
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= currentProduct.stock_quantity}
                          >
                            <FiPlus size={16} />
                          </Button>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="primary"
                            size="lg"
                            className="w-100 rounded-pill py-3"
                            onClick={handleAddToCart}
                            style={{
                              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                              border: 'none',
                              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                            }}
                          >
                            <FiShoppingCart className="me-2" />
                            افزودن به سبد خرید
                          </Button>
                        </motion.div>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Features */}
                <div className="row g-3 mb-4">
                  <div className="col-4">
                    <div className="text-center p-3 rounded-3" style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <FiTruck className="text-primary mb-2" size={24} />
                      <div className="small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                        ارسال رایگان
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center p-3 rounded-3" style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <FiShield className="text-success mb-2" size={24} />
                      <div className="small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                        ضمانت کیفیت
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center p-3 rounded-3" style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <FiAward className="text-warning mb-2" size={24} />
                      <div className="small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                        اصالت کالا
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
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
                    مشاهده سایر محصولات
                    <FiArrowRight className="ms-1" />
                  </Button>
                </div>
              </motion.div>
            </Col>
          </Row>

          {/* Product Details Tabs */}
          <Row className="mt-5">
            <Col lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="theme-card" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Card.Body className="p-4">
                    <Tabs
                      activeKey={activeTab}
                      onSelect={(k) => setActiveTab(k)}
                      className="mb-3"
                    >
                      <Tab eventKey="description" title="توضیحات محصول">
                        <div className="mt-3">
                          <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                            توضیحات کامل
                          </h5>
                          <p className="text-muted lh-lg" style={{ color: 'var(--text-secondary)' }}>
                            {currentProduct.description}
                          </p>
                        </div>
                      </Tab>
                      <Tab eventKey="specifications" title="مشخصات فنی">
                        <div className="mt-3">
                          <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                            مشخصات فنی
                          </h5>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="d-flex justify-content-between py-2 border-bottom">
                                <span className="text-muted">دسته‌بندی:</span>
                                <span style={{ color: 'var(--text-primary)' }}>{currentProduct.category?.name}</span>
                              </div>
                              <div className="d-flex justify-content-between py-2 border-bottom">
                                <span className="text-muted">امتیاز:</span>
                                <span style={{ color: 'var(--text-primary)' }}>{currentProduct.rating}</span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex justify-content-between py-2 border-bottom">
                                <span className="text-muted">موجودی:</span>
                                <span style={{ color: 'var(--text-primary)' }}>{currentProduct.stock_quantity} عدد</span>
                              </div>
                              <div className="d-flex justify-content-between py-2 border-bottom">
                                <span className="text-muted">قیمت:</span>
                                <span style={{ color: 'var(--text-primary)' }}>{currentProduct.price.toLocaleString()} تومان</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="reviews" title="نظرات">
                        <div className="mt-3">
                          <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                            نظرات مشتریان
                          </h5>
                          <div className="text-center py-5">
                            <FiStar size={48} className="text-muted mb-3" />
                            <p className="text-muted">هنوز نظری ثبت نشده است</p>
                          </div>
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

      {/* Add to Cart Success Modal */}
      <Modal
        show={showAddToCartModal}
        onHide={() => setShowAddToCartModal(false)}
        centered
        size="sm"
      >
        <Modal.Body className="text-center p-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15 
            }}
          >
            <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '60px', height: '60px' }}>
              <FiShoppingCart size={24} className="text-white" />
            </div>
            <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              محصول با موفقیت اضافه شد!
            </h5>
            <p className="text-muted mb-3">
              {currentProduct.title} به سبد خرید شما اضافه شد
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setShowAddToCartModal(false)}
                className="rounded-pill"
              >
                بستن
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                className="rounded-pill"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                  border: 'none'
                }}
              >
                مشاهده سبد خرید
              </Button>
            </div>
          </motion.div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductDetail;