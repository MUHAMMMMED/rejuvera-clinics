import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import Navbar from '../../components/Navbar/Navbar';
import useDevice from "../../hooks/useDevice";
import PackagesDesktop from '../home/components/Desktop/components/Packages/Packages';
import PackagesMobile from '../home/components/Mobile/components/Packages/Packages';

import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
 
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat';
import { GTMEvents } from '../../hooks/useGTM';
import './Packages.css';

export default function PackagesPage() {
  const device = useDevice();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const clinicName = "Rejuvera Clinics";

  const [currentUrl, setCurrentUrl] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await AxiosInstance.get("/home/");
      setData(response.data);

      // ✅ GTM: Page View
      GTMEvents.pageView("packages");

    } catch (err) {
      console.error("Error fetching packages data:", err);
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

  // Loading State
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{`جاري التحميل | الباقات | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <LoadingSpinner 
          message="جاري تحميل الباقات..."
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
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل الباقات. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'الباقات غير متاحة';
      errorMessage = 'عذراً، الباقات غير متاحة حالياً.';
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
          <title>{`خطأ | الباقات | ${clinicName}`}</title>
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
  if (!data || (!data.packages && !data.bundles)) {
    return (
      <>
        <Helmet>
          <title>{`لا توجد باقات | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <EmptyState
          type="default"
          title="لا توجد باقات"
          message="عذراً، لا توجد باقات متاحة حالياً. يرجى العودة لاحقاً."
          actionText="تحديث الصفحة"
          onAction={handleRetry}
          fullPage={false}
        />
      </>
    );
  }

  const safeData = {
    packages: data.packages || [],
    bundles: data.bundles || [],
    ...data
  };

  const packagesCount = (safeData.packages?.length || 0) + (safeData.bundles?.length || 0);

  const pageTitle = `باقات وعروض خاصة | ${clinicName}`;
  const pageDescription = `استكشف باقاتنا وعروضنا الحصرية في ${clinicName}. نقدم باقات مميزة بأسعار منافسة تشمل أحدث الخدمات الطبية والجلدية.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "description": pageDescription,
    "numberOfItems": packagesCount,
    "itemListElement": [
      ...(safeData.packages || []).map((pkg, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": pkg.name,
          "description": pkg.description,
          "image": pkg.image || "",
          "offers": {
            "@type": "Offer",
            "price": pkg.price,
            "priceCurrency": "EGP",
            "availability": "https://schema.org/InStock",
            "validFrom": pkg.start_date,
            "validThrough": pkg.end_date
          }
        }
      })),
      ...(safeData.bundles || []).map((bundle, index) => ({
        "@type": "ListItem",
        "position": (safeData.packages?.length || 0) + index + 1,
        "item": {
          "@type": "Product",
          "name": bundle.name,
          "description": bundle.description,
          "image": bundle.image || "",
          "offers": {
            "@type": "Offer",
            "price": bundle.price,
            "priceCurrency": "EGP",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": `${currentUrl.split('/packages')[0]}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الباقات",
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`باقات, عروض, باقات تجميل, عروض خاصة, خصومات, ${clinicName}, باقات ${clinicName}`} />
        
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={clinicName} />
        <meta property="og:image" content={safeData.packages?.[0]?.image || safeData.bundles?.[0]?.image || ""} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={safeData.packages?.[0]?.image || safeData.bundles?.[0]?.image || ""} />
        
        <link rel="canonical" href={currentUrl} />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Helmet>

      <Navbar />
      <div className="page-clinic-container" dir="rtl">
        <div className="about-content-wrapper">
          {device === "mobile" ? (
            <PackagesMobile data={safeData} />
          ) : (
            <PackagesDesktop data={safeData} />
          )}
        </div>
      </div>
      <WhatsAppFloat phone={data?.info?.phone} whatsapp={data?.info?.whatsapp} />
    </>
  );
}