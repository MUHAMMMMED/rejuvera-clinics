import React, { useState } from 'react';
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import Toast from './components/common/Toast/Toast';
import useDashboardData from './components/hooks/useDashboardData'; // ✅ Fixed import path
import Header from './components/layout/Header/Header';
import Sidebar from './components/layout/Sidebar/Sidebar';
import AnalyticsDashboard from './components/sections/AnalyticsDashboard/AnalyticsDashboard';
import AppointmentsSection from './components/sections/AppointmentsSection/AppointmentsSection';
import BlogsSection from './components/sections/BlogsSection/BlogsSection';
import CategoriesSection from './components/sections/CategoriesSection/CategoriesSection';
import DevicesSection from './components/sections/DevicesSection/DevicesSection';
import DoctorsSection from './components/sections/DoctorsSection/DoctorsSection';
import FAQsSection from './components/sections/FAQsSection/FAQsSection';
import GallerySection from './components/sections/GallerySection/GallerySection';
import PackagesSection from './components/sections/PackagesSection/PackagesSection';
import ServicesSection from './components/sections/ServicesSection/ServicesSection';
import SiteInfoSection from './components/sections/SiteInfoSection/SiteInfoSection';
import StatsSection from './components/sections/StatsSection/StatsSection';
import TrackingDashboard from './components/sections/TrackingDashboard/TrackingDashboard';
import './Dashboard.css';

// ✅ Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px 20px', 
          background: '#fff', 
          color: '#721c24',
          direction: 'rtl',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h3 style={{ color: '#dc3545', marginBottom: '16px' }}>
            ⚠️ حدث خطأ تقني
          </h3>
          <p style={{ marginBottom: '12px', color: '#666' }}>
            {this.state.error?.toString() || 'حدث خطأ غير متوقع'}
          </p>
          <details style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'left',
            maxWidth: '80%',
            overflow: 'auto'
          }}>
            <summary style={{ cursor: 'pointer', color: '#0066cc' }}>
              تفاصيل الخطأ (للأمانة الفنية)
            </summary>
            <pre style={{ fontSize: '12px', marginTop: '8px' }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '24px',
              padding: '10px 24px',
              background: '#c9a227',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const { data, loading, error, refetch } = useDashboardData();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getSkeletonType = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'analytics':
        return 'card';
      case 'appointments':
      case 'doctors':
      case 'categories':
      case 'services':
      case 'packages':
      case 'blogs':
      case 'devices':
        return 'list';
      case 'gallery':
        return 'card';
      default:
        return 'card';
    }
  };

  const renderContent = () => {
    if (loading) {
      if (activeTab === 'dashboard' || activeTab === 'analytics') {
        return (
          <div className="dashboard-skeleton">
            <SkeletonLoader type={getSkeletonType()} count={4} />
          </div>
        );
      }
      
      return (
        <LoadingSpinner 
          message={`جاري تحميل ${getTabName(activeTab)}...`}
          size="large"
          fullPage={false}
        />
      );
    }

    if (error) {
      let errorType = 'error';
      let errorTitle = 'حدث خطأ';
      let errorMessage = 'عذراً، حدث خطأ أثناء تحميل بيانات لوحة التحكم.';

      if (error.response?.status === 401) {
        errorType = 'error';
        errorTitle = 'غير مصرح';
        errorMessage = 'يرجى تسجيل الدخول مرة أخرى للوصول إلى لوحة التحكم.';
      } else if (error.response?.status === 403) {
        errorType = 'error';
        errorTitle = 'غير مصرح';
        errorMessage = 'ليس لديك صلاحية للوصول إلى هذه البيانات.';
      } else if (error.response?.status === 500) {
        errorType = 'server';
        errorTitle = 'خطأ في الخادم';
        errorMessage = 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.';
      } else if (error.code === 'ERR_NETWORK') {
        errorType = 'network';
        errorTitle = 'مشكلة في الاتصال';
        errorMessage = 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
      }

      return (
        <ErrorState 
          type={errorType}
          title={errorTitle}
          message={errorMessage}
          onRetry={refetch}
          fullPage={false}
        />
      );
    }

    if (!data) {
      return (
        <EmptyState 
          type="default"
          title="لا توجد بيانات"
          message="لم يتم العثور على بيانات في لوحة التحكم."
          actionText="تحديث الصفحة"
          onAction={refetch}
        />
      );
    }

    // ✅ Safely render sections with error boundary
    try {
      switch (activeTab) {
        case 'dashboard': 
          return <StatsSection data={data} />;
          
        case 'analytics': 
          return <AnalyticsDashboard data={data} showToast={showToast} onRefresh={refetch} />;
          
        case 'appointments': 
          return <AppointmentsSection 
            appointments={data.appointments || []} 
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        case 'categories': 
          return <CategoriesSection 
            categories={data.categories || []} 
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        case 'services': 
          return <ServicesSection 
            categories={data.categories || []}
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        case 'doctors': 
          return <DoctorsSection 
            doctors={data.doctors || []} 
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        case 'packages': 
          return <PackagesSection
            packages={data.packages || []} 
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        case 'gallery': 
          return <GallerySection 
            gallery={data.gallery || []} 
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        case 'faqs': 
          return <FAQsSection 
            faqs={data.faqs || []} 
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        case 'siteinfo': 
          return <SiteInfoSection 
            info={data.info} 
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        case 'tracking': 
          return <TrackingDashboard 
            sources={data.source || []} 
            appointments={data.appointments || []}
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        case 'blogs':
          return <BlogsSection 
            blogs={data.blogs || []} 
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        case 'devices':
          return <DevicesSection 
            devices={data.devices || []} 
            showToast={showToast} 
            onRefresh={refetch} 
          />;
          
        default: 
          return <StatsSection data={data} />;
      }
    } catch (err) {
      console.error('Error rendering section:', err);
      return (
        <ErrorState 
          type="error"
          title="خطأ في عرض البيانات"
          message={`حدث خطأ أثناء عرض قسم ${getTabName(activeTab)}`}
          onRetry={refetch}
          fullPage={false}
        />
      );
    }
  };

  const getTabName = (tab) => {
    const names = {
      dashboard: 'الإحصائيات',
      analytics: 'التحليلات',
      appointments: 'المواعيد',
      categories: 'التصنيفات',
      services: 'الخدمات',
      doctors: 'الأطباء',
      packages: 'الباقات',
      gallery: 'المعرض',
      faqs: 'الأسئلة الشائعة',
      siteinfo: 'معلومات الموقع',
      tracking: 'التتبع',
      blogs: 'المدونات',
      devices: 'الأجهزة'
    };
    return names[tab] || 'البيانات';
  };

  return (
    <div className="dashboard-app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header siteInfo={data?.info || null} />
        <div className="content-area">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </div>
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Dashboard;