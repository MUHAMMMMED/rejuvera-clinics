 
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import EmptyState from "../../components/EmptyState/EmptyState";
import ErrorState from "../../components/ErrorState/ErrorState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Navbar from "../../components/Navbar/Navbar";
import BookingModal from "../home/components/Desktop/components/BookingModal/BookingModal";
import styles from "./DeviceDetails.module.css";

export default function DeviceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const [bookingModal, setBookingModal] = useState({ 
    isOpen: false, 
    id: null, 
    type: 's', 
    name: '' 
  });

  // Fetch device data from API
  const fetchDeviceData = async () => {
    if (!id) {
      setError(new Error("No device ID provided"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await AxiosInstance.get(`/device/devices/${id}/`);
      const data = response.data;
      setDevice(data.device);
      setAllServices(data.services || []);
    } catch (err) {
      console.error("Error fetching device:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceData();
  }, [id, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleBookService = (service) => {
    setBookingModal({
      isOpen: true,
      id: service.id,
      type: 's',
      name: service.name
    });
  };

  const handleBookingSuccess = () => {
    console.log('تم حجز الخدمة بنجاح');
  };

  // Helper to get related services data
  const getRelatedServices = () => {
    if (!device?.related_services || device.related_services.length === 0) return [];
    
    // If the API returns full service objects
    if (device.related_services[0]?.name) {
      return device.related_services;
    }
    
    // If the API only returns IDs, filter from allServices
    const serviceIds = device.related_services.map(s => s.id || s);
    return allServices.filter(service => serviceIds.includes(service.id));
  };

  const relatedServices = getRelatedServices();

  // Loading State
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.deviceLoadingContainerUnique}>
          <LoadingSpinner 
            message="جاري تحميل معلومات الجهاز..."
            size="large"
            fullPage={false}
          />
        </div>
      </>
    );
  }

  // Error State
  if (error) {
    let errorType = 'error';
    let errorTitle = 'حدث خطأ';
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل بيانات الجهاز. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'جهاز غير موجود';
      errorMessage = 'الجهاز الذي تبحث عنه غير موجود. قد يكون قد تم حذفه أو تغيير رابطها.';
    } else if (error.response?.status === 403) {
      errorType = 'error';
      errorTitle = 'غير مصرح';
      errorMessage = 'ليس لديك صلاحية للوصول إلى هذا الجهاز.';
    } else if (error.response?.status === 500) {
      errorType = 'server';
      errorTitle = 'خطأ في الخادم';
      errorMessage = 'عذراً، حدث خطأ في الخادم. يرجى المحاولة لاحقاً.';
    } else if (error.code === 'ERR_NETWORK') {
      errorType = 'network';
      errorTitle = 'مشكلة في الاتصال';
      errorMessage = 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
    }
    
    return (
      <>
        <Navbar />
        <div className={styles.deviceErrorContainerUnique}>
          <ErrorState
            type={errorType}
            title={errorTitle}
            message={errorMessage}
            onRetry={handleRetry}
            fullPage={false}
          />
        </div>
      </>
    );
  }

  // No Data State
  if (!device) {
    return (
      <>
        <Navbar />
        <div className={styles.deviceErrorContainerUnique}>
          <EmptyState 
            type="default"
            title="الجهاز غير موجود"
            message="الجهاز الذي تبحث عنه قد تم حذفه أو نقله."
            actionText="العودة إلى الأجهزة"
            onAction={() => navigate('/devices')}
            fullPage={false}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{device.name} | ريجوفيرا كلينك</title>
        <meta name="description" content={device.summary} />
      </Helmet>

      <Navbar />

      <article className={styles.deviceDetailsUnique}>
        <div className={styles.deviceDetailsContainerUnique}>
          {/* Breadcrumb */}
          <div className={styles.deviceBreadcrumbUnique}>
            <Link to="/">الرئيسية</Link>
            <span>/</span>
            <Link to="/devices">الأجهزة</Link>
            <span>/</span>
            <span className={styles.deviceBreadcrumbCurrentUnique}>{device.name}</span>
          </div>

          {/* Hero Section */}
          <div className={styles.deviceHeroUnique}>
            <div className={styles.deviceHeroImageUnique}>
              <img src={device.image} alt={device.name} />
              {device.is_new && <span className={styles.deviceNewTagUnique}>جديد</span>}
            </div>
            <div className={styles.deviceHeroContentUnique}>
              <h1>{device.name}</h1>
              <p className={styles.deviceSummaryUnique}>{device.summary}</p>
              <div className={styles.deviceStatsUnique}>
                <div className={styles.deviceStatUnique}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span>{device.technology}</span>
                </div>
                <div className={styles.deviceStatUnique}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 12V8H4v4M12 4v4M8 4v4M16 4v4" />
                    <path d="M4 12h16v8H4z" />
                  </svg>
                  <span>{device.treatments}+ علاج</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content and Services */}
          <div className={styles.deviceContentWrapperUnique}>
            <div className={styles.deviceMainContentUnique}>
              <div 
                className={styles.deviceDescriptionUnique}
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(device.content || "<p>لا يوجد وصف متاح حالياً.</p>")
                }}
              />
            </div>

            {/* Related Services Section */}
            {relatedServices.length > 0 && (
              <div className={styles.deviceRelatedServicesUnique}>
                <h2>
                  <span className={styles.deviceGoldTextUnique}>خدمات مرتبطة</span> بهذا الجهاز
                </h2>
                <p className={styles.deviceServicesIntroUnique}>
                  يمكنك حجز أي من هذه الخدمات التي تتم باستخدام جهاز {device.name}
                </p>
                
                <div className={styles.deviceServicesGridUnique}>
                  {relatedServices.map((service) => (
                    <div key={service.id} className={styles.deviceServiceCardUnique}>
                      {/* القسم 1: أيقونة + المحتوى (العنوان والوصف) */}
                      <div className={styles.deviceServiceCardContentUnique}>
                        <div className={styles.deviceServiceIconUnique}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 12V8H4v4M12 4v4M8 4v4M16 4v4" />
                            <path d="M4 12h16v8H4z" />
                          </svg>
                        </div>
                        <div className={styles.deviceServiceInfoUnique}>
                          <h3>{service.name}</h3>
                          <p>{service.description || "خدمة متكاملة باستخدام أحدث التقنيات"}</p>
                        
                        </div>
                      </div>
                      
                      {/* القسم 2: زر الحجز */}
                      <div className={styles.deviceServiceCardActionUnique}>
                        <button 
                          className={styles.deviceBookServiceBtnUnique}
                          onClick={() => handleBookService(service)}
                        >
                          احجز الخدمة
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, id: null, type: 's', name: '' })}
        itemId={bookingModal.id}
        itemType={bookingModal.type}
        itemName={bookingModal.name}
        onSuccess={handleBookingSuccess}
      />
    </>
  );
}