// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api';
import '../pagescss/landingpage.css';

const LandingPage = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({
    loginUsername: '',
    loginPassword: '',
    signupUsername: '',
    signupEmail: '',
    signupPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    if (loggedIn === 'true' && username) {
      navigate('/home');
    }
  }, [navigate]);

  const openModal = (modalType) => {
    setActiveModal(modalType);
    setError('');
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormData({
      loginUsername: '',
      loginPassword: '',
      signupUsername: '',
      signupEmail: '',
      signupPassword: ''
    });
    setError('');
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateLogin = () => {
    if (!formData.loginUsername.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.loginPassword.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!formData.signupUsername.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.signupUsername.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (!formData.signupEmail.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.signupEmail)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.signupPassword.trim()) {
      setError('Password is required');
      return false;
    }
    if (formData.signupPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateLogin()) return;

    setLoading(true);

    try {
      const data = await login({
        username: formData.loginUsername,
        password: formData.loginPassword
      });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userEmail', data.user.email);

      closeModal();
      navigate('/home');

    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;
        if (status === 401) {
          setError(data.error || 'Invalid username or password');
        } else if (status === 400) {
          setError(data.error || 'Invalid request data');
        } else {
          setError(data.error || data.message || `Login failed with status ${status}`);
        }
      } else if (err.request) {
        // Network error
        setError('Cannot connect to the server. Please ensure the backend is running on http://localhost:8081.');
      } else {
        setError(err.message || 'An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateSignup()) return;

    setLoading(true);

    try {
      const data = await signup({
        username: formData.signupUsername,
        email: formData.signupEmail,
        password: formData.signupPassword
      });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userEmail', data.user.email);

      closeModal();
      navigate('/home');

    } catch (err) {
      console.error('Signup error:', err);
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const data = err.response.data;
        if (status === 400) {
          setError(data.error || 'Invalid registration data');
        } else if (status === 409) {
          setError(data.error || 'User already exists');
        } else {
          setError(data.error || data.message || `Signup failed with status ${status}`);
        }
      } else if (err.request) {
        // Network error
        setError('Cannot connect to the server. Please ensure the backend is running on http://localhost:8081.');
      } else {
        setError(err.message || 'An error occurred during signup');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  // Rest of the JSX remains unchanged
  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <div className="nav-container">
            <div className="logo">
              <i className="fas fa-dumbbell"></i>
              FitTrack
            </div>
            <ul className="nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
            <div className="auth-buttons">
              <button className="login-btn" onClick={() => openModal('login')}>Login</button>
              <button className="signup-btn" onClick={() => openModal('signup')}>Sign Up</button>
            </div>
          </div>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="container">
          <h1>Transform Your Fitness Journey</h1>
          <p>Track your workouts, monitor your progress, and achieve your fitness goals with our comprehensive fitness tracking platform.</p>
          <button className="cta-button" onClick={() => openModal('signup')}>Start Your Journey Today</button>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Fitness Tracking" />
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <div className="section-title">
            <h2>Powerful Features</h2>
            <p>Everything you need to achieve your fitness goals in one comprehensive platform.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Progress Tracking</h3>
              <p>Monitor your fitness journey with detailed analytics and progress reports.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-dumbbell"></i>
              </div>
              <h3>Workout Plans</h3>
              <p>Access personalized workout plans designed by certified fitness experts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Nutrition Guide</h3>
              <p>Get customized meal plans and nutrition advice to complement your workouts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community Support</h3>
              <p>Connect with like-minded fitness enthusiasts for motivation and support.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile App</h3>
              <p>Track your fitness on the go with our user-friendly mobile application.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <h3>Achievement System</h3>
              <p>Earn badges and rewards as you reach your fitness milestones.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>Success Stories</h2>
            <p>Hear from our community of fitness enthusiasts who have transformed their lives.</p>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="testimonial-text">
                "FitTrack completely transformed my fitness routine. I've lost 20 pounds in 3 months thanks to their personalized plans!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah Johnson" />
                </div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>Fitness Enthusiast</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-text">
                "The progress tracking features are incredible. I can see exactly how I'm improving week by week."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Michael Chen" />
                </div>
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <p>Marathon Runner</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-text">
                "As a busy professional, the mobile app makes it so easy to stay on track with my fitness goals."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Emily Rodriguez" />
                </div>
                <div className="author-info">
                  <h4>Emily Rodriguez</h4>
                  <p>Marketing Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="container">
          <div className="section-title">
            <h2>About FitTrack</h2>
            <p>Learn more about our mission and what makes us different</p>
          </div>
          <div className="about-content">
            <div className="about-text">
              <h3>Our Mission</h3>
              <p>At FitTrack, we believe that everyone deserves to live a healthy, active lifestyle. Our mission is to make fitness tracking accessible, intuitive, and motivating for people of all fitness levels.</p>
              
              <h3>Why Choose Us?</h3>
              <ul className="about-list">
                <li><i className="fas fa-check"></i> Comprehensive fitness tracking</li>
                <li><i className="fas fa-check"></i> Personalized workout plans</li>
                <li><i className="fas fa-check"></i> Expert nutrition guidance</li>
                <li><i className="fas fa-check"></i> Supportive community</li>
                <li><i className="fas fa-check"></i> Regular feature updates</li>
              </ul>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Fitness Community" />
            </div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>FitTrack</h3>
              <p>Your personal fitness companion for tracking workouts, monitoring progress, and achieving goals.</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#about">About Us</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Support</h3>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Newsletter</h3>
              <p>Subscribe to our newsletter for the latest updates and fitness tips.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email address" required />
                <button type="button">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2023 FitTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {activeModal === 'login' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Login to Your Account</h2>
              <button className="close-modal" onClick={closeModal} disabled={loading}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="loginUsername">Username</label>
                  <input
                    type="text"
                    id="loginUsername"
                    name="loginUsername"
                    className="form-control"
                    value={formData.loginUsername}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loginPassword">Password</label>
                  <input
                    type="password"
                    id="loginPassword"
                    name="loginPassword"
                    className="form-control"
                    value={formData.loginPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <div className="form-footer">
                <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); openModal('signup'); }}>Sign up here</a></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'signup' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Your Account</h2>
              <button className="close-modal" onClick={closeModal} disabled={loading}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSignup}>
                <div className="form-group">
                  <label htmlFor="signupUsername">Username</label>
                  <input
                    type="text"
                    id="signupUsername"
                    name="signupUsername"
                    className="form-control"
                    value={formData.signupUsername}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    minLength="3"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupEmail">Email</label>
                  <input
                    type="email"
                    id="signupEmail"
                    name="signupEmail"
                    className="form-control"
                    value={formData.signupEmail}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signupPassword">Password</label>
                  <input
                    type="password"
                    id="signupPassword"
                    name="signupPassword"
                    className="form-control"
                    value={formData.signupPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    minLength="6"
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>
              <div className="form-footer">
                <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); openModal('login'); }}>Login here</a></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;