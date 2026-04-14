import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import DeviceCard from "./DeviceCard/DeviceCard";
 
import EmptyState from "../../components/EmptyState/EmptyState";
import ErrorState from "../../components/ErrorState/ErrorState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { GTMEvents } from "../../hooks/useGTM";
import styles from "./Devices.module.css";

export default function DevicesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const clinicName = "Rejuvera Clinics";

  // Get current URL safely
  const [currentUrl, setCurrentUrl] = useState("");

  // ✅ إضافة useEffect لإرسال حدث pageView عند تحميل الصفحة
  useEffect(() => {
    GTMEvents.pageView("devices_list");
  }, []);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AxiosInstance.get("/device/list/");
      setDevices(response.data || []);
    } catch (err) {
      console.error("Error fetching devices:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // ✅ دالة للتعامل مع النقر على الجهاز - إرسال حدث viewContent
  const handleDeviceClick = (device) => {
    // إرسال حدث GTM عند النقر على جهاز
    GTMEvents.viewContent(device.id, device.name);
    
    // يمكنك إضافة أي منطق إضافي هنا مثل التوجيه إلى صفحة التفاصيل
    // window.location.href = `/devices/${device.slug}`; // أو استخدام react-router Link
  };

  const filteredDevices = devices.filter(device =>
    device.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading State
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{`جاري التحميل | الأجهزة الطبية | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <LoadingSpinner 
          message="جاري تحميل الأجهزة الطبية..."
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
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل الأجهزة الطبية. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'الأجهزة غير متاحة';
      errorMessage = 'عذراً، قائمة الأجهزة الطبية غير متاحة حالياً.';
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
          <title>{`خطأ | الأجهزة الطبية | ${clinicName}`}</title>
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
  if (!devices || devices.length === 0) {
    return (
      <>
        <Helmet>
          <title>{`الأجهزة الطبية | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <EmptyState 
          type="default"
          title="لا توجد أجهزة"
          message="عذراً، لا توجد أجهزة طبية متاحة حالياً. يرجى العودة لاحقاً."
          actionText="تحديث الصفحة"
          onAction={handleRetry}
          fullPage={false}
        />
      </>
    );
  }

  // No results after filtering
  const noResults = filteredDevices.length === 0;

  // Calculate statistics
  const totalDevices = devices.length;
  const newDevices = devices.filter(device => device.is_new).length;

  // SEO for Devices Page
  const pageTitle = `الأجهزة الطبية المتطورة | ${clinicName}`;
  const pageDescription = `تعرف على أحدث الأجهزة الطبية والتجميلية في ${clinicName}. نقدم أحدث التقنيات العالمية لخدمتك بأعلى معايير الجودة والأمان.`;

  // Structured Data (ItemList for devices)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "description": pageDescription,
    "numberOfItems": totalDevices,
    "itemListElement": devices.map((device, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": device.name,
        "description": device.summary,
        "image": device.image,
        "manufacturer": {
          "@type": "Organization",
          "name": device.manufacturer || "علامة تجارية عالمية"
        },
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "EGP"
        }
      }
    }))
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
        "item": `${currentUrl.split('/devices')[0]}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الأجهزة الطبية",
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`أجهزة طبية, أجهزة تجميل, تقنيات حديثة, ${clinicName}, أجهزة ${clinicName}, مورفيوس 8, الألثيرا, EM FACE`} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={clinicName} />
        <meta property="og:image" content={devices[0]?.image || ""} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={devices[0]?.image || ""} />
        
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

      <Navbar />

      <div className={styles.devicesPage}>
        <div className={styles.container}>
        
          <div className={styles.header}>
            <span className={styles.sectionBadge}>أحدث الأجهزة الطبية</span>
            <h1 className={styles.sectionTitle}>
              تقنيات <span className={styles.goldText}>متطورة لنتائج مذهلة</span>
            </h1>
            <p className={styles.sectionSubtitle}>
              نقدم أحدث الأجهزة الطبية والتجميلية لخدمتك بأعلى معايير الجودة والأمان
            </p>
          </div>

          <div className={styles.searchWrapper}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="ابحث عن جهاز..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {searchTerm && (
              <button 
                className={styles.clearSearch}
                onClick={() => setSearchTerm("")}
              >
                ✕ مسح
              </button>
            )}
          </div>

          {/* Results Count */}
          {searchTerm && (
            <div className={styles.resultsCount}>
              تم العثور على {filteredDevices.length} {filteredDevices.length === 1 ? 'جهاز' : 'جهازاً'}
            </div>
          )}

          {!noResults ? (
            <>
              <div className={styles.grid}>
                {filteredDevices
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((device, index) => (
                    <div 
                      key={device.id} 
                      onClick={() => handleDeviceClick(device)}
                      style={{ cursor: 'pointer' }}
                    >
                      <DeviceCard device={device} index={index} />
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3>لا توجد أجهزة</h3>
              <p>لم نعثر على أجهزة تطابق بحثك "{searchTerm}". حاول بكلمات مختلفة.</p>
              <button 
                className={styles.clearSearchBtn}
                onClick={() => setSearchTerm("")}
              >
                مسح البحث
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}