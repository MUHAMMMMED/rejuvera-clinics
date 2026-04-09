import { Calendar, CheckCircle2, MessageCircle, Phone, Sparkles, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styles from './BookingModal.module.css';

const BookingModal = ({ isOpen, onClose, serviceId, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('source') || '',
      campaign: params.get('campaign') || '',
    };
  };

  // Auto-hide success modal after 3 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        onClose(); // Close booking modal after success modal disappears
        onSuccess?.(); // Callback for parent component
        // Reset form after modal closes
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', phone: '', message: '' });
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
      item_type: 's',
      service_id: serviceId,
      ...(source && { source }),
      ...(campaign && { campaign }),
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/home/appointments/new/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        setShowSuccessModal(true); // Show centered success popup
      } else {
        const err = await res.json();
        setError(err?.error || 'حدث خطأ، حاولي مرة أخرى');
      }
    } catch {
      setError('تعذر الاتصال بالخادم، حاولي مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !showSuccessModal) return null;

  return (
    <>
      {/* Booking Form Modal (Bottom Sheet for Mobile) */}
      {isOpen && (
        <div className={`${styles.bookingModal} ${isOpen ? styles.open : ''}`} onClick={onClose}>
          <div className={styles.bookingSheet} onClick={e => e.stopPropagation()}>
            <div className={styles.sheetHandle} />
            <div className={styles.sheetHeader}>
              <h3>احجزي استشارتك المجانية</h3>
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

      {/* Success Modal Popup (Centered for Mobile) */}
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
                  <CheckCircle2 size={48} />
                </div>
              </div>
              
              <h3 className={styles.successModalTitle}>تم استلام طلبك بنجاح! 🎉</h3>
              
              <p className={styles.successModalMessage}>
                شكراً لك على ثقتك بنا. سيتم التواصل معك خلال <strong>٢٤ ساعة</strong> لتأكيد موعد الاستشارة
              </p>
              
              <div className={styles.successModalDetails}>
                <div className={styles.successModalDetailItem}>
                  <Sparkles size={14} />
                  <span>تأكيد فوري لطلبك</span>
                </div>
                <div className={styles.successModalDetailItem}>
                  <Sparkles size={14} />
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