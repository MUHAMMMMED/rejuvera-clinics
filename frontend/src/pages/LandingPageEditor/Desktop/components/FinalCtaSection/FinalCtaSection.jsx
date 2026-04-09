import { Calendar, CheckCircle2, Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import styles from './FinalCtaSection.module.css';

const FinalCtaSection = ({ data }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('source') || '',
      campaign: params.get('campaign') || '',
    };
  };

  // Auto-hide modal after 3 seconds
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
      service_id: data?.id,
      ...(source && { source }),
      ...(campaign && { campaign }),
    };

    try {
      const res = await AxiosInstance.post('/home/appointments/new/',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.ok) {
        setSubmitted(true);
        setShowModal(true); // Show centered modal popup
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
                  شكراً لك على ثقتك بنا. سيتم التواصل معك خلال <strong>٢٤ ساعة</strong> لتأكيد موعد الاستشارة
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
            <p>احجزي استشارتك المجانية واحصلي على خطة علاجية مخصصة لحالتك</p>
            <div className={styles.finalCtaBenefits}>
              <div><CheckCircle2 size={18} /> استشارة طبية مجانية</div>
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
              <p>سيتم التواصل معك خلال ٢٤ ساعة لتأكيد موعد الاستشارة</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;