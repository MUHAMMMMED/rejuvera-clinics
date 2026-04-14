import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import EmptyState from "../../components/EmptyState/EmptyState";
import ErrorState from "../../components/ErrorState/ErrorState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import useDevice from "../../hooks/useDevice";
  
import { GTMEvents } from "../../hooks/useGTM";
import DesktopLanding from "./components/Desktop/Desktop";
import MobileLanding from "./components/Mobile/Mobile";

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

      // ✅ GTM: View Service
      GTMEvents.viewService(id, res.data?.name || "");

    } catch (err) {
      console.error("Error fetching service details:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, retryCount]);

  const handleRetry = () => setRetryCount(prev => prev + 1);

  if (loading) {
    return (
      <>
        <Helmet><title>{`جاري التحميل | ${clinicName}`}</title></Helmet>
        <LoadingSpinner message="جاري تحميل معلومات الخدمة..." size="large" fullPage={true} />
      </>
    );
  }

  if (error) {
    let errorType = 'error';
    let errorTitle = 'حدث خطأ';
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.';

    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'خدمة غير موجودة';
      errorMessage = 'الخدمة التي تبحث عنها غير موجودة.';
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
        <Helmet><title>{`خطأ | ${clinicName}`}</title></Helmet>
        <ErrorState type={errorType} title={errorTitle} message={errorMessage} onRetry={handleRetry} fullPage={true} />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Helmet><title>{`الخدمة غير متاحة | ${clinicName}`}</title></Helmet>
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
      "name": safeData.service_doctors?.[0]?.doctor?.name || "Doctor",
    },
    "employee": (safeData.service_doctors || []).map(d => ({
      "@type": "Person",
      "name": d.doctor?.name || "",
      "jobTitle": d.doctor?.title || "",
      "image": d.doctor?.image || "",
    })),
    "review": (safeData.before_after || []).map(item => ({
      "@type": "Review",
      "reviewBody": item.description || "",
      "author": { "@type": "Person", "name": "Patient" },
      "image": [item.before_image, item.after_image].filter(Boolean),
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": parseFloat(safeData.trust?.satisfaction_rate) || 0,
      "reviewCount": safeData.before_after?.length || 0,
    },
    "faq": (safeData.faqs || []).map(faq => ({
      "@type": "Question",
      "name": faq.question || "",
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer || "" },
    })),
  };

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
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <noscript>
        <div>
          <h1>{safeData.name} | {clinicName}</h1>
          <p>{safeData.description}</p>
          <img src={safeData.hero?.image} alt={safeData.hero?.alt_text || ""} />
        </div>
      </noscript>

      {device === "mobile" ? (
        <MobileLanding data={safeData} clinicName={clinicName} />
      ) : (
        <DesktopLanding data={safeData} clinicName={clinicName} />
      )}
    </>
  );
}