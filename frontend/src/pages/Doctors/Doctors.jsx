import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
 
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Navbar from '../../components/Navbar/Navbar';
import useDevice from "../../hooks/useDevice";
import { GTMEvents } from '../../hooks/useGTM';
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

  // ✅ GTM: Page View عند تحميل الصفحة
  useEffect(() => {
    GTMEvents.pageView("doctors_page");
  }, []);

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

  // ✅ GTM: تتبع النقر على طبيب
  const handleDoctorClick = (doctor) => {
    GTMEvents.viewContent(doctor.id, doctor.name, 'doctor');
  };

  // ✅ GTM: تتبع البحث
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() !== "") {
      GTMEvents.viewContent('search', value, 'doctor_search');
    }
  };

  // ✅ GTM: تتبع التصفية حسب التخصص
  const handleSpecialtyFilter = (specialty) => {
    setSelectedSpecialty(specialty);
    if (specialty !== "all") {
      GTMEvents.viewContent(specialty, specialty, 'doctor_filter');
    }
  };

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
  const totalExperience = doctors.reduce((sum, doctor) => sum + (parseInt(doctor.experience) || 0), 0);
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

  // ✅ إضافة دوال GTM إلى البيانات التي ستمرر للمكونات الفرعية
  const enhancedData = {
    ...data,
    doctors: filteredDoctors,
    onDoctorClick: handleDoctorClick
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
          {/* Search and Filter Section */}
          <div className="doctors-search-filter">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="ابحث عن طبيب..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="doctors-search-input"
              />
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" />
              </svg>
            </div>

            <div className="specialties-filter">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  className={`specialty-btn ${selectedSpecialty === specialty ? 'active' : ''}`}
                  onClick={() => handleSpecialtyFilter(specialty)}
                >
                  {specialty === 'all' ? 'الكل' : specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          {searchTerm && (
            <div className="doctors-results-count">
              تم العثور على {filteredDoctors.length} {filteredDoctors.length === 1 ? 'طبيب' : 'أطباء'}
            </div>
          )}

          {/* No Results */}
          {noResults && (
            <div className="doctors-no-results">
              <div className="no-results-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3>لا يوجد أطباء</h3>
              <p>لم نعثر على أطباء تطابق بحثك. حاول بكلمات مختلفة.</p>
              <button className="clear-search-btn" onClick={() => handleSearch("")}>
                مسح البحث
              </button>
            </div>
          )}

          {/* Render Doctors based on device */}
          {!noResults && (
            device === "mobile" ? (
              <DoctorsMobile data={enhancedData} />
            ) : (
              <DoctorsDesktop data={enhancedData} />
            )
          )}
        </div>
      </div>
    </>
  );
}