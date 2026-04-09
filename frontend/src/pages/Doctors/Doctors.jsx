 
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
 
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Navbar from '../../components/Navbar/Navbar';
import useDevice from "../../hooks/useDevice";
import DoctorsDesktop from '../home/components/Desktop/components/Doctors/Doctors';
import DoctorsMobile from '../home/components/Mobile/components/Doctors/Doctors';
import './Doctors.css';

export default function DoctorsPage() {
  const device = useDevice();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

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
      console.error("Error fetching doctors data:", err);
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

  // Get doctors from data
  const doctors = data?.doctors || [];
  
  // Get unique specialties from doctors
  const specialties = ["all", ...new Set(doctors.map(doctor => doctor.specialty).filter(Boolean))];
  
  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === "" || 
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  // Loading State
  if (loading) {
    return (
      <>
        <Helmet>
          <title>{`جاري التحميل | الأطباء | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <LoadingSpinner 
          message="جاري تحميل بيانات الأطباء..."
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
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل بيانات الأطباء. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'الأطباء غير متاحين';
      errorMessage = 'عذراً، بيانات الأطباء غير متاحة حالياً.';
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
          <title>{`خطأ | الأطباء | ${clinicName}`}</title>
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
  if (!data || doctors.length === 0) {
    return (
      <>
        <Helmet>
          <title>{`الأطباء | ${clinicName}`}</title>
        </Helmet>
        <Navbar />
        <EmptyState
          type="default"
          title="لا يوجد أطباء"
          message="عذراً، لا توجد بيانات للأطباء حالياً. يرجى العودة لاحقاً."
          actionText="تحديث الصفحة"
          onAction={handleRetry}
          fullPage={false}
        />
      </>
    );
  }

  // No results after filtering
  const noResults = filteredDoctors.length === 0;

  // Calculate statistics
  const totalDoctors = doctors.length;
  const totalSpecialties = specialties.length - 1;
  const totalExperience = doctors.reduce((sum, doctor) => sum + (doctor.experience || 0), 0);
  const avgExperience = totalDoctors > 0 ? Math.round(totalExperience / totalDoctors) : 0;

  // SEO for Doctors Page
  const pageTitle = `أطباؤنا المتميزون | ${clinicName}`;
  const pageDescription = `تعرف على فريق أطباء ${clinicName} المتميزين. نخبة من أمهر الأطباء المتخصصين في التجميل والجلدية والعلاجات الطبية.`;

  // Structured Data (ItemList for doctors)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "description": pageDescription,
    "numberOfItems": totalDoctors,
    "itemListElement": doctors.map((doctor, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Person",
        "name": doctor.name,
        "jobTitle": doctor.specialty,
        "description": doctor.bio,
        "image": doctor.image,
        "worksFor": {
          "@type": "MedicalClinic",
          "name": clinicName
        },
        "knowsAbout": doctor.specialty,
        "experience": doctor.experience ? `${doctor.experience} سنوات خبرة` : undefined,
        "telephone": doctor.phone,
        "email": doctor.email,
        "sameAs": [
          doctor.instagram,
          doctor.facebook,
          doctor.linkedin
        ].filter(Boolean)
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
        "item": `${currentUrl.split('/doctors')[0]}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الأطباء",
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`أطباء, دكاترة, أطباء تجميل, أطباء جلدية, فريق طبي, ${clinicName}, أطباء ${clinicName}`} />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={clinicName} />
        <meta property="og:image" content={doctors[0]?.image || ""} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={doctors[0]?.image || ""} />
        
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
            {doctors.map((doctor, index) => (
              <div key={index}>
                <h2>{doctor.name}</h2>
                <p>{doctor.specialty}</p>
                <p>{doctor.bio}</p>
                <img src={doctor.image} alt={doctor.name} />
              </div>
            ))}
          </div>
        </div>
      </noscript>

      <Navbar />
      <div className="page-clinic-container" dir="rtl">
        <div className="about-content-wrapper">
        

         
          {/* Render Doctors based on device */}
          { 
            device === "mobile" ? (
              <DoctorsMobile data={{ ...data, doctors: filteredDoctors }} />
            ) : (
              <DoctorsDesktop data={{ ...data, doctors: filteredDoctors }} />
            )
          }

       
        </div>
      </div>
    </>
  );
}