 
// // import React, { useState } from 'react';
// // import useDashboardData from '../Dashboard/components/hooks/useDashboardData';
// // import './Dashboard.css';
// // import Toast from './components/common/Toast/Toast';
// // import Header from './components/layout/Header/Header';
// // import Sidebar from './components/layout/Sidebar/Sidebar';
// // import AnalyticsDashboard from './components/sections/AnalyticsDashboard/AnalyticsDashboard';
// // import AppointmentsSection from './components/sections/AppointmentsSection/AppointmentsSection';
// // import CategoriesSection from './components/sections/CategoriesSection/CategoriesSection';
// // import DoctorsSection from './components/sections/DoctorsSection/DoctorsSection';
// // import FAQsSection from './components/sections/FAQsSection/FAQsSection';
// // import GallerySection from './components/sections/GallerySection/GallerySection';
// // import PackagesSection from './components/sections/PackagesSection/PackagesSection';
// // import ServicesSection from './components/sections/ServicesSection/ServicesSection';
// // import SiteInfoSection from './components/sections/SiteInfoSection/SiteInfoSection';
// // import StatsSection from './components/sections/StatsSection/StatsSection';
// // import TrackingDashboard from './components/sections/TrackingDashboard/TrackingDashboard';

// // const Dashboard = () => {
// //   const [activeTab, setActiveTab] = useState('dashboard');
// //   const [toast, setToast] = useState(null);
// //   const { data, loading, error, refetch } = useDashboardData();

// //   const showToast = (message, type = 'success') => {
// //     setToast({ message, type });
// //     setTimeout(() => setToast(null), 3000);
// //   };

// //   const renderContent = () => {
// //     // Show loading state
// //     if (loading) {
// //       return (
// //         <div className="loading-container">
// //           <div className="loading-spinner-large"></div>
// //           <p>جاري تحميل البيانات...</p>
// //         </div>
// //       );
// //     }

// //     // Show error state
// //     if (error) {
// //       return (
// //         <div className="error-container">
// //           <div className="error-icon">⚠️</div>
// //           <h3>حدث خطأ</h3>
// //           <p>{error}</p>
// //           <button className="btn-primary" onClick={refetch}>إعادة المحاولة</button>
// //         </div>
// //       );
// //     }

// //     // Check if data exists before rendering
// //     if (!data) {
// //       return (
// //         <div className="loading-container">
// //           <p>لا توجد بيانات</p>
// //         </div>
// //       );
// //     }

// //     switch (activeTab) {
// //       case 'dashboard': 
// //         return <StatsSection data={data} />;
// //       case 'analytics': 
// //         return <AnalyticsDashboard data={data} showToast={showToast} onRefresh={refetch} />;
// //       case 'appointments': 
// //         return <AppointmentsSection 
// //           appointments={data.appointments || []} 
// //           showToast={showToast} 
// //           onRefresh={refetch} 
// //         />;
// //       case 'categories': 
// //         return <CategoriesSection 
// //           categories={data.categories || []} 
// //           showToast={showToast} 
// //           onRefresh={refetch} 
// //         />;
// //       case 'services': 
// //         return <ServicesSection 
// //           categories={data.categories || []}
// //           showToast={showToast} 
// //           onRefresh={refetch} 
// //         />;
// //       case 'doctors': 
// //         return <DoctorsSection 
// //           doctors={data.doctors || []} 
// //           showToast={showToast} 
// //           onRefresh={refetch} 
// //         />;
// //       case 'packages': 
// //         return <PackagesSection
// //           packages={data.packages || []} 
// //           showToast={showToast} 
// //           onRefresh={refetch} 
// //         />;
// //       case 'gallery': 
// //         return <GallerySection 
// //           gallery={data.gallery || []} 
// //           showToast={showToast} 
// //           onRefresh={refetch} 
// //         />;
// //       case 'faqs': 
// //         return <FAQsSection 
// //           faqs={data.faqs || []} 
// //           showToast={showToast} 
// //           onRefresh={refetch} 
// //         />;
// //       case 'siteinfo': 
// //         return <SiteInfoSection 
// //           info={data.info} 
// //           showToast={showToast} 
// //           onRefresh={refetch} 
// //         />;
// //       case 'tracking': 
// //         return <TrackingDashboard 
// //           sources={data.source || []} 
// //           appointments={data.appointments || []}
// //           showToast={showToast} 
// //           onRefresh={refetch} 
// //         />;
// //       default: 
// //         return <StatsSection data={data} />;
// //     }
// //   };

// //   return (
// //     <div className="dashboard-app">
// //       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
// //       <main className="main-content">
// //         <Header siteInfo={data?.info || null} />
// //         <div className="content-area">
// //           {renderContent()}
// //         </div>
// //       </main>
// //       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
// //     </div>
// //   );
// // };

// // export default Dashboard;



