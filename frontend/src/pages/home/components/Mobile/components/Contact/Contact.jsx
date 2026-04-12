import React, { useEffect, useRef, useState } from 'react';
import AxiosInstance from '../../../../../../components/Authentication/AxiosInstance';
import styles from './Contact.module.css';

const Contact = ({ data, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    serviceId: '',
    serviceName: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (data?.categories) {
      const services = [];
      data.categories.forEach(category => {
        if (category.services && Array.isArray(category.services)) {
          category.services.forEach(service => {
            services.push({
              id: service.id,
              name: service.name,
              category: category.name,
              description: service.description
            });
          });
        }
      });
      setAllServices(services);
      setFilteredServices(services);
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredServices(allServices);
    } else {
      const filtered = allServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchTerm, allServices]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, serviceId: service.id, serviceName: service.name });
    setSearchTerm(service.name);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);
    if (value === '') {
      setFormData({ ...formData, serviceId: '', serviceName: '' });
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('source') || '',
      campaign: params.get('campaign') || '',
    };
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.phone.trim()
    ) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
  
    if (!formData.serviceId) {
      setError('يرجى اختيار الخدمة المطلوبة');
      return;
    }
  
    setLoading(true);
    setError('');
  
    const { source, campaign } = getUrlParams();
  
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      item_type: 's',
      service_id: formData.serviceId,
      ...(source && { source }),
      ...(campaign && { campaign }),
    };
  
    try {
      await AxiosInstance.post(
        'home/appointments/new/',
        payload
      );
  
      setSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        serviceId: '',
        serviceName: ''
      });
  
      setSearchTerm('');
  
      if (onBookingSuccess) onBookingSuccess();
  
      setTimeout(() => setSubmitted(false), 5000);
  
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        'تعذر الاتصال بالخادم، حاول مرة أخرى'
      );
    } finally {
      setLoading(false);
    }
  };

  const getServicesByCategory = () => {
    const grouped = {};
    filteredServices.forEach(service => {
      if (!grouped[service.category]) {
        grouped[service.category] = [];
      }
      grouped[service.category].push(service);
    });
    return grouped;
  };

  const servicesByCategory = getServicesByCategory();

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.formArea}>
            <div className={styles.formHeader}>
              <span className={styles.sectionBadge}>احجزي موعدك</span>
              <h2>تواصلي <span className={styles.goldText}>معنا</span></h2>
              <p>نحن هنا لمساعدتك في رحلة جمالك</p>
            </div>

            {submitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3>تم استلام طلبك بنجاح!</h3>
                <p>سيتم التواصل معك خلال ٢٤ ساعة لتأكيد موعد الاستشارة</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="firstName"
                      placeholder=" "
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <label>الاسم الأول</label>
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="lastName"
                      placeholder=" "
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                    <label>العائلة</label>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder=" "
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <label>رقم الجوال</label>
                </div>

                <div className={styles.serviceSelectGroup} ref={dropdownRef}>
                  <div className={styles.selectWrapper}>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder=" "
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setIsDropdownOpen(true)}
                      className={styles.serviceInput}
                    />
                    <label>اختر الخدمة *</label>
                    <button
                      type="button"
                      className={styles.dropdownToggle}
                      onClick={toggleDropdown}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>

                  {isDropdownOpen && (
                    <div className={styles.servicesDropdown}>
                      {filteredServices.length === 0 ? (
                        <div className={styles.dropdownEmpty}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          <span>لا توجد خدمات مطابقة لـ "{searchTerm}"</span>
                        </div>
                      ) : (
                        <div className={styles.dropdownContent}>
                          {searchTerm && (
                            <div className={styles.dropdownSearchResult}>
                              <span>نتائج البحث عن: {searchTerm}</span>
                            </div>
                          )}
                          <div className={styles.servicesList}>
                            {Object.keys(servicesByCategory).map(category => (
                              <div key={category} className={styles.categoryGroup}>
                                <div className={styles.categoryHeader}>
                                  <span className={styles.categoryIcon}>📁</span>
                                  <span className={styles.categoryName}>{category}</span>
                                  <span className={styles.categoryCount}>
                                    ({servicesByCategory[category].length})
                                  </span>
                                </div>
                                <div className={styles.categoryServices}>
                                  {servicesByCategory[category].map(service => (
                                    <div
                                      key={service.id}
                                      className={`${styles.serviceItem} ${formData.serviceId === service.id ? styles.selected : ''}`}
                                      onClick={() => handleServiceSelect(service)}
                                    >
                                      <div className={styles.serviceIcon}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                          <circle cx="12" cy="12" r="10" />
                                          <path d="M12 6v6l4 2" />
                                        </svg>
                                      </div>
                                      <div className={styles.serviceInfo}>
                                        <div className={styles.serviceName}>{service.name}</div>
                                        <div className={styles.serviceDesc}>
                                          {service.description?.substring(0, 50)}...
                                        </div>
                                      </div>
                                      {formData.serviceId === service.id && (
                                        <div className={styles.selectedBadge}>
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37">
                                            <path d="M20 6L9 17l-5-5" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {formData.serviceName && (
                  <div className={styles.selectedService}>
                    <div className={styles.selectedServiceContent}>
                      <span className={styles.selectedLabel}>الخدمة المختارة:</span>
                      <span className={styles.selectedName}>{formData.serviceName}</span>
                      <button
                        type="button"
                        className={styles.clearService}
                        onClick={() => {
                          setFormData({ ...formData, serviceId: '', serviceName: '' });
                          setSearchTerm('');
                          setFilteredServices(allServices);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {error && <div className={styles.errorMsg}>{error}</div>}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <>
                      <div className={styles.spinnerSmall} />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <span>احجزي موعدك الآن</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <a href={`https://wa.me/${data?.info?.whatsapp}`} target="_blank" rel="noreferrer" className={styles.whatsappBtn}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
                  <span>استفسري عبر الواتساب</span>
                </a>
              </form>
            )}
          </div>

          <div className={styles.infoArea}>
            <div className={styles.infoContent}>
              <h3>رعايتكم.. <span className={styles.goldText}>أولويتنا الأولى</span></h3>
              <p>لنصمم معاً رحلة جمالكِ الخاصة، لا تترددي بمشاركتنا تساؤلاتكِ أو طلب موعدكِ الآن.</p>

              <div className={styles.buttonsRow}>
                <a href={`tel:${data?.info?.phone}`} className={styles.contactBtn}>
                  <div className={styles.btnIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                    </svg>
                  </div>
                  <div className={styles.btnText}>
                    <span className={styles.label}>للاتصال المباشر</span>
                    <span className={styles.value}>{data?.info?.phone}</span>
                  </div>
                </a>
                <a href={`https://wa.me/${data?.info?.whatsapp}`} target="_blank" rel="noreferrer" className={`${styles.contactBtn} ${styles.whatsapp}`}>
                  <div className={styles.btnIcon}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="24" />
                  </div>
                  <div className={styles.btnText}>
                    <span className={styles.label}>للاستفسار</span>
                    <span className={styles.value}>واتساب</span>
                  </div>
                </a>
              </div>

              <div className={styles.details}>
                <a href="https://maps.app.goo.gl/QmnDGj3QMrL7sFDT6" target="_blank" rel="noreferrer" className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <span>{data?.info?.address}</span>
                </a>
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                  </div>
                  <span>{data?.info?.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 6v6l4 2" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div className={styles.hoursText}>
                    <span>{data?.info?.working_hours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;