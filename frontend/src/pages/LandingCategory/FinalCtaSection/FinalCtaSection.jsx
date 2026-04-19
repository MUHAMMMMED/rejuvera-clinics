import { Calendar, CheckCircle2, ChevronDown, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
 
import AxiosInstance from '../../../components/Authentication/AxiosInstance';
import { GTMEvents } from '../../../hooks/useGTM';
import styles from './FinalCtaSection.module.css';

const FinalCtaSection = ({ data }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    message: '',
    selectedService: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('source') || '',
      campaign: params.get('campaign') || '',
    };
  };

  // Get services from data prop (handle both array and object)
  let services = [];
  let categoryId = null;
  let categoryName = null;

  if (Array.isArray(data)) {
    services = data;
  } else if (data && Array.isArray(data.services)) {
    services = data.services;
    categoryId = data.id;
    categoryName = data.name;
  }

  // ✅ GTM: ظهور قسم الحجز (form_view)
  useEffect(() => {
    if (categoryId && categoryName) {
      GTMEvents.viewContent('final_cta_section', 'قسم الحجز النهائي', 'form_view');
    }
  }, [categoryId, categoryName]);

  // Auto-hide modal after 5 seconds
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, selectedService: service.name });
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      GTMEvents.viewContent('booking_error', 'محاولة حجز - حقول ناقصة', 'form_error');
      return;
    }

    if (!formData.selectedService) {
      setError('يرجى اختيار الخدمة المطلوبة');
      GTMEvents.viewContent('booking_error', 'محاولة حجز - لم يتم اختيار خدمة', 'form_error');
      return;
    }
    
    setLoading(true);
    setError('');
  
    const { source, campaign } = getUrlParams();

    // Find selected service object to get its ID
    const selectedServiceObj = services.find(s => s.name === formData.selectedService);
    const serviceId = selectedServiceObj?.id;
  
    if (!serviceId) {
      setError('حدث خطأ في اختيار الخدمة، يرجى المحاولة مرة أخرى');
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
      message: `${formData.message}\n\nالخدمة المطلوبة: ${formData.selectedService}`,
      item_type: 's',
      service_id: serviceId,
      ...(source && { source }),
      ...(campaign && { campaign }),
    };
  
    try {
      await AxiosInstance.post('home/appointments/new/', payload);
  
      GTMEvents.bookingSuccess(serviceId, formData.selectedService, 's');

      setSubmitted(true);
      setShowModal(true);
  
    } catch (err) {
      console.error('Booking error:', err);
      setError(
        err?.response?.data?.error ||
        'تعذر الاتصال بالخادم، حاولي مرة أخرى'
      );
      GTMEvents.viewContent('booking_server_error', 'خطأ في الخادم أثناء الحجز', 'server_error');
    } finally {
      setLoading(false);
    }
  };

  // Debug logging
  console.log('Services in FinalCtaSection:', services);
  console.log('Number of services:', services.length);

  return (
    <section id="booking" className={styles.finalCtaSection}>
      <div className={styles.container}>
        {/* Centered Modal Popup */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
              <div className={styles.modalContent}>
                <button 
                  className={styles.modalClose}
                  onClick={() => setShowModal(false)}
                  aria-label="إغلاق"
                >
                  <X size={20} />
                </button>
                
                <div className={styles.modalIcon}>
                  <div className={styles.checkmarkCircle}>
                    <CheckCircle2 size={56} />
                  </div>
                </div>
                
                <h3 className={styles.modalTitle}>تم استلام طلبك بنجاح! 🎉</h3>
                
                <p className={styles.modalMessage}>
                  شكراً لك على ثقتك بنا. سيتم التواصل معك خلال <strong>٢٤ ساعة</strong> لتأكيد موعد الاستشارة لخدمة <strong>{formData.selectedService}</strong>
                </p>
                
                <div className={styles.modalDetails}>
                  <div className={styles.modalDetailItem}>
                    <Sparkles size={16} />
                    <span>تأكيد فوري لطلبك</span>
                  </div>
                  <div className={styles.modalDetailItem}>
                    <Sparkles size={16} />
                    <span>متخصصون ينتظرونك</span>
                  </div>
                </div>
                
                <button 
                  className={styles.modalButton}
                  onClick={() => setShowModal(false)}
                >
                  حسناً
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.finalCtaWrapper}>
          <div className={styles.finalCtaContent}>
            <h2>ابدئي رحلة تحولك اليوم</h2>
            <p>احجزي استشارتك واحصلي على خطة علاجية مخصصة لحالتك</p>
            <div className={styles.finalCtaBenefits}>
              <div><CheckCircle2 size={18} /> استشارة طبية</div>
              <div><CheckCircle2 size={18} /> تقييم شامل للحالة</div>
              <div><CheckCircle2 size={18} /> خطة علاجية مخصصة</div>
              <div><CheckCircle2 size={18} /> عروض حصرية للحجز المبكر</div>
            </div>
          </div>

          {!submitted ? (
            <form className={styles.bookingForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <input
                  type="tel"
                  placeholder="رقم الجوال"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              {/* Service Selection Dropdown */}
              <div className={styles.formGroup} ref={dropdownRef}>
                <div className={styles.customSelect}>
                  <button
                    type="button"
                    className={styles.selectTrigger}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <span className={formData.selectedService ? styles.selectedValue : styles.placeholder}>
                      {formData.selectedService || 'اختر الخدمة المطلوبة'}
                    </span>
                    <ChevronDown size={18} className={`${styles.selectIcon} ${isDropdownOpen ? styles.rotated : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className={styles.dropdownMenu} role="listbox">
                      {services.length > 0 ? (
                        services.map((service) => (
                          <div
                            key={service.id}
                            className={styles.dropdownItem}
                            onClick={() => handleServiceSelect(service)}
                            role="option"
                            aria-selected={formData.selectedService === service.name}
                          >
                            <span>{service.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className={styles.noResults}>لا توجد خدمات متاحة</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <textarea
                  placeholder="رسالة إضافية (اختياري)"
                  rows="3"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                <Calendar size={18} />
                {loading ? 'جاري الإرسال...' : 'احجزي استشارتك الآن'}
              </button>
            </form>
          ) : (
            <div className={styles.successMessage}>
              <CheckCircle2 size={48} />
              <h3>تم استلام طلبك بنجاح!</h3>
              <p>سيتم التواصل معك خلال ٢٤ ساعة لتأكيد موعد الاستشارة لخدمة {formData.selectedService}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;