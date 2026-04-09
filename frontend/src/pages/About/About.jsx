import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Navbar from '../../components/Navbar/Navbar';
import useDevice from "../../hooks/useDevice";
import AboutDesktop from '../home/components/Desktop/components/About/About';
import AboutMobile from '../home/components/Mobile/components/About/About';
import './About.css';

export default function AboutPage() {
  const device = useDevice();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const clinicName = "Rejuvera Clinics";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await AxiosInstance.get("/home/");
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching about page data:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // ✅ Loading State with Logo Animation
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{`جاري التحميل | عن المركز | ${clinicName}`}</title>
        </Helmet>
        <LoadingSpinner
          message="جاري تحميل معلومات المركز..."
          size="large"
          fullPage={true}
        />
      </>
    );
  }

  // ✅ Error State with Retry Option
  if (error) {
    let errorType = 'error';
    let errorTitle = 'حدث خطأ';
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل معلومات المركز. يرجى المحاولة مرة أخرى.';
    
    // Check for specific error types
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'الصفحة غير متاحة';
      errorMessage = 'عذراً، معلومات المركز غير متاحة حالياً.';
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
          <title>{`خطأ | عن المركز | ${clinicName}`}</title>
        </Helmet>
        <ErrorState
          type={errorType}
          title={errorTitle}
          message={errorMessage}
          onRetry={handleRetry}
          fullPage={true}
        />
      </>
    );
  }

  // ✅ No Data State
  if (!data) {
    return (
      <>
        <Helmet>
          <title>{`عن المركز | ${clinicName}`}</title>
        </Helmet>
        <EmptyState 
          type="default"
          title="لا توجد بيانات"
          message="عذراً، لا تتوفر معلومات عن المركز حالياً."
          actionText="تحديث الصفحة"
          onAction={handleRetry}
          fullPage={true}
        />
      </>
    );
  }

  // ✅ Safe Data with defaults
  const safeData = {
    about: {},
    hero: {},
    services: [],
    doctors: [],
    testimonials: [],
    ...data,
  };

  // ✅ Structured Data for SEO (About Page)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": `عن المركز | ${clinicName}`,
    "description": safeData.about?.description || safeData.hero?.description || `تعرف على ${clinicName} - أفضل عيادات التجميل`,
    "url": window.location.href,
    "mainEntity": {
      "@type": "MedicalClinic",
      "name": clinicName,
      "description": safeData.about?.description || "",
      "image": safeData.hero?.image || "",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "EG",
        "addressLocality": "Egypt"
      },
      "openingHours": "Sa-Th 10:00-20:00",
      "telephone": "+20123456789"
    }
  };

  return (
    <>
      <Helmet>
        <title>{`عن المركز | ${clinicName}`}</title>
        
        <meta name="description" content={safeData.about?.description || safeData.hero?.description || `تعرف على ${clinicName} - قصتنا، رسالتنا، وفريقنا الطبي المتميز`} />
        <meta name="keywords" content={`عن المركز, من نحن, قصتنا, رؤيتنا, رسالتنا, ${clinicName}, عيادات تجميل`} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content={`عن المركز | ${clinicName}`} />
        <meta property="og:description" content={safeData.about?.description || safeData.hero?.description || `تعرف على ${clinicName}`} />
        <meta property="og:image" content={safeData.hero?.image || ""} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={clinicName} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`عن المركز | ${clinicName}`} />
        <meta name="twitter:description" content={safeData.about?.description || `تعرف على ${clinicName}`} />
        <meta name="twitter:image" content={safeData.hero?.image || ""} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
        
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Fallback for SEO bots */}
      <noscript>
        <div>
          <h1>عن المركز | {clinicName}</h1>
          <p>{safeData.about?.description || safeData.hero?.description}</p>
          <img src={safeData.hero?.image} alt={clinicName} />
        </div>
      </noscript>

      <Navbar />
      <div className="page-clinic-container" dir="rtl">
        <div className="about-content-wrapper">
          {device === "mobile" ? (
            <AboutMobile data={safeData} />
          ) : (
            <AboutDesktop data={safeData} />
          )}
        </div>
      </div>
    </>
  );
}