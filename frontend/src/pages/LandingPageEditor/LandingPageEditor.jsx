 

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import DashboardHeader from "../../components/DashboardHeader/DashboardHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import ErrorState from "../../components/ErrorState/ErrorState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import DesktopLanding from "./Desktop/Desktop";
 
export default function LandingPageEditor() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    if (!id) {
      setError(new Error("No service ID provided"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await AxiosInstance.get(`/services/dashboard/service/${id}/details/`);
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
          <title>جاري التحميل | محرر الصفحة</title>
        </Helmet>
        <LoadingSpinner 
          message="جاري تحميل بيانات الخدمة..."
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
    } else if (error.response?.status === 403) {
      errorType = 'error';
      errorTitle = 'غير مصرح';
      errorMessage = 'ليس لديك صلاحية للوصول إلى هذه الصفحة.';
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
          <title>{`خطأ | محرر الصفحة`}</title>
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
          <title>لا توجد بيانات | محرر الصفحة</title>
        </Helmet>
        <EmptyState
          type="default"
          title="لا توجد بيانات"
          message="عذراً، لا تتوفر بيانات لهذه الخدمة حالياً."
          actionText="العودة للخدمات"
          onAction={() => window.location.href = '/services'}
          fullPage={true}
        />
      </>
    );
  }

  // ✅ Safe Data
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

  return (
    <>
      <Helmet>
        <title>{`تعديل: ${safeData.name || 'الخدمة'} | لوحة التحكم`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <DashboardHeader
        title={safeData?.name || 'تعديل الخدمة'}
        showBackButton={true}
        backUrl="/services"
      />
      
      <div className="landing-editor-container">
        <DesktopLanding data={safeData} fetchData={fetchData} />
      </div>
    </>
  );
}
 