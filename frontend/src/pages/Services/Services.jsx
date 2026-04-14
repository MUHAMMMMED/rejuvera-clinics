import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import useDevice from "../../hooks/useDevice";
import ServicesDesktop from "./Desktop/Desktop";
import ServicesMobile from "./Mobile/Mobile";

import EmptyState from "../../components/EmptyState/EmptyState";
import ErrorState from "../../components/ErrorState/ErrorState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { GTMEvents } from "../../hooks/useGTM";
import './services.css';

export default function ServicesPage() {
  const device = useDevice();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const clinicName = "Rejuvera Clinics";

  const [currentUrl, setCurrentUrl] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await AxiosInstance.get(`/services/list/`);
      const servicesData = Array.isArray(response.data) ? response.data : [];
      setData(servicesData);

      // ✅ GTM: Page View
      GTMEvents.pageView("services");

    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [retryCount]);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // ✅ دالة للتعامل مع النقر على خدمة - إرسال حدث viewContent
  const handleServiceClick = (service) => {
    GTMEvents.viewContent(service.id, service.name);
  };

  // ✅ دالة للتعامل مع فتح نافذة الحجز
  const handleOpenBooking = (serviceId, serviceName) => {
    GTMEvents.openBooking(serviceId, serviceName, 's');
  };

  // ✅ دالة للتعامل مع نجاح الحجز
  const handleBookingSuccess = (serviceId, serviceName) => {
    GTMEvents.bookingSuccess(serviceId, serviceName, 's');
  };

  // تمرير دوال GTM إلى المكونات الفرعية
  const enhancedData = {
    services: data,
    onServiceClick: handleServiceClick,
    onOpenBooking: handleOpenBooking,
    onBookingSuccess: handleBookingSuccess
  };

  // Loading State
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{`جاري التحميل | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <LoadingSpinner
          message="جاري تحميل قائمة الخدمات..."
          size="large"
          fullPage={false}
        />
      </>
    );
  }

  // Error State
  if (error) {
    let errorType = 'error';
    let errorTitle = 'حدث خطأ';
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل الخدمات. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'الخدمات غير متاحة';
      errorMessage = 'عذراً، قائمة الخدمات غير متاحة حالياً.';
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
        <Helmet>
          <title>{`خطأ | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <ErrorState 
          type={errorType}
          title={errorTitle}
          message={errorMessage}
          onRetry={handleRetry}
          fullPage={false}
        />
      </>
    );
  }

  // No Data State
  if (!data || data.length === 0) {
    return (
      <>
        <Helmet>
          <title>{`لا توجد خدمات | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <EmptyState
          type="default"
          title="لا توجد خدمات"
          message="عذراً، لا توجد خدمات متاحة حالياً. يرجى العودة لاحقاً."
          actionText="تحديث الصفحة"
          onAction={handleRetry}
          fullPage={false}
        />
      </>
    );
  }

  const safeData = data;

  const categories = [...new Set(safeData.map(service => service.category?.name).filter(Boolean))];
  const servicesCount = safeData.length;
  const categoriesCount = categories.length;

  const pageTitle = `جميع الخدمات | ${clinicName}`;
  const pageDescription = `استكشف جميع خدماتنا الطبية والتجميلية في ${clinicName}. نقدم أكثر من ${servicesCount} خدمة متنوعة في ${categoriesCount} مجال مختلف بأحدث التقنيات.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "description": pageDescription,
    "numberOfItems": servicesCount,
    "itemListElement": safeData.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "MedicalProcedure",
        "name": service.name,
        "description": service.description,
        "url": `${currentUrl}/${service.id}`,
        "image": service.image || "",
        "medicalSpecialty": service.category?.name || "الخدمات الطبية",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "EGP"
        }
      }
    }))
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": `${currentUrl.split('/services')[0]}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الخدمات",
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`خدمات طبية, خدمات تجميل, عيادات تجميل, علاجات تجميلية, ${clinicName}, خدمات ${clinicName}`} />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={clinicName} />
        <meta property="og:image" content={safeData[0]?.image || ""} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={safeData[0]?.image || ""} />
        
        <link rel="canonical" href={currentUrl} />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Helmet>

      <noscript>
        <div>
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
          <ul>
            {safeData.map((service, index) => (
              <li key={index}>
                <h2>{service.name}</h2>
                <p>{service.description}</p>
                {service.category && <p>التصنيف: {service.category.name}</p>}
              </li>
            ))}
          </ul>
        </div>
      </noscript>

      <Navbar />
      <div className="page-clinic-container" dir="rtl">
        <div className="about-content-wrapper">
          {device === "mobile" ? (
            <ServicesMobile 
              data={safeData}
              onServiceClick={handleServiceClick}
              onOpenBooking={handleOpenBooking}
              onBookingSuccess={handleBookingSuccess}
            />
          ) : (
            <ServicesDesktop 
              data={safeData}
              onServiceClick={handleServiceClick}
              onOpenBooking={handleOpenBooking}
              onBookingSuccess={handleBookingSuccess}
            />
          )}
        </div>
      </div>
    </>
  );
}