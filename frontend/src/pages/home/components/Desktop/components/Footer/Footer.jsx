import React from 'react';
import styles from './Footer.module.css';
import logo from './logo.png';
const Footer = ({ scrollToSection, setSelectedService }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <img src={logo} alt="Rejuvera" className={styles.logo} />
            <p className={styles.description}>
              نلتزم بتقديم أعلى معايير الرفاهية والجودة في كل خطوة من رحلتك العلاجية، لضمان تجربة تجميلية آمنة ومريحة تلي تطلعاتك.
            </p>
            {/* <div className={styles.paymentMethods}>
              <div className={styles.paymentBadge}>
                <img src="https://rejuvera-clinics.vercel.app/images/Tabby.png" alt="Tabby" />
              </div>
              <div className={styles.paymentBadge}>
                <img src="https://rejuvera-clinics.vercel.app/images/Tamara.png" alt="Tamara" />
              </div>
              <div className={styles.paymentBadge}>
                <img src="https://rejuvera-clinics.vercel.app/images/Emkan.png" alt="Emkan" />
              </div>
            </div> */}
          </div>
          <div className={styles.links}>
            <h4>روابط سريعة</h4>
            <ul>
              <li><button onClick={() => scrollToSection('home')}>الرئيسية</button></li>
              <li><button onClick={() => scrollToSection('categories')}>الأقسام</button></li>
              <li><button onClick={() => scrollToSection('services')}>خدماتنا</button></li>
              <li><button onClick={() => scrollToSection('packages')}>الباقات</button></li>
              <li><button onClick={() => scrollToSection('gallery')}>النتائج</button></li>
              <li><button onClick={() => scrollToSection('doctors')}>أطباؤنا</button></li>
            </ul>
          </div>
          <div className={styles.links}>
            <h4>أبرز الخدمات</h4>
            <ul>
              <li><button onClick={() => { setSelectedService('جراحة التجميل'); scrollToSection('services'); }}>جراحة التجميل ونحت القوام</button></li>
              <li><button onClick={() => { setSelectedService('الجلدية والتجميل'); scrollToSection('services'); }}>الجلدية والعناية بالبشرة</button></li>
              <li><button onClick={() => { setSelectedService('ليزر إزالة الشعر'); scrollToSection('services'); }}>إزالة الشعر بالليزر</button></li>
              <li><button onClick={() => { setSelectedService('التجميل النسائي'); scrollToSection('services'); }}>الطب التجميلي النسائي</button></li>
            </ul>
          </div>
          <div className={styles.social}>
            <h4>تواصل معنا</h4>
            <div className={styles.icons}>
              <a href="tel:+966114999959" aria-label="Phone" className={styles.icon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                </svg>
              </a>
              <a href="https://www.instagram.com/rejuveracenter/" target="_blank" rel="noreferrer" className={styles.icon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://x.com/rejuveraclinics" target="_blank" rel="noreferrer" className={styles.icon}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://maps.app.goo.gl/QmnDGj3QMrL7sFDT6" target="_blank" rel="noreferrer" className={styles.icon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© 2026 Rejuvera Clinics. جميع الحقوق محفوظة.</p>
          <div className={styles.legal}>
            <button>سياسة الخصوصية</button>
            <button>الشروط والأحكام</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;