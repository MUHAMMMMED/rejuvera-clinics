import PropTypes from 'prop-types';
import React from 'react';
import {
  FaBlog,
  FaCalendarCheck,
  FaClipboardList,
  FaFolder,
  FaGift,
  FaImages,
  FaMobileAlt,
  FaQuestion,
  FaUserMd
} from 'react-icons/fa';
import './StatsSection.css';

const StatCard = ({ stat, index, maxValue }) => {
  const Icon = stat.icon;
  const percentage = maxValue > 0 ? (stat.value / maxValue) * 100 : 0;
  
  return (
    <div 
      className="ss-stat-card" 
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className="ss-stat-card-content">
        <div 
          className="ss-stat-card-icon" 
          style={{ 
            backgroundColor: `${stat.color}15`, 
            color: stat.color,
            borderColor: `${stat.color}30`
          }}
        >
          <Icon size={20} />
        </div>
        <div className="ss-stat-card-info">
          <div className="ss-stat-card-value">{stat.value.toLocaleString()}</div>
          <div className="ss-stat-card-label">{stat.label}</div>
        </div>
      </div>
      <div 
        className="ss-stat-card-progress" 
        style={{ 
          width: `${percentage}%`,
          backgroundColor: stat.color 
        }} 
      />
    </div>
  );
};

StatCard.propTypes = {
  stat: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired
};

const StatsSection = ({ data = {}, isLoading = false }) => {
  // Memoize calculations for performance
  const statsData = React.useMemo(() => {
    const totalServices = data.categories?.reduce((sum, cat) => sum + (cat.services?.length || 0), 0) || 0;
    const totalAppointments = data.appointments?.length || 0;
    const totalDoctors = data.doctors?.length || 0;
    const totalPackages = data.packages?.length || 0;
    const totalGallery = data.gallery?.length || 0;
    const totalFAQs = data.faqs?.length || 0;
    const totalDevices = data.devices?.length || 0;
    const totalBlogs = data.blogs?.length || 0;
    
    return {
      totalServices,
      totalAppointments,
      totalDoctors,
      totalPackages,
      totalGallery,
      totalFAQs,
      totalDevices,
      totalBlogs,
      totalCategories: data.categories?.length || 0
    };
  }, [data]);

  const stats = [
    { label: 'الخدمات', value: statsData.totalServices, icon: FaClipboardList, color: '#10b981' },
    { label: 'الفئات', value: statsData.totalCategories, icon: FaFolder, color: '#3b82f6' },
    { label: 'المواعيد', value: statsData.totalAppointments, icon: FaCalendarCheck, color: '#f59e0b' },
    { label: 'الأطباء', value: statsData.totalDoctors, icon: FaUserMd, color: '#8b5cf6' },
    { label: 'الباقات', value: statsData.totalPackages, icon: FaGift, color: '#ec4899' },
    { label: 'المعرض', value: statsData.totalGallery, icon: FaImages, color: '#06b6d4' },
    { label: 'الأسئلة', value: statsData.totalFAQs, icon: FaQuestion, color: '#6b7280' },
    { label: 'الأجهزة', value: statsData.totalDevices, icon: FaMobileAlt, color: '#14b8a6' },
    { label: 'المدونات', value: statsData.totalBlogs, icon: FaBlog, color: '#f97316' }
  ];

  const maxValue = Math.max(...stats.map(s => s.value), 1);

  // Loading state
  if (isLoading) {
    return (
      <div className="ss-stats-wrap">
        <div className="ss-stats-loading">
          <div className="ss-loading-spinner"></div>
          <p>جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  // Empty data state
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="ss-stats-wrap">
        <div className="ss-stats-empty">
          <FaClipboardList size={48} />
          <h3>لا توجد بيانات</h3>
          <p>لم يتم العثور على أي إحصائيات لعرضها</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ss-stats-wrap">
      <div className="ss-stats-header">
        <div className="ss-stats-header-left">
          <div className="ss-stats-icon">
            <FaClipboardList size={18} />
          </div>
          <div>
            <h1 className="ss-stats-title">نظرة عامة</h1>
            <p className="ss-stats-subtitle">إحصائيات وإجماليات النظام</p>
          </div>
        </div>
        <div className="ss-stats-header-right">
          <div className="ss-stats-date">
            {new Date().toLocaleDateString('ar-EG')}
          </div>
        </div>
      </div>

      <div className="ss-stats-grid">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            stat={stat}
            index={index}
            maxValue={maxValue}
          />
        ))}
      </div>
    </div>
  );
};

StatsSection.propTypes = {
  data: PropTypes.shape({
    categories: PropTypes.array,
    appointments: PropTypes.array,
    doctors: PropTypes.array,
    packages: PropTypes.array,
    gallery: PropTypes.array,
    faqs: PropTypes.array,
    devices: PropTypes.array,
    blogs: PropTypes.array,
  }),
  isLoading: PropTypes.bool
};

StatsSection.defaultProps = {
  data: {},
  isLoading: false
};

export default StatsSection;