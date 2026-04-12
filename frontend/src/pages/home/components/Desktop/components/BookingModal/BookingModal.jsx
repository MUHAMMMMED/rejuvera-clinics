import { Briefcase, Calendar, CheckCircle2, MessageCircle, Package, Phone, Sparkles, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../../../../components/Authentication/AxiosInstance';
import styles from './BookingModal.module.css';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  itemId, 
  itemType, 
  itemName,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('source') || '',
      campaign: params.get('campaign') || '',
    };
  };

  // Check screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-hide success modal after 3 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        onClose();
        onSuccess?.();
        // Reset form after modal closes
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', phone: '', message: '' });
          setError('');
        }, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, onClose, onSuccess]);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (isOpen || showSuccessModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, showSuccessModal]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const { source, campaign } = getUrlParams();
  
    const payload = {
      name: formData.name,
      phone: formData.phone,
      message: formData.message,
      item_type: itemType,
      service_id: itemType === 's' ? itemId : null,
      package_id: itemType === 'p' ? itemId : null,
      ...(source && { source }),
      ...(campaign && { campaign }),
    };
  
    try {
       await AxiosInstance.post(
        'home/appointments/new/',
        payload
      );
  
      setSubmitted(true);
      setShowSuccessModal(true);
  
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        'تعذر الاتصال بالخادم، حاول مرة أخرى'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !showSuccessModal) return null;

  // Desktop: Centered Modal
  // Mobile: Bottom Sheet
  return (
    <>
      {/* Booking Form Modal */}
      {isOpen && (
        <div 
          className={`${styles.bookingModal} ${isOpen ? styles.open : ''} ${isDesktop ? styles.desktop : styles.mobile}`} 
          onClick={onClose}
        >
          <div 
            className={`${styles.bookingSheet} ${isDesktop ? styles.desktopSheet : styles.mobileSheet}`} 
            onClick={e => e.stopPropagation()}
          >
            {!isDesktop && <div className={styles.sheetHandle} />}
            
            <div className={styles.sheetHeader}>
              <div className={styles.headerIcon}>
                {itemType === 's' ? <Briefcase size={24} /> : <Package size={24} />}
              </div>
              <div className={styles.headerText}>
                <h3>احجز {itemType === 's' ? 'الخدمة' : 'الباقة'}</h3>
                <p>{itemName}</p>
              </div>
              <button onClick={onClose} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            
            {!submitted ? (
              <form className={styles.bookingForm} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <User size={18} />
                  <input 
                    type="text" 
                    name="name"
                    placeholder="الاسم الكامل" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <Phone size={18} />
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="رقم الجوال" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <MessageCircle size={18} />
                  <textarea 
                    name="message"
                    placeholder="ملاحظات إضافية (اختياري)" 
                    value={formData.message} 
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                
                {error && <p className={styles.errorMsg}>{error}</p>}
                
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  <Calendar size={16} />
                  {loading ? 'جاري الإرسال...' : 'تأكيد الحجز'}
                </button>
              </form>
            ) : (
              <div className={styles.waitingMessage}>
                <div className={styles.spinner} />
                <p>جاري تأكيد حجزك...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Modal Popup (Same for both desktop and mobile) */}
      {showSuccessModal && (
        <div className={styles.successModalOverlay}>
          <div className={styles.successModalContainer}>
            <div className={styles.successModalContent}>
              <button 
                className={styles.successModalClose}
                onClick={() => {
                  setShowSuccessModal(false);
                  onClose();
                  onSuccess?.();
                }}
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
              
              <div className={styles.successModalIcon}>
                <div className={styles.checkmarkCircle}>
                  <CheckCircle2 size={isDesktop ? 56 : 48} />
                </div>
              </div>
              
              <h3 className={styles.successModalTitle}>تم استلام طلبك بنجاح! 🎉</h3>
              
              <p className={styles.successModalMessage}>
                شكراً لك على ثقتك بنا. سيتم التواصل معك خلال <strong>٢٤ ساعة</strong> لتأكيد موعد {itemType === 's' ? 'الاستشارة' : 'الباقة'}
              </p>
              
              <div className={styles.successModalDetails}>
                <div className={styles.successModalDetailItem}>
                  <Sparkles size={isDesktop ? 16 : 14} />
                  <span>تأكيد فوري لطلبك</span>
                </div>
                <div className={styles.successModalDetailItem}>
                  <Sparkles size={isDesktop ? 16 : 14} />
                  <span>متخصصون ينتظرونك</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingModal;