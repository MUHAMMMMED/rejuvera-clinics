 
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import useDevice from "../../hooks/useDevice";
import ServicesDesktop from "./Desktop/Desktop";
import ServicesMobile from "./Mobile/Mobile";
 
import EmptyState from "../../components/EmptyState/EmptyState";
import ErrorState from "../../components/ErrorState/ErrorState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { GTMEvents } from "../../hooks/useGTM";
import './ServicesByCategory.css';

export default function ServicesByCategory() {
  const { id } = useParams();
  const device = useDevice();

  const [data, setData] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const clinicName = "Rejuvera Clinics";

  // Get current URL safely (for client-side only)
  const [currentUrl, setCurrentUrl] = useState("");

  const fetchData = async () => {
    if (!id) {
      setError(new Error("No category ID provided"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await AxiosInstance.get(`/services/category/${id}/services/`);
      const servicesData = Array.isArray(response.data) ? response.data : [];
      setData(servicesData);
      
      // Try to get category name from first service or from a separate API call
      if (servicesData.length > 0 && servicesData[0].category) {
        setCategoryName(servicesData[0].category.name || "الخدمات");
      } else {
        setCategoryName("الخدمات");
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, retryCount]);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

 // ✅ إضافة useEffect لإرسال حدث pageView عند تحميل الصفحة
 useEffect(() => {
  GTMEvents.pageView("services_by_category");
}, []);


  // Loading State
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{`جاري التحميل | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <LoadingSpinner 
          message="جاري تحميل الخدمات..."
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
      errorTitle = 'الفئة غير موجودة';
      errorMessage = 'الفئة التي تبحث عنها غير موجودة. قد تكون قد حُذفت أو تم تغيير رابطها.';
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
          message="عذراً، لا توجد خدمات متاحة في هذه الفئة حالياً."
          actionText="تحديث الصفحة"
          onAction={handleRetry}
          fullPage={false}
        />
      </>
    );
  }

  const safeData = data;

  // SEO for Category page
  const pageTitle = `${categoryName} | ${clinicName}`;
  const pageDescription = `استكشف خدمات ${categoryName} المتميزة في ${clinicName}. نقدم أحدث التقنيات والعلاجات بأيدي أفضل الأطباء المتخصصين.`;

  // Structured Data (ItemList for services)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "description": pageDescription,
    "numberOfItems": safeData.length,
    "itemListElement": safeData.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": service.name,
      "description": service.description,
      "url": `${currentUrl}/service/${service.id}`,
      "image": service.image || "",
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "EGP"
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
        "item": `${currentUrl.split('/services')[0]}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الخدمات",
        "item": `${currentUrl.split('/services')[0]}/services`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${categoryName}, خدمات ${categoryName}, عيادات تجميل, علاجات ${categoryName}, ${clinicName}`} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={clinicName} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
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
          <ul>
            {safeData.map((service, index) => (
              <li key={index}>
                <h2>{service.name}</h2>
                <p>{service.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </noscript>

      <Navbar />
      <div className="page-clinic-container" dir="rtl">
        <div className="about-content-wrapper">
        
          {/* Render based on device */}
          {device === "mobile" ? (
            <ServicesMobile data={safeData} categoryName={categoryName} />
          ) : (
            <ServicesDesktop data={safeData} categoryName={categoryName} />
          )}
        </div>
      </div>
    </>
  );
}