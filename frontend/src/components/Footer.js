import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiHeart, FiGithub, FiExternalLink } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer position-relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Background Pattern */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }}></div>
      
      <Container className="position-relative py-5">
        <Row>
          <Col md={4} className="mb-4">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-3 me-3 shadow-lg">
                <span className="text-white fw-bold fs-3">🛍️</span>
              </div>
              <div>
                <h4 className="mb-0 fw-bold text-white">تکنولا</h4>
                <small className="text-light opacity-75">تجربه خرید مدرن</small>
              </div>
            </div>
            <p className="text-light opacity-90 lh-lg mb-4">
              تکنولا، فروشگاه آنلاین مدرن با استفاده از جدیدترین تکنولوژی‌ها برای ارائه بهترین تجربه خرید. 
              ما متعهد به ارائه محصولات با کیفیت و خدمات عالی هستیم.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" className="social-link text-light text-decoration-none d-flex align-items-center justify-content-center rounded-circle" style={{
                width: '45px', height: '45px', 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}>
                <FiFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="social-link text-light text-decoration-none d-flex align-items-center justify-content-center rounded-circle" style={{
                width: '45px', height: '45px', 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}>
                <FiTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="social-link text-light text-decoration-none d-flex align-items-center justify-content-center rounded-circle" style={{
                width: '45px', height: '45px', 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}>
                <FiInstagram size={20} />
              </a>
            </div>
          </Col>
          
          <Col md={4} className="mb-4">
            <h5 className="mb-4 fw-bold text-white d-flex align-items-center">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 rounded-circle p-2 me-3" style={{width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                🔗
              </span>
              لینک‌های مفید
            </h5>
            <div className="row g-3">
              <div className="col-6">
                <a href="/" className="footer-link text-light text-decoration-none d-flex align-items-center p-2 rounded" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  <span className="me-2">🏠</span> خانه
                </a>
              </div>
              <div className="col-6">
                <a href="/products" className="footer-link text-light text-decoration-none d-flex align-items-center p-2 rounded" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  <span className="me-2">📱</span> محصولات
                </a>
              </div>
              <div className="col-6">
                <a href="/about" className="footer-link text-light text-decoration-none d-flex align-items-center p-2 rounded" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  <span className="me-2">ℹ️</span> درباره ما
                </a>
              </div>
              <div className="col-6">
                <a href="/contact" className="footer-link text-light text-decoration-none d-flex align-items-center p-2 rounded" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  <span className="me-2">📞</span> تماس با ما
                </a>
              </div>
            </div>
          </Col>
          
          <Col md={4} className="mb-4">
            <h5 className="mb-4 fw-bold text-white d-flex align-items-center">
              <span className="bg-gradient-to-r from-pink-400 to-red-500 rounded-circle p-2 me-3" style={{width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                📞
              </span>
              تماس با ما
            </h5>
            <div className="space-y-3">
              <div className="d-flex align-items-center p-3 rounded-3" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-circle p-2 me-3">
                  <FiMail className="text-white" size={18} />
                </div>
                <div>
                  <div className="text-white fw-semibold">ایمیل</div>
                  <div className="text-light opacity-75 small">info@store.com</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center p-3 rounded-3" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-circle p-2 me-3">
                  <FiPhone className="text-white" size={18} />
                </div>
                <div>
                  <div className="text-white fw-semibold">تلفن</div>
                  <div className="text-light opacity-75 small">+98 21 1234 5678</div>
                </div>
              </div>
              
              <div className="d-flex align-items-center p-3 rounded-3" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-circle p-2 me-3">
                  <FiMapPin className="text-white" size={18} />
                </div>
                <div>
                  <div className="text-white fw-semibold">آدرس</div>
                  <div className="text-light opacity-75 small">تهران، ایران</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        <hr className="my-5" style={{borderColor: 'rgba(255, 255, 255, 0.1)'}} />
        
        {/* Developer Info Section */}
        <Row className="mb-4">
          <Col className="text-center">
            <div className="p-4 rounded-3" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h5 className="text-white fw-bold mb-3">طراحی شده توسط محمد حسن مجیدیان خراسانی</h5>
              
              <div className="d-flex justify-content-center gap-4 mb-3 flex-wrap">
                <a 
                  href="https://github.com/mjfrontdev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="d-flex align-items-center text-light text-decoration-none p-2 rounded"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <FiGithub className="me-2" size={18} />
                  GitHub: mjfrontdev
                </a>
                
                <a 
                  href="https://t.me/mmd500220" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="d-flex align-items-center text-light text-decoration-none p-2 rounded"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <span className="me-2">📱</span>
                  تلگرام: @mmd500220
                </a>
              </div>
              
              <div className="mt-3">
                <p className="text-light opacity-75 mb-2">برای خدمات طراحی سایت</p>
                <a 
                  href="https://mohammadmjaidiankhorasani.ir" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="d-inline-flex align-items-center text-primary text-decoration-none fw-bold"
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(99, 102, 241, 0.2)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <FiExternalLink className="me-2" size={16} />
                  mohammadmjaidiankhorasani.ir
                </a>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-light opacity-75 mb-0">
              © ۱۴۰۴ تکنولا. تمامی حقوق محفوظ است.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-light opacity-75 mb-0 d-flex align-items-center justify-content-md-end">
              ساخته شده با <FiHeart className="text-red-500 mx-1" /> در ایران
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;