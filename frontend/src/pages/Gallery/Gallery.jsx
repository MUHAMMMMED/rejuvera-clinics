import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import Navbar from '../../components/Navbar/Navbar';
import useDevice from "../../hooks/useDevice";
  
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { GTMEvents } from '../../hooks/useGTM';
import GalleryDesktop from '../home/components/Desktop/components/Gallery/Gallery';
import GalleryMobile from '../home/components/Mobile/components/Gallery/Gallery';
import './Gallery.css';

export default function GalleryPage() {
  const device = useDevice();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const clinicName = "Rejuvera Clinics";

  // Get current URL safely (for client-side only)
  const [currentUrl, setCurrentUrl] = useState("");

  // ✅ GTM: Page View عند تحميل الصفحة
  useEffect(() => {
    GTMEvents.pageView("gallery_page");
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await AxiosInstance.get("/home/");
      setData(response.data);
    } catch (err) {
      console.error("Error fetching gallery data:", err);
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

  // ✅ GTM: تتبع النقر على صورة في المعرض
  const handleImageClick = (image, type = 'gallery') => {
    GTMEvents.viewContent(
      image.id || image.alt_text || 'gallery_image',
      image.alt_text || image.title || 'صورة من المعرض',
      type === 'gallery' ? 'gallery_image' : 'before_after_image'
    );
  };

  // ✅ GTM: تتبع فتح صورة قبل/بعد
  const handleBeforeAfterClick = (item) => {
    GTMEvents.viewContent(
      item.id || item.title || 'before_after',
      item.title || 'نتائج قبل وبعد',
      'before_after'
    );
  };

  // ✅ إضافة دوال GTM إلى البيانات التي ستمرر للمكونات الفرعية
  const enhancedData = {
    ...safeData,
    onImageClick: handleImageClick,
    onBeforeAfterClick: handleBeforeAfterClick
  };

  // Loading State
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{`جاري التحميل | المعرض | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <LoadingSpinner 
          message="جاري تحميل معرض الصور..."
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
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل المعرض. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'المعرض غير متاح';
      errorMessage = 'عذراً، المعرض غير متاح حالياً.';
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
          <title>{`خطأ | المعرض | ${clinicName}`}</title>
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
  if (!data || (!data.gallery && !data.before_after)) {
    return (
      <>
        <Helmet>
          <title>{`لا توجد صور | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <EmptyState 
          type="default"
          title="لا توجد صور"
          message="عذراً، لا توجد صور في المعرض حالياً. يرجى العودة لاحقاً."
          actionText="تحديث الصفحة"
          onAction={handleRetry}
          fullPage={false}
        />
      </>
    );
  }

  const safeData = {
    gallery: data.gallery || [],
    before_after: data.before_after || [],
    ...data
  };

  const totalImages = (safeData.gallery?.length || 0) + (safeData.before_after?.length || 0);
  const beforeAfterCount = safeData.before_after?.length || 0;
  const galleryCount = safeData.gallery?.length || 0;

  // SEO for Gallery Page
  const pageTitle = `معرض الصور | ${clinicName}`;
  const pageDescription = `استكشف معرض صور ${clinicName} وتعرف على نتائجنا المذهلة. شاهد صور قبل وبعد لخدماتنا الطبية والتجميلية.`;

  // Structured Data (ImageGallery)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": pageTitle,
    "description": pageDescription,
    "url": currentUrl,
    "numberOfItems": totalImages,
    "image": [
      ...(safeData.gallery || []).map(item => ({
        "@type": "ImageObject",
        "contentUrl": item.image,
        "name": item.alt_text || item.title || "صورة من المعرض",
        "description": item.description || "",
        "thumbnailUrl": item.thumbnail || item.image
      })),
      ...(safeData.before_after || []).map(item => ({
        "@type": "ImageObject",
        "contentUrl": item.after_image,
        "name": item.title || "نتائج قبل وبعد",
        "description": item.description || "",
        "thumbnailUrl": item.before_image,
        "beforeImage": item.before_image,
        "afterImage": item.after_image
      }))
    ]
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": `${currentUrl.split('/gallery')[0]}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "المعرض",
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`معرض صور, صور قبل وبعد, نتائج تجميلية, ${clinicName}, صور العيادة, معرض ${clinicName}`} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={clinicName} />
        <meta property="og:image" content={safeData.gallery?.[0]?.image || safeData.before_after?.[0]?.after_image || ""} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={safeData.gallery?.[0]?.image || safeData.before_after?.[0]?.after_image || ""} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />
        
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Helmet>

      {/* Fallback for SEO bots */}
      <noscript>
        <div>
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
          <div>
            <h2>صور المعرض</h2>
            <div>
              {safeData.gallery?.map((item, index) => (
                <div key={index}>
                  <img src={item.image} alt={item.alt_text || "صورة من المعرض"} />
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
            {beforeAfterCount > 0 && (
              <div>
                <h2>صور قبل وبعد</h2>
                {safeData.before_after?.map((item, index) => (
                  <div key={index}>
                    <img src={item.before_image} alt="قبل" />
                    <img src={item.after_image} alt="بعد" />
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </noscript>

      <Navbar />
      <div className="page-clinic-container" dir="rtl">
        <div className="about-content-wrapper">
         
          {/* Render based on device with GTM props */}
          {device === "mobile" ? (
            <GalleryMobile data={enhancedData} />
          ) : (
            <GalleryDesktop data={enhancedData} />
          )}
        </div>
      </div>
    </>
  );
}