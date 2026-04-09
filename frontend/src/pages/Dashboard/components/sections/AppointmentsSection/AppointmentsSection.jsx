import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

import { Icons } from '../../common/Icons/Icons';
import './AppointmentsSection.css';

const AppointmentsSection = ({ appointments: initialAppointments, showToast }) => {
  const [appointments, setAppointments] = useState(initialAppointments || []);
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setAppointments(initialAppointments || []);
  }, [initialAppointments]);

  const getStatusBadge = (itemType) => {
    const styles = {
      s: { bg: '#10b981', text: 'خدمة' },
      p: { bg: '#f59e0b', text: 'باقة' }
    };
    const style = styles[itemType] || styles.s;
    return <span className="ss-badge" style={{ background: style.bg + '15', color: style.bg }}>{style.text}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-EG');
  };

  const filteredAppointments = appointments.filter(apt => {
    let matchesStatus = filterStatus === 'all' || apt.item_type === filterStatus;
    let matchesSearch = searchTerm === '' ||
      apt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone?.includes(searchTerm) ||
      apt.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.package_name?.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesDate = true;
    if (startDate && apt.created_at?.split('T')[0] < startDate) matchesDate = false;
    if (endDate && apt.created_at?.split('T')[0] > endDate) matchesDate = false;
    return matchesStatus && matchesSearch && matchesDate;
  });

  const hasActiveFilters = filterStatus !== 'all' || startDate !== '' || endDate !== '' || searchTerm !== '';

  const clearFilters = () => {
    setFilterStatus('all');
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
  };

  const exportToExcel = () => {
    const exportData = filteredAppointments.map(apt => ({
      'الاسم': apt.name,
      'الهاتف': apt.phone,
      'النوع': apt.item_type === 's' ? 'خدمة' : 'باقة',
      'العنوان': apt.service_name || apt.package_name,
      'تاريخ الحجز': formatDate(apt.created_at)
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المواعيد');
    XLSX.writeFile(wb, `المواعيد_${new Date().toISOString().split('T')[0]}.xlsx`);
    if (showToast) showToast('تم تصدير البيانات بنجاح', 'success');
  };

  return (
    <div className="ss-wrap">
      {/* Header */}
      <div className="ss-header">
        <div className="ss-header-left">
          <div className="ss-icon">
            <Icons.Appointments />
          </div>
          <div>
            <h1 className="ss-title">المواعيد</h1>
            <p className="ss-subtitle">عرض وإدارة حجوزات الخدمات والباقات</p>
          </div>
        </div>
        <div className="ss-header-buttons">
          <button className="ss-btn-primary" onClick={exportToExcel}>
            <Icons.Download size={16} />
            <span>تصدير إلى Excel</span>
          </button>
        </div>
      </div>

      {/* Stat Bar */}
      <div className="ss-stat-bar">
        <span className="ss-stat-value">{appointments.length}</span>
        <span className="ss-stat-label">موعد إجمالاً</span>
        <span className="ss-stat-sep">·</span>
        <span className="ss-stat-value">{filteredAppointments.length}</span>
        <span className="ss-stat-label">ظاهرة الآن</span>
        <span className="ss-stat-sep">·</span>
        <span className="ss-stat-value">{appointments.filter(a => a.item_type === 's').length}</span>
        <span className="ss-stat-label">خدمة</span>
        <span className="ss-stat-sep">·</span>
        <span className="ss-stat-value">{appointments.filter(a => a.item_type === 'p').length}</span>
        <span className="ss-stat-label">باقة</span>
      </div>

      {/* Filters Toolbar */}
      <div className="ss-filters-toolbar">
        <div className="ss-search">
   
          <input
            type="text"
            placeholder="بحث بالاسم أو الهاتف..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="ss-clear" onClick={() => setSearchTerm('')}>
              <Icons.X size={13} />
            </button>
          )}
        </div>

        <select
          className="ss-filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">جميع الأنواع</option>
          <option value="s">خدمات</option>
          <option value="p">باقات</option>
        </select>

        <div className="ss-date-range">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="من تاريخ"
          />
          <span className="ss-date-sep">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="إلى تاريخ"
          />
        </div>

        {hasActiveFilters && (
          <button className="ss-clear-filters" onClick={clearFilters}>
            <Icons.X size={14} />
            <span>مسح الكل</span>
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="ss-table-container">
        <table className="ss-data-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الهاتف</th>
              <th>النوع</th>
              <th>العنوان</th>
              <th>تاريخ الحجز</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((apt, index) => (
              <tr key={apt.id || index} style={{ animationDelay: `${index * 0.03}s` }}>
                <td>
                  <div className="ss-patient-info">
                    <div className="ss-patient-avatar">{apt.name?.charAt(0) || '?'}</div>
                    <div className="ss-patient-name">{apt.name}</div>
                  </div>
                </td>
                <td className="ss-phone-cell">{apt.phone}</td>
                <td>{getStatusBadge(apt.item_type)}</td>
                <td className="ss-item-title">{apt.service_name || apt.package_name}</td>
                <td className="ss-date-cell">{formatDate(apt.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAppointments.length === 0 && (
          <div className="ss-empty">
            <Icons.Calendar size={48} />
            <h3>لا توجد مواعيد مطابقة</h3>
            <p>حاول تغيير معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsSection;