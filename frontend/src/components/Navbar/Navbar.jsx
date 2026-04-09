import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from './logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // تحديد إذا كنا في الصفحة الرئيسية أم لا
  const isHomePage = location.pathname === '/';
  
  const navItems = [
    { id: 'home', label: 'الرئيسية', path: '/' },
    { id: 'about', label: 'من نحن', path: '/about' },
    { id: 'categories', label: 'الأقسام', path: '/categories' },
    { id: 'services', label: 'خدماتنا', path: '/services' },
    { id: 'packages', label: 'الباقات', path: '/packages' },
    { id: 'gallery', label: 'النتائج', path: '/gallery' },
    { id: 'doctors', label: 'أطباؤنا', path: '/doctors' },
    { id: 'faq', label: 'الأسئلة الشائعة', path: '/faq' },
    { id: 'device', label: 'الأجهزة', path: '/devices' },
    { id: 'blog', label: 'المدونة', path: '/blog' }
  ];


  // دالة التمرير السلس للأقسام في الصفحة الرئيسية
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // معالج الضغط على الرابط
  const handleNavClick = (item) => {
    if (isHomePage) {
      // في الصفحة الرئيسية: نمرر إلى القسم المطلوب
      scrollToSection(item.id);
    } else {
      // في الصفحات الأخرى: ننتقل باستخدام React Router
      if (item.id === 'home') {
        navigate('/');
      } else {
        navigate(item.path);
      }
    }
    setMobileMenuOpen(false);
  };

  // التحقق من الرابط النشط
  const isActive = (item) => {
    if (isHomePage) {
      // في الصفحة الرئيسية: نتحقق من activeSection
      return activeSection === item.id;
    } else {
      // في الصفحات الأخرى: نتحقق من current path
      if (item.id === 'home') {
        return location.pathname === '/';
      }
      return location.pathname === item.path;
    }
  };

  // مراقبة التمرير لتحديد القسم النشط وتغيير مظهر الـ Navbar
  useEffect(() => {
    const handleScroll = () => {
      // تغيير مظهر الـ Navbar عند التمرير
      setScrolled(window.scrollY > 50);
      
      // فقط في الصفحة الرئيسية نحدد الأقسام النشطة
      if (isHomePage) {
        const sections = ['home', 'about', 'categories', 'services', 'packages', 'gallery', 'doctors', 'faq'];
        const scrollPosition = window.scrollY + 100;
        
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // عند تغيير المسار، نغلق القائمة الجانبية
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // منع التمرير خلف القائمة الجانبية عندما تكون مفتوحة
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.navInner}>
        {/* اللوجو - يضغط عليه يودي للرئيسية */}
        <div 
          className={styles.logoArea} 
          onClick={() => {
            if (location.pathname !== '/') {
              navigate('/');
            } else {
              scrollToSection('home');
            }
            setMobileMenuOpen(false);
          }}
          style={{ cursor: 'pointer' }}
        >
          <img 
            src={logo}
            alt="Rejuvera Clinics" 
            className={styles.logoImg} 
          />
        </div>

        {/* روابط الديسكتوب */}
        <div className={styles.navLinksArea}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`${styles.navLink} ${isActive(item) ? styles.active : ''}`}
            >
              <span>{item.label}</span>
              {isActive(item) && <span className={styles.activeDot} />}
            </button>
          ))}
        </div>

        {/* زر الاتصال */}
        <a href="tel:+966114999959" className={styles.contactPhoneBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
          </svg>
          <span>اتصل بنا</span>
        </a>

        {/* زر القائمة للموبايل */}
        <button 
          className={styles.mobileMenuToggle} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="قائمة الموبايل"
        >
          <div className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* القائمة الجانبية للموبايل */}
      <div className={`${styles.mobileMenuPanel} ${mobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContainer}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`${styles.mobileNavLink} ${isActive(item) ? styles.active : ''}`}
            >
              <span>{item.label}</span>
              {isActive(item) && <span className={styles.mobileActiveDot} />}
            </button>
          ))}
          <a href="tel:+966114999959" className={styles.mobileContactBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
            </svg>
            اتصل بنا الآن
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;