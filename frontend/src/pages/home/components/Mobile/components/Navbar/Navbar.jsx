import React from 'react';
import styles from './Navbar.module.css';
import logo from './logo.png';
const Navbar = ({ scrolled, mobileMenuOpen, activeSection, scrollToSection, setMobileMenuOpen,data }) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'about', label: 'من نحن' },
    { id: 'categories', label: 'الأقسام' },
    { id: 'services', label: 'خدماتنا' },
    { id: 'packages', label: 'الباقات' },
    { id: 'gallery', label: 'النتائج' },
    { id: 'doctors', label: 'أطباؤنا' },
    { id: 'faq', label: 'الأسئلة الشائعة' }
  ];

 
  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
      <div className={styles.navInner}>
        {/* اللوجو */}
        <div className={styles.logoArea}>
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
              onClick={() => scrollToSection(item.id)}
              className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
            >
              <span>{item.label}</span>
              {activeSection === item.id && <span className={styles.activeDot} />}
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
              onClick={() => handleNavClick(item.id)}
              className={`${styles.mobileNavLink} ${activeSection === item.id ? styles.active : ''}`}
            >
              <span>{item.label}</span>
              {activeSection === item.id && <span className={styles.mobileActiveDot} />}
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