// import React, { useState } from 'react';
// import useDashboardData from '../Dashboard/components/hooks/useDashboardData';
// import './Dashboard.css';
// import Toast from './components/common/Toast/Toast';
// import Header from './components/layout/Header/Header';
// import Sidebar from './components/layout/Sidebar/Sidebar';
// import AnalyticsDashboard from './components/sections/AnalyticsDashboard/AnalyticsDashboard';
// import AppointmentsSection from './components/sections/AppointmentsSection/AppointmentsSection';
// import CategoriesSection from './components/sections/CategoriesSection/CategoriesSection';
// import DoctorsSection from './components/sections/DoctorsSection/DoctorsSection';
// import FAQsSection from './components/sections/FAQsSection/FAQsSection';
// import GallerySection from './components/sections/GallerySection/GallerySection';
// import PackagesSection from './components/sections/PackagesSection/PackagesSection';
// import ServicesSection from './components/sections/ServicesSection/ServicesSection';
// import SiteInfoSection from './components/sections/SiteInfoSection/SiteInfoSection';
// import StatsSection from './components/sections/StatsSection/StatsSection';
// import TrackingDashboard from './components/sections/TrackingDashboard/TrackingDashboard';
// // NEW IMPORTS - Add these
// import BlogsSection from './components/sections/BlogsSection/BlogsSection';
// import DevicesSection from './components/sections/DevicesSection/DevicesSection';

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [toast, setToast] = useState(null);
//   const { data, loading, error, refetch } = useDashboardData();

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const renderContent = () => {
//     // Show loading state
//     if (loading) {
//       return (
//         <div className="loading-container">
//           <div className="loading-spinner-large"></div>
//           <p>جاري تحميل البيانات...</p>
//         </div>
//       );
//     }

//     // Show error state
//     if (error) {
//       return (
//         <div className="error-container">
//           <div className="error-icon">⚠️</div>
//           <h3>حدث خطأ</h3>
//           <p>{error}</p>
//           <button className="btn-primary" onClick={refetch}>إعادة المحاولة</button>
//         </div>
//       );
//     }

//     // Check if data exists before rendering
//     if (!data) {
//       return (
//         <div className="loading-container">
//           <p>لا توجد بيانات</p>
//         </div>
//       );
//     }

//     switch (activeTab) {
//       case 'dashboard': 
//         return <StatsSection data={data} />;
//       case 'analytics': 
//         return <AnalyticsDashboard data={data} showToast={showToast} onRefresh={refetch} />;
//       case 'appointments': 
//         return <AppointmentsSection 
//           appointments={data.appointments || []} 
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       case 'categories': 
//         return <CategoriesSection 
//           categories={data.categories || []} 
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       case 'services': 
//         return <ServicesSection 
//           categories={data.categories || []}
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       case 'doctors': 
//         return <DoctorsSection 
//           doctors={data.doctors || []} 
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       case 'packages': 
//         return <PackagesSection
//           packages={data.packages || []} 
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       case 'gallery': 
//         return <GallerySection 
//           gallery={data.gallery || []} 
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       case 'faqs': 
//         return <FAQsSection 
//           faqs={data.faqs || []} 
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       case 'siteinfo': 
//         return <SiteInfoSection 
//           info={data.info} 
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       case 'tracking': 
//         return <TrackingDashboard 
//           sources={data.source || []} 
//           appointments={data.appointments || []}
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       // NEW CASES - Add these
//       case 'blogs':
//         return <BlogsSection 
//           blogs={data.blogs || []} 
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       case 'devices':
//         return <DevicesSection 
//           devices={data.devices || []} 
//           showToast={showToast} 
//           onRefresh={refetch} 
//         />;
//       default: 
//         return <StatsSection data={data} />;
//     }
//   };

//   return (
//     <div className="dashboard-app">
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
//       <main className="main-content">
//         <Header siteInfo={data?.info || null} />
//         <div className="content-area">
//           {renderContent()}
//         </div>
//       </main>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState } from 'react';
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import useDashboardData from '../Dashboard/components/hooks/useDashboardData';
import './Dashboard.css';
import Toast from './components/common/Toast/Toast';
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
 
 
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const { data, loading, error, refetch } = useDashboardData();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get skeleton type based on active tab
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
    // Show loading state with skeleton for better UX
    if (loading) {
      // For dashboard and analytics, show skeleton loader instead of spinner
      if (activeTab === 'dashboard' || activeTab === 'analytics') {
        return (
          <div className="dashboard-skeleton">
            <SkeletonLoader type={getSkeletonType()} count={4} />
          </div>
        );
      }
      
      // For other sections, show spinner
      return (
        <LoadingSpinner 
          message={`جاري تحميل ${getTabName(activeTab)}...`}
          size="large"
          fullPage={false}
        />
      );
    }

    // Show error state with retry
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

    // Check if data exists
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

    // Check if specific section has data
    const hasSectionData = () => {
      switch (activeTab) {
        case 'appointments': return data.appointments?.length > 0;
        case 'categories': return data.categories?.length > 0;
        case 'services': return data.categories?.length > 0;
        case 'doctors': return data.doctors?.length > 0;
        case 'packages': return data.packages?.length > 0;
        case 'gallery': return data.gallery?.length > 0;
        case 'faqs': return data.faqs?.length > 0;
        case 'blogs': return data.blogs?.length > 0;
        case 'devices': return data.devices?.length > 0;
        default: return true;
      }
    };

    // Show empty state for sections without data
    if (!hasSectionData() && activeTab !== 'dashboard' && activeTab !== 'analytics' && activeTab !== 'siteinfo' && activeTab !== 'tracking') {
      return (
        <EmptyState 
          type="default"
          title={`لا توجد ${getTabName(activeTab)}`}
          message={`لم يتم العثور على أي ${getTabName(activeTab)}. يمكنك إضافة ${getTabName(activeTab)} جديدة من خلال زر الإضافة.`}
          actionText={`إضافة ${getTabName(activeTab)} جديد`}
          onAction={() => {
            // You can add logic to open add modal here
            showToast(`سيتم إضافة ${getTabName(activeTab)} قريباً`, 'info');
          }}
        />
      );
    }

    // Render different sections based on active tab
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
  };

  // Helper function to get tab name in Arabic
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
          {renderContent()}
        </div>
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Dashboard;