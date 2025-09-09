import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge, InputGroup, Form, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiHeart, FiEye, FiSearch, FiTruck, FiShield, FiAward, FiUsers, FiTrendingUp, FiClock, FiArrowLeft } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { fetchProducts, fetchCategories, syncProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import AnimatedCanvas from '../components/AnimatedCanvas';
import InteractiveCanvas from '../components/InteractiveCanvas';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(syncProducts());
    }
  }, [dispatch, products.length]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setSearchLoading(true);
    setShowSearchModal(true);

    try {
      // Search in products array
      const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredProducts);
    } catch (error) {
      toast.error('خطا در جستجو. لطفاً دوباره تلاش کنید.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (isAuthenticated) {
      dispatch(addToCart({ productId: product.id, quantity: 1 }));
      setAddedProduct(product);
      setShowAddToCartModal(true);
      
      setTimeout(() => {
        setShowAddToCartModal(false);
        setAddedProduct(null);
      }, 3000);
    } else {
      toast.warning('لطفاً ابتدا وارد حساب کاربری خود شوید', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleToggleFavorite = (productId) => {
    setFavoriteProducts(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // Get only first 3 products
  const featuredProducts = products && products.length > 0 ? products.slice(0, 3) : [];

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

  const heroVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Spinner animation="border" size="lg" className="text-primary" />
            <p className="mt-3 text-muted">در حال بارگذاری...</p>
          </motion.div>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero Section with Carousel */}
      <section className="py-5 position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Background Canvas */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
          <AnimatedCanvas 
            width={typeof window !== 'undefined' ? window.innerWidth : 1200} 
            height={400} 
            type="particles"
            className="w-100 h-100"
          />
        </div>
        
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-5"
          >
            <Badge className="mb-3 px-3 py-2" style={{
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
              fontSize: '0.9rem'
            }}>
              🛍️ تکنولا
            </Badge>
            <h1 className="display-4 fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              به
              <span className="text-gradient" style={{
                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                تکنولا
              </span>
              خوش آمدید
            </h1>
            <p className="lead mb-4" style={{ color: 'var(--text-secondary)' }}>
              بهترین محصولات با کیفیت بالا، قیمت مناسب و خدمات عالی
            </p>
            <div className="d-flex justify-content-center gap-4 flex-wrap">
              <div className="d-flex align-items-center text-muted">
                <FiTruck className="me-2" />
                <small>ارسال رایگان</small>
              </div>
              <div className="d-flex align-items-center text-muted">
                <FiShield className="me-2" />
                <small>پرداخت امن</small>
              </div>
              <div className="d-flex align-items-center text-muted">
                <FiAward className="me-2" />
                <small>کیفیت تضمینی</small>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-5"
          >
            <Row className="justify-content-center">
              <Col md={8}>
                <Form onSubmit={handleSearch}>
                  <InputGroup className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="جستجو در محصولات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-end-0 rounded-start-pill"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="border-start-0 rounded-end-pill px-4"
                      style={{
                        background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                        border: 'none'
                      }}
                    >
                      <FiSearch />
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 position-relative" style={{ background: 'var(--bg-secondary)' }}>
        {/* Interactive Canvas */}
        <div className="position-absolute top-0 end-0" style={{ 
          width: '300px', 
          height: '200px', 
          zIndex: 0,
          opacity: 0.3
        }}>
          <InteractiveCanvas 
            width={300} 
            height={200} 
            type="floating"
          />
        </div>
        
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h2 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              چرا ما را انتخاب کنید؟
            </h2>
            <p className="text-muted">خدمات برتر و تجربه خرید منحصر به فرد</p>
          </motion.div>

          <Row className="g-4">
            <Col md={3} sm={6}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-100 border-0 text-center" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Card.Body className="p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <FiTruck size={24} className="text-white" />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      ارسال سریع
                    </h5>
                    <p className="text-muted small mb-0">
                      ارسال رایگان در کمتر از 24 ساعت
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col md={3} sm={6}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-100 border-0 text-center" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Card.Body className="p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <FiShield size={24} className="text-white" />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      پرداخت امن
                    </h5>
                    <p className="text-muted small mb-0">
                      سیستم پرداخت 100% امن و محافظت شده
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col md={3} sm={6}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-100 border-0 text-center" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Card.Body className="p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <FiAward size={24} className="text-white" />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      کیفیت تضمینی
                    </h5>
                    <p className="text-muted small mb-0">
                      محصولات با کیفیت بالا و گارانتی
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col md={3} sm={6}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-100 border-0 text-center" style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)'
                }}>
                  <Card.Body className="p-4">
                    <div className="mb-3" style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <FiUsers size={24} className="text-white" />
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      پشتیبانی 24/7
                    </h5>
                    <p className="text-muted small mb-0">
                      پشتیبانی آنلاین در تمام ساعات روز
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h2 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              محصولات ویژه
            </h2>
            <p className="text-muted">بهترین محصولات انتخاب شده برای شما</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Row>
              {featuredProducts && featuredProducts.length > 0 ? featuredProducts.map((product) => (
                <Col key={product.id} lg={4} md={6} className="mb-4">
                  <motion.div variants={itemVariants}>
                    <Card className="h-100 theme-card position-relative overflow-hidden" style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="position-relative">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card.Img
                            variant="top"
                            src={product.image || '/placeholder-image.jpg'}
                            alt={product.title}
                            style={{ height: '250px', objectFit: 'cover' }}
                          />
                        </motion.div>
                        
                        {/* Favorite Button */}
                        <Button
                          variant="link"
                          className="position-absolute top-0 end-0 p-2 text-decoration-none"
                          onClick={() => handleToggleFavorite(product.id)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FiHeart 
                            size={20} 
                            className={favoriteProducts.has(product.id) ? 'text-danger' : 'text-muted'}
                            style={{
                              fill: favoriteProducts.has(product.id) ? 'currentColor' : 'none'
                            }}
                          />
                        </Button>

                        {/* Stock Badge */}
                        {!product.is_in_stock && (
                          <Badge 
                            className="position-absolute top-0 start-0 m-2"
                            style={{
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              fontSize: '0.75rem'
                            }}
                          >
                            ناموجود
                          </Badge>
                        )}

                        {/* Quick View Button */}
                        <motion.div
                          className="position-absolute bottom-0 start-0 w-100 p-2"
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          style={{
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                          }}
                        >
                          <Link to={`/product/${product.id}`}>
                            <Button
                              variant="light"
                              size="sm"
                              className="w-100 rounded-pill"
                              style={{ opacity: 0.9 }}
                            >
                              <FiEye className="me-1" />
                              مشاهده جزییات
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                      
                      <Card.Body className="d-flex flex-column p-4">
                        <Card.Title className="h6 mb-3" style={{ 
                          height: '2.5rem', 
                          overflow: 'hidden',
                          color: 'var(--text-primary)'
                        }}>
                          {product.title}
                        </Card.Title>
                        
                        <div className="d-flex align-items-center mb-3">
                          <div className="d-flex align-items-center me-3">
                            <FiStar className="text-warning me-1" size={16} />
                            <span className="text-muted small">
                              {product.rating}
                            </span>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="rounded-pill px-2 py-1"
                            style={{
                              background: 'var(--bg-tertiary)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.7rem'
                            }}
                          >
                            {product.category?.name}
                          </Badge>
                        </div>
                        
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="h5 text-primary mb-0 fw-bold">
                              {product.price.toLocaleString()} تومان
                            </span>
                          </div>
                          
                          <div className="d-flex gap-2">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-grow-1"
                            >
                              <Button
                                variant="primary"
                                size="sm"
                                className="w-100 rounded-pill py-2"
                                onClick={() => handleAddToCart(product)}
                                disabled={!product.is_in_stock || loading}
                                style={{
                                  background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                                  border: 'none',
                                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                                }}
                              >
                                <FiShoppingCart className="me-2" />
                                {loading ? 'در حال اضافه کردن...' : 'افزودن به سبد'}
                              </Button>
                            </motion.div>
                            
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Link to={`/product/${product.id}`}>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="rounded-pill py-2 px-3"
                                  style={{
                                    border: '1px solid var(--primary-color)',
                                    color: 'var(--primary-color)',
                                    background: 'transparent'
                                  }}
                                >
                                  <FiEye size={16} />
                                </Button>
                              </Link>
                            </motion.div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              )) : (
                <Col>
                  <div className="text-center py-5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FiShoppingCart size={64} className="text-muted mb-3" />
                      <p className="text-muted">در حال بارگذاری محصولات...</p>
                    </motion.div>
                  </div>
                </Col>
              )}
            </Row>

            {featuredProducts && featuredProducts.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-5"
              >
                <FiSearch size={64} className="text-muted mb-3" />
                <p className="text-muted">محصولی یافت نشد</p>
              </motion.div>
            )}
          </motion.div>

          {/* View All Products Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-5"
          >
            <Link to="/products">
              <Button
                variant="outline-primary"
                size="lg"
                className="rounded-pill px-5 py-3"
                style={{
                  border: '2px solid var(--primary-color)',
                  color: 'var(--primary-color)',
                  background: 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--primary-color)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--primary-color)';
                }}
              >
                مشاهده همه محصولات
                <FiArrowLeft className="me-2" />
              </Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 position-relative" style={{ 
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
        borderTop: '1px solid var(--border-color)'
      }}>
        {/* Background Canvas */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
          <AnimatedCanvas 
            width={typeof window !== 'undefined' ? window.innerWidth : 1200} 
            height={300} 
            type="geometric"
            className="w-100 h-100"
          />
        </div>
        
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <Row className="g-4 text-center">
            <Col md={3} sm={6}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
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
                  <FiUsers size={32} className="text-white" />
                </div>
                <h3 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  10,000+
                </h3>
                <p className="text-muted mb-0">مشتری راضی</p>
              </motion.div>
            </Col>

            <Col md={3} sm={6}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3" style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <FiShoppingCart size={32} className="text-white" />
                </div>
                <h3 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  50,000+
                </h3>
                <p className="text-muted mb-0">سفارش موفق</p>
              </motion.div>
            </Col>

            <Col md={3} sm={6}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3" style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <FiTrendingUp size={32} className="text-white" />
                </div>
                <h3 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  99%
                </h3>
                <p className="text-muted mb-0">رضایت مشتری</p>
              </motion.div>
            </Col>

            <Col md={3} sm={6}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3" style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <FiClock size={32} className="text-white" />
                </div>
                <h3 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  24/7
                </h3>
                <p className="text-muted mb-0">پشتیبانی</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search Results Modal */}
      <Modal
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ 
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <Modal.Title style={{ color: 'var(--text-primary)' }}>
            نتایج جستجو برای: "{searchTerm}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          background: 'var(--bg-primary)',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          {searchLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" className="text-primary" />
              <p className="mt-3 text-muted">در حال جستجو...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <Row>
              {searchResults.map((product) => (
                <Col key={product.id} md={6} className="mb-4">
                  <Card className="h-100 theme-card" style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={product.image || '/placeholder-image.jpg'}
                        alt={product.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      {!product.is_in_stock && (
                        <Badge 
                          className="position-absolute top-0 start-0 m-2"
                          style={{
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            fontSize: '0.75rem'
                          }}
                        >
                          ناموجود
                        </Badge>
                      )}
                    </div>
                    
                    <Card.Body className="d-flex flex-column p-3">
                      <Card.Title className="h6 mb-2" style={{ 
                        color: 'var(--text-primary)',
                        height: '2.5rem',
                        overflow: 'hidden'
                      }}>
                        {product.title}
                      </Card.Title>
                      
                      <div className="d-flex align-items-center mb-2">
                        <div className="d-flex align-items-center me-2">
                          <FiStar className="text-warning me-1" size={14} />
                          <span className="text-muted small">
                            {product.rating}
                          </span>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="rounded-pill px-2 py-1"
                          style={{
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.7rem'
                          }}
                        >
                          {product.category?.name}
                        </Badge>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="h6 text-primary mb-0 fw-bold">
                            {product.price.toLocaleString()} تومان
                          </span>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-grow-1"
                          >
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-100 rounded-pill py-2"
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.is_in_stock}
                              style={{
                                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                                border: 'none'
                              }}
                            >
                              <FiShoppingCart className="me-1" size={14} />
                              افزودن به سبد
                            </Button>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link to={`/product/${product.id}`}>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="rounded-pill py-2 px-3"
                                style={{
                                  border: '1px solid var(--primary-color)',
                                  color: 'var(--primary-color)',
                                  background: 'transparent'
                                }}
                              >
                                <FiEye size={14} />
                              </Button>
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <FiSearch size={64} className="text-muted mb-3" />
              <h5 className="text-muted">محصولی یافت نشد</h5>
              <p className="text-muted">لطفاً کلمات کلیدی دیگری امتحان کنید</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

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
              {addedProduct?.title} به سبد خرید شما اضافه شد
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
              <Link to="/cart">
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
              </Link>
            </div>
          </motion.div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;