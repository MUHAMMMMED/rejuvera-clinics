 
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import Navbar from '../../components/Navbar/Navbar';
import useDevice from "../../hooks/useDevice";
import FaqDesktop from '../home/components/Desktop/components/Faq/Faq';
import FaqMobile from '../home/components/Mobile/components/Faq/Faq';
 
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './Faq.css';

export default function FaqsPage() {
  const device = useDevice();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const clinicName = "Rejuvera Clinics";

  // Get current URL safely (for client-side only)
  const [currentUrl, setCurrentUrl] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await AxiosInstance.get("/home/");
      setData(response.data);
    } catch (err) {
      console.error("Error fetching FAQs data:", err);
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

  // Get FAQs from data
  const faqs = data?.faqs || [];
  
  // Get unique categories from FAQs
  const categories = ["all", ...new Set(faqs.map(faq => faq.category).filter(Boolean))];
  
  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchTerm === "" || 
      faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Loading State
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{`جاري التحميل | الأسئلة الشائعة | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <LoadingSpinner 
          message="جاري تحميل الأسئلة الشائعة..."
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
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل الأسئلة الشائعة. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'الأسئلة غير متاحة';
      errorMessage = 'عذراً، الأسئلة الشائعة غير متاحة حالياً.';
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
          <title>{`خطأ | الأسئلة الشائعة | ${clinicName}`}</title>
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
  if (!data || faqs.length === 0) {
    return (
      <>
        <Helmet>
          <title>{`الأسئلة الشائعة | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <EmptyState 
          type="default"
          title="لا توجد أسئلة"
          message="عذراً، لا توجد أسئلة شائعة متاحة حالياً. يرجى العودة لاحقاً."
          actionText="تحديث الصفحة"
          onAction={handleRetry}
          fullPage={false}
        />
      </>
    );
  }

  // No results after filtering
  const noResults = filteredFaqs.length === 0;

  // SEO for FAQs Page
  const pageTitle = `الأسئلة الشائعة | ${clinicName}`;
  const pageDescription = `إجابات على الأسئلة الشائعة حول خدماتنا الطبية والتجميلية في ${clinicName}. تعرف على المزيد عن علاجاتنا وإجراءاتنا.`;

  // Structured Data (FAQPage)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": currentUrl,
    "mainEntity": faqs.map((faq, index) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
        "url": `${currentUrl}#faq-${index}`
      },
      "position": index + 1
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
        "item": `${currentUrl.split('/faqs')[0]}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الأسئلة الشائعة",
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`أسئلة شائعة, استفسارات, خدمات طبية, تجميل, ${clinicName}, FAQ`} />
        
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
          <div>
            {faqs.map((faq, index) => (
              <div key={index}>
                <h2>{faq.question}</h2>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </noscript>

      <Navbar />
      <div className="page-clinic-container" dir="rtl">
        <div className="about-content-wrapper">
        

          {/* Render FAQs based on device */}
          { device === "mobile" ? (
              <FaqMobile data={{ ...data, faqs: filteredFaqs }} />
            ) : (
              <FaqDesktop data={{ ...data, faqs: filteredFaqs }} />
            )
           }

</div>  </div>
    </>
  );
}