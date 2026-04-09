// import { useEffect, useState } from "react";
// import AxiosInstance from "../../components/Authentication/AxiosInstance";
// import useDevice from "../../hooks/useDevice";
// import HomeDesktop from "./components/Desktop/Desktop";
// import HomeMobile from "./components/Mobile/Mobile";

// export default function Home() {
//   const device = useDevice();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const clinicName = "Rejuvera Clinics";
//   useEffect(() => {
//     AxiosInstance
//       .get("/home/")
//       .then((res) => {
//         setData(res.data);
//         setLoading(false);
 
//       })
//       .catch((err) => {
//         console.error("Error fetching home data:", err);
//         setError(err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error loading data</div>;

//   // اختبار عرض بعض البيانات للتأكد
//   return (
//     <div>
   
//       {device === "mobile" ? (
//         <HomeMobile data={data} clinicName={clinicName}/>
//       ) : (
//         <HomeDesktop data={data} clinicName={clinicName} />
//       )}


//     </div>
//   );
// }
 




import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import EmptyState from "../../components/EmptyState/EmptyState";
import ErrorState from "../../components/ErrorState/ErrorState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import useDevice from "../../hooks/useDevice";
import HomeDesktop from "./components/Desktop/Desktop";
import HomeMobile from "./components/Mobile/Mobile";

export default function Home() {
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
      console.error("Error fetching home data:", err);
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
          <title>{`جاري التحميل | ${clinicName}`}</title>
        </Helmet>
        <LoadingSpinner
          message="جاري تحميل الصفحة الرئيسية..."
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
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.';
    
    // Check for specific error types
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'الصفحة غير متاحة';
      errorMessage = 'عذراً، البيانات المطلوبة غير متاحة حالياً.';
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
          <title>{`الصفحة الرئيسية | ${clinicName}`}</title>
        </Helmet>
        <EmptyState 
          type="default"
          title="لا توجد بيانات"
          message="عذراً، لا تتوفر بيانات للصفحة الرئيسية حالياً."
          actionText="تحديث الصفحة"
          onAction={handleRetry}
          fullPage={true}
        />
      </>
    );
  }

  // ✅ Safe Data with defaults
  const safeData = {
    hero: {},
    services: [],
    doctors: [],
    testimonials: [],
    about: {},
    contact: {},
    ...data,
  };

  // ✅ Structured Data for SEO (Homepage)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": clinicName,
    "description": safeData.hero?.description || `مرحباً بكم في ${clinicName} - أفضل عيادات التجميل`,
    "url": window.location.href,
    "mainEntity": {
      "@type": "MedicalClinic",
      "name": clinicName,
      "image": safeData.hero?.image || "",
      "medicalSpecialty": safeData.hero?.title || "التجميل والعناية بالبشرة",
      "availableService": (safeData.services || []).map(service => ({
        "@type": "MedicalProcedure",
        "name": service.name,
        "description": service.description
      }))
    }
  };

  return (
    <>
      <Helmet>
        <title>{clinicName} | أفضل عيادات التجميل</title>
        
        <meta name="description" content={safeData.hero?.description || `مرحباً بكم في ${clinicName} - نقدم أفضل خدمات التجميل والعناية بالبشرة`} />
        
        <meta property="og:title" content={clinicName} />
        <meta property="og:description" content={safeData.hero?.description || "أفضل عيادات التجميل"} />
        <meta property="og:image" content={safeData.hero?.image || ""} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={clinicName} />
        <meta name="twitter:description" content={safeData.hero?.description || "أفضل عيادات التجميل"} />
        <meta name="twitter:image" content={safeData.hero?.image || ""} />
        
        <link rel="canonical" href={window.location.href} />
        
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Fallback for SEO bots */}
      <noscript>
        <div>
          <h1>{clinicName}</h1>
          <p>{safeData.hero?.description || "أفضل عيادات التجميل"}</p>
          <img src={safeData.hero?.image} alt={clinicName} />
        </div>
      </noscript>

      {device === "mobile" ? (
        <HomeMobile data={safeData} clinicName={clinicName} />
      ) : (
        <HomeDesktop data={safeData} clinicName={clinicName} />
      )}
    </>
  );
}