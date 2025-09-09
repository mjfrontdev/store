import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Alert, Badge, Dropdown, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiStar, FiHeart, FiEye, FiFilter, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { fetchProducts, fetchCategories, setFilters } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import AnimatedCanvas from '../components/AnimatedCanvas';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, categories, loading, error, filters } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [favoriteProducts, setFavoriteProducts] = useState(new Set());

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    // Don't refetch, just filter locally
  };

  const handleCategoryFilter = (categoryId) => {
    dispatch(setFilters({ category: categoryId }));
    // Don't refetch, just filter locally
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    dispatch(setFilters({ sort: sortType }));
    // Apply sorting locally
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
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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

  // Use products directly if no filters are applied
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    
    let filtered = [...products]; // Create a copy
    
    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(product => 
        product.category?.id === parseInt(filters.category)
      );
    }
    
    // Apply price filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    return filtered;
  }, [products, searchTerm, filters.category, priceRange]);


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
            height={300} 
            type="particles"
            className="w-100 h-100"
          />
        </div>
        
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-3 px-3 py-2" style={{
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
              fontSize: '0.9rem'
            }}>
              🛍️ محصولات
            </Badge>
            <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              همه محصولات
            </h1>
            <p className="lead" style={{ color: 'var(--text-secondary)' }}>
              {filteredProducts.length} محصول موجود
            </p>
          </motion.div>
        </Container>
      </section>

      <Container className="py-5">
        <Row>
          {/* Sidebar Filters */}
          <Col lg={3} className="mb-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="theme-card" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                position: 'sticky',
                top: '20px'
              }}>
                <Card.Header className="bg-transparent border-0 pb-0">
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                    <FiFilter className="me-2" />
                    فیلترها
                  </h5>
                </Card.Header>
                <Card.Body>
                  {/* Search */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: 'var(--text-primary)' }}>
                      جستجو
                    </label>
                    <Form onSubmit={handleSearch}>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="نام محصول..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)'
                          }}
                        />
                        <Button type="submit" variant="outline-primary">
                          <FiSearch />
                        </Button>
                      </InputGroup>
                    </Form>
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: 'var(--text-primary)' }}>
                      دسته‌بندی
                    </label>
                    <div className="d-flex flex-column gap-2">
                      <Button
                        variant={filters.category === '' ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => handleCategoryFilter('')}
                        className="text-start rounded-pill"
                        style={{
                          background: filters.category === '' ? 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))' : 'transparent',
                          border: '1px solid var(--primary-color)',
                          color: filters.category === '' ? 'white' : 'var(--primary-color)'
                        }}
                      >
                        همه دسته‌ها
                      </Button>
                      {categories && categories.length > 0 ? categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={filters.category === category.id ? 'primary' : 'outline-primary'}
                          size="sm"
                          onClick={() => handleCategoryFilter(category.id)}
                          className="text-start rounded-pill"
                          style={{
                            background: filters.category === category.id ? 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))' : 'transparent',
                            border: '1px solid var(--primary-color)',
                            color: filters.category === category.id ? 'white' : 'var(--primary-color)'
                          }}
                        >
                          {category.name}
                        </Button>
                      )) : null}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: 'var(--text-primary)' }}>
                      محدوده قیمت
                    </label>
                    <div className="px-2">
                      <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="1000000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        style={{
                          background: 'var(--bg-primary)'
                        }}
                      />
                      <div className="d-flex justify-content-between mt-2">
                        <small className="text-muted">{priceRange[0].toLocaleString()} تومان</small>
                        <small className="text-muted">{priceRange[1].toLocaleString()} تومان</small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Products Grid */}
          <Col lg={9}>
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="d-flex justify-content-between align-items-center mb-4"
            >
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted">
                  {filteredProducts.length} محصول
                </span>
                <div className="d-flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-pill"
                  >
                    <FiGrid />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-pill"
                  >
                    <FiList />
                  </Button>
                </div>
              </div>
              
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" size="sm" className="rounded-pill">
                  <FiChevronDown className="me-2" />
                  مرتب‌سازی
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSort('name')}>
                    نام (الف-ی)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('-name')}>
                    نام (ی-الف)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('price')}>
                    قیمت (کم به زیاد)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('-price')}>
                    قیمت (زیاد به کم)
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSort('-rating')}>
                    امتیاز
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </motion.div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="danger" className="mb-4">
                    {typeof error === 'string' ? error : JSON.stringify(error)}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            {loading && (
              <div className="text-center py-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Spinner animation="border" size="lg" className="text-primary" />
                  <p className="mt-3 text-muted">در حال بارگذاری محصولات...</p>
                </motion.div>
              </div>
            )}


            {/* Products Grid */}
            {!loading && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Row>
                  {(filteredProducts.length > 0 ? filteredProducts : products || []).map((product) => (
                  <Col 
                    key={product.id} 
                    lg={viewMode === 'grid' ? 4 : 12} 
                    md={viewMode === 'grid' ? 6 : 12} 
                    className="mb-4"
                  >
                    <motion.div variants={itemVariants}>
                      <Card className={`h-100 theme-card position-relative overflow-hidden ${viewMode === 'list' ? 'd-flex flex-row' : ''}`} style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        transition: 'all 0.3s ease'
                      }}>
                        <div className={`position-relative ${viewMode === 'list' ? 'flex-shrink-0' : ''}`} style={{ width: viewMode === 'list' ? '200px' : '100%' }}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card.Img
                              variant="top"
                              src={product.image || '/placeholder-image.jpg'}
                              alt={product.title}
                              style={{ 
                                height: viewMode === 'list' ? '200px' : '200px', 
                                objectFit: 'cover',
                                width: viewMode === 'list' ? '200px' : '100%'
                              }}
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
                        </div>
                        
                        <Card.Body className={`d-flex flex-column p-4 ${viewMode === 'list' ? 'flex-grow-1' : ''}`}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Card.Title className="h6 mb-0" style={{ 
                              color: 'var(--text-primary)',
                              height: viewMode === 'list' ? 'auto' : '2.5rem',
                              overflow: 'hidden'
                            }}>
                              {product.title}
                            </Card.Title>
                            <Link to={`/product/${product.id}`} className="text-decoration-none">
                              <Button variant="link" size="sm" className="p-0">
                                <FiEye />
                              </Button>
                            </Link>
                          </div>
                          
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
                            
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant="primary"
                                size="sm"
                                className={`${viewMode === 'list' ? 'w-auto px-4' : 'w-100'} rounded-pill py-2`}
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
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
                </Row>

                {(filteredProducts.length === 0 && products && products.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-5"
                  >
                    <FiSearch size={64} className="text-muted mb-3" />
                    <p className="text-muted">محصولی با فیلترهای فعلی یافت نشد</p>
                    <p className="text-muted small mb-3">
                      {products.length} محصول موجود است اما با فیلترهای فعلی مطابقت ندارد
                    </p>
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        setSearchTerm('');
                        setPriceRange([0, 1000000]);
                        dispatch(setFilters({ search: '', category: '' }));
                      }}
                      className="mt-3"
                    >
                      پاک کردن فیلترها
                    </Button>
                  </motion.div>
                )}
                
                {(!products || products.length === 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-5"
                  >
                    <FiSearch size={64} className="text-muted mb-3" />
                    <p className="text-muted">هیچ محصولی موجود نیست</p>
                    <Button 
                      variant="primary" 
                      onClick={() => dispatch(fetchProducts())}
                      className="mt-3"
                    >
                      بارگذاری مجدد
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </Col>
        </Row>
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
              <Button 
                variant="primary" 
                size="sm"
                className="rounded-pill"
                onClick={() => {
                  setShowAddToCartModal(false);
                  navigate('/cart');
                }}
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

export default Products;