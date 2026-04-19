import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Navbar from '../../components/Navbar/Navbar';
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat';
import useDevice from "../../hooks/useDevice";
import { GTMEvents } from '../../hooks/useGTM';
import CategoriesDesktop from '../home/components/Desktop/components/Categories/Categories';
import CategoriesMobile from '../home/components/Mobile/components/Categories/Categories';
import './categories.css';

export default function CategoriesPage() {
  const device = useDevice();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const clinicName = "Rejuvera Clinics";

  // Get current URL safely
  const [currentUrl, setCurrentUrl] = useState("");

  // ✅ إضافة useEffect لإرسال حدث pageView عند تحميل الصفحة
  useEffect(() => {
    GTMEvents.pageView("categories");
  }, []);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await AxiosInstance.get("/home/");
      setData(response.data);
    } catch (err) {
      console.error("Error fetching categories data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // ✅ دالة للتعامل مع النقر على التصنيف - إرسال حدث viewContent
  const handleCategoryClick = (category) => {
    GTMEvents.viewContent(category.id, category.name);
  };

  // Get categories from data
  const categories = data?.categories || [];
  
  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ إضافة دوال GTM إلى البيانات التي ستمرر للمكونات الفرعية
  const enhancedData = {
    ...data,
    categories: filteredCategories,
    onCategoryClick: handleCategoryClick
  };

  // Loading State
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{`جاري التحميل | التصنيفات | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <LoadingSpinner 
          message="جاري تحميل التصنيفات..."
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
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل التصنيفات. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'التصنيفات غير متاحة';
      errorMessage = 'عذراً، التصنيفات غير متاحة حالياً.';
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
          <title>{`خطأ | التصنيفات | ${clinicName}`}</title>
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
  if (!data || categories.length === 0) {
    return (
      <>
        <Helmet>
          <title>{`التصنيفات | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <EmptyState 
          type="default"
          title="لا توجد تصنيفات"
          message="عذراً، لا توجد تصنيفات متاحة حالياً. يرجى العودة لاحقاً."
          actionText="تحديث الصفحة"
          onAction={handleRetry}
          fullPage={false}
        />
      </>
    );
  }

  // No results after filtering
  const noResults = searchTerm && filteredCategories.length === 0;

  // Calculate statistics
  const totalCategories = categories.length;
  const totalServices = categories.reduce((sum, category) => sum + (category.services_count || 0), 0);

  // SEO for Categories Page
  const pageTitle = `التصنيفات والخدمات | ${clinicName}`;
  const pageDescription = `استكشف جميع التصنيفات والخدمات الطبية والتجميلية في ${clinicName}. نقدم مجموعة متنوعة من الخدمات بأحدث التقنيات.`;

  // Structured Data (ItemList for categories)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "description": pageDescription,
    "numberOfItems": totalCategories,
    "itemListElement": categories.map((category, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CategoryCode",
        "name": category.name,
        "description": category.description,
        "url": `${currentUrl}/${category.id}`,
        "image": category.image || ""
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
        "item": `${currentUrl.split('/categories')[0]}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "التصنيفات",
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`تصنيفات, خدمات طبية, خدمات تجميل, ${clinicName}, تصنيفات ${clinicName}`} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={clinicName} />
        <meta property="og:image" content={categories[0]?.image || ""} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={categories[0]?.image || ""} />
        
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
      <div className="page-clinic-container" dir="rtl">
        <div className="about-content-wrapper">
      
         
          {/* Categories Grid */}
          {
            device === "mobile" ? (
              <CategoriesMobile data={enhancedData} />
            ) : (
              <CategoriesDesktop data={enhancedData} />
            )
          }
        </div>
      </div>
      <WhatsAppFloat phone={data?.info?.phone} whatsapp={data?.info?.whatsapp} />
    </>
  );
}