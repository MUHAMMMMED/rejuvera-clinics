 
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import EmptyState from "../../components/EmptyState/EmptyState";
import ErrorState from "../../components/ErrorState/ErrorState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import useDevice from "../../hooks/useDevice";
import DesktopLanding from './components/Desktop/Desktop';
import MobileLanding from './components/Mobile/Mobile';
 
 
export default function LandingPage() {
  const { id } = useParams();
  const device = useDevice();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const clinicName = "Rejuvera Clinics";

  const fetchData = async () => {
    if (!id) {
      setError(new Error("No service ID provided"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await AxiosInstance.get(`/services/service/${id}/details/`);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching service details:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, retryCount]);

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
          message="جاري تحميل معلومات الخدمة..."
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
      errorTitle = 'خدمة غير موجودة';
      errorMessage = 'الخدمة التي تبحث عنها غير موجودة. قد تكون قد حُذفت أو تم تغيير رابطها.';
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
          <title>{`الخدمة غير متاحة | ${clinicName}`}</title>
        </Helmet>
        <EmptyState 
          type="default"
          title="لا توجد بيانات"
          message="عذراً، لا تتوفر بيانات لهذه الخدمة حالياً."
          actionText="العودة للرئيسية"
          onAction={() => window.location.href = '/'}
          fullPage={true}
        />
      </>
    );
  }

  // ✅ Safe Data (VERY IMPORTANT)
  const safeData = {
    service_doctors: [],
    before_after: [],
    faqs: [],
    procedure_module: {},
    problem_solution: {},
    trust: {},
    hero: {},
    ...data,
  };

  // ✅ Structured Data (SEO)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",

    "name": `${safeData.name} | ${clinicName}`,
    "description": safeData.description || "",
    "url": window.location.href,

    "image": safeData.hero?.image || "",
    "medicalSpecialty": safeData.hero?.title || "",

    "founder": {
      "@type": "Person",
      "name": safeData.service_doctors?.[0]?.doctor?.name || "Doctor"
    },

    "employee": (safeData.service_doctors || []).map((d) => ({
      "@type": "Person",
      "name": d.doctor?.name || "",
      "jobTitle": d.doctor?.title || "",
      "image": d.doctor?.image || "",
      "experience": d.doctor?.experience || "",
      "sameAs": d.doctor?.instagram || ""
    })),

    "review": (safeData.before_after || []).map((item) => ({
      "@type": "Review",
      "reviewBody": item.description || "",
      "author": { "@type": "Person", "name": "Patient" },
      "image": [item.before_image, item.after_image].filter(Boolean)
    })),

    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": parseFloat(safeData.trust?.satisfaction_rate) || 0,
      "reviewCount": safeData.before_after?.length || 0
    },

    "faq": (safeData.faqs || []).map((faq) => ({
      "@type": "Question",
      "name": faq.question || "",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer || ""
      }
    })),

    "procedureModule": {
      "title": safeData.procedure_module?.title || "",
      "subtitle": safeData.procedure_module?.subtitle || "",
      "description": safeData.procedure_module?.description || "",
      "consultationTitle": safeData.procedure_module?.consultation_title || "",
      "consultationDescription": safeData.procedure_module?.consultation_description || "",
      "preparationTitle": safeData.procedure_module?.preparation_title || "",
      "preparationDescription": safeData.procedure_module?.preparation_description || "",
      "procedureTitle": safeData.procedure_module?.procedure_title || "",
      "procedureDescription": safeData.procedure_module?.procedure_description || "",
      "followupTitle": safeData.procedure_module?.followup_title || "",
      "followupDescription": safeData.procedure_module?.followup_description || ""
    },

    "problemSolution": {
      "problemTitle": safeData.problem_solution?.problem_title || "",
      "problemDescription": safeData.problem_solution?.problem_description || "",
      "problemImage": safeData.problem_solution?.problem_image || "",
      "solutionTitle": safeData.problem_solution?.solution_title || "",
      "solutionDescription": safeData.problem_solution?.solution_description || "",
      "solutionImage": safeData.problem_solution?.solution_image || ""
    },

    "videos": safeData.hero?.video_url ? [safeData.hero.video_url] : []
  };

  // ✅ Fallback (SEO bots)
  const fallbackContent = (
    <noscript>
      <div>
        <h1>{safeData.name} | {clinicName}</h1>
        <p>{safeData.description}</p>
        <img src={safeData.hero?.image} alt={safeData.hero?.alt_text || ""} />
      </div>
    </noscript>
  );

  return (
    <>
      <Helmet>
        <title>{`${safeData.name} | ${clinicName}`}</title>

        <meta name="description" content={safeData.description || ""} />

        <meta property="og:title" content={`${safeData.name} | ${clinicName}`} />
        <meta property="og:description" content={safeData.description || ""} />
        <meta property="og:image" content={safeData.hero?.image || ""} />
        <meta property="og:url" content={window.location.href} />

        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {fallbackContent}

      {device === "mobile" ? (
        <MobileLanding data={safeData} clinicName={clinicName} />
      ) : (
        <DesktopLanding data={safeData} clinicName={clinicName} />
      )}
    </>
  );
}