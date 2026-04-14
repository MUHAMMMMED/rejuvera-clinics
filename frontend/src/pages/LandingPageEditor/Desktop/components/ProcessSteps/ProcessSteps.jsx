import * as Icons from 'lucide-react';
import React, { useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './ProcessSteps.module.css';

const ProcessSteps = ({ process_steps, fetchData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...process_steps });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  if (!process_steps) return null;

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const stepIcons = {
    consultation: 'Users',
    preparation: 'Shield',
    procedure: 'Sparkles',
    followup: 'Heart'
  };

  // فنكشن حفظ البيانات (CREATE or UPDATE)
  const saveServiceSteps = async (data) => {
    try {
      let response;
      
      // إذا كان يوجد id، نقوم بالتحديث (UPDATE)
      if (process_steps.id) {
        response = await AxiosInstance.put(`/services/service-steps/${process_steps.id}/`, data);
      } else {
        // إذا لم يوجد id، نقوم بالإضافة (CREATE)
        response = await AxiosInstance.post('/services/service-steps/', data);
      }
      
      return response.data;
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'فشل في حفظ البيانات');
    }
  };

  const handleEditClick = () => {
    setEditedData({ ...process_steps });
    setIsEditing(true);
    setError(null);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // حفظ البيانات عبر API
      const savedData = await saveServiceSteps(editedData);
      
      //   استخدام fetchData لإعادة تحميل البيانات بالكامل
      if (typeof fetchData === 'function') {
        await fetchData();
      }
      
      // تحديث editedData بالبيانات الجديدة
      setEditedData({ ...savedData });
      setIsEditing(false);
      showNotification('  تم حفظ خطوات الإجراء بنجاح!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(`❌ ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData({ ...process_steps });
    setError(null);
  };

  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon size={32} /> : null;
  };

  // التحقق من صحة البيانات قبل الحفظ
  const validateData = () => {
    const errors = [];
    if (!editedData.title) errors.push('العنوان الرئيسي مطلوب');
    if (!editedData.consultation_title) errors.push('عنوان الخطوة 1 مطلوب');
    if (!editedData.preparation_title) errors.push('عنوان الخطوة 2 مطلوب');
    if (!editedData.procedure_title) errors.push('عنوان الخطوة 3 مطلوب');
    if (!editedData.followup_title) errors.push('عنوان الخطوة 4 مطلوب');
    return errors;
  };

  const steps = [
    { 
      step: 1, 
      title: editedData.consultation_title, 
      desc: editedData.consultation_description, 
      duration: editedData.consultation_duration, 
      icon: stepIcons.consultation, 
      fieldPrefix: 'consultation',
      placeholder: 'مثال: استشارة مجانية'
    },
    { 
      step: 2, 
      title: editedData.preparation_title, 
      desc: editedData.preparation_description, 
      duration: editedData.preparation_duration, 
      icon: stepIcons.preparation, 
      fieldPrefix: 'preparation',
      placeholder: 'مثال: تحضيرات ما قبل العملية'
    },
    { 
      step: 3, 
      title: editedData.procedure_title, 
      desc: editedData.procedure_description, 
      duration: editedData.procedure_duration, 
      icon: stepIcons.procedure, 
      fieldPrefix: 'procedure',
      placeholder: 'مثال: إجراء العملية'
    },
    { 
      step: 4, 
      title: editedData.followup_title, 
      desc: editedData.followup_description, 
      duration: editedData.followup_duration, 
      icon: stepIcons.followup, 
      fieldPrefix: 'followup',
      placeholder: 'مثال: متابعة ما بعد العملية'
    }
  ];

  const displayData = isEditing ? editedData : process_steps;

  return (
    <section className={styles.processSection}>
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.editHeader}>
          {!isEditing ? (
            <button onClick={handleEditClick} className={styles.editButton}>
              <Icons.Edit2 size={18} /> تعديل الخطوات
            </button>
          ) : (
            <div className={styles.editActions}>
              <button 
                onClick={handleSaveClick} 
                className={styles.saveButton} 
                disabled={isSaving}
              >
                <Icons.Save size={18} /> {isSaving ? 'جاري الحفظ...' : 'حفظ الكل'}
              </button>
              <button 
                onClick={handleCancelClick} 
                className={styles.cancelButton} 
                disabled={isSaving}
              >
                <Icons.X size={18} /> إلغاء
              </button>
            </div>
          )}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {isEditing ? (
          <div className={styles.editHeaderSection}>
            <input 
              type="text" 
              name="title" 
              value={editedData.title || ''} 
              onChange={(e) => setEditedData(prev => ({ ...prev, title: e.target.value }))} 
              className={styles.editMainTitle} 
              placeholder="العنوان الرئيسي (مثال: خطوات الإجراء)"
            />
            <textarea 
              name="subtitle" 
              value={editedData.subtitle || ''} 
              onChange={(e) => setEditedData(prev => ({ ...prev, subtitle: e.target.value }))} 
              className={styles.editDescription} 
              rows="2" 
              placeholder="وصف قصير للخطوات (اختياري)"
            />
          </div>
        ) : (
          <SectionHeader 
            badge="خطوات الإجراء" 
            highlightText="خطوة بخطوة" 
            title={displayData.title || ''} 
            description={displayData.subtitle || ''} 
          />
        )}

        <div className={styles.processGrid}>
          {steps.map((step) => (
            <div key={step.step} className={styles.processCard}>
              <div className={styles.processNumber}>{step.step}</div>

              {isEditing ? (
                <>
                  <div className={styles.processIcon}>{getIcon(step.icon)}</div>
                  <input 
                    type="text" 
                    value={editedData[`${step.fieldPrefix}_title`] || ''} 
                    onChange={(e) => setEditedData(prev => ({ ...prev, [`${step.fieldPrefix}_title`]: e.target.value }))} 
                    className={styles.editStepTitle} 
                    placeholder={`عنوان الخطوة ${step.step} (مثال: ${step.placeholder})`}
                  />
                  <textarea 
                    value={editedData[`${step.fieldPrefix}_description`] || ''} 
                    onChange={(e) => setEditedData(prev => ({ ...prev, [`${step.fieldPrefix}_description`]: e.target.value }))} 
                    className={styles.editStepDesc} 
                    rows="3" 
                    placeholder={`وصف الخطوة ${step.step} (اختياري)`}
                  />
                  <input 
                    type="text" 
                    value={editedData[`${step.fieldPrefix}_duration`] || ''} 
                    onChange={(e) => setEditedData(prev => ({ ...prev, [`${step.fieldPrefix}_duration`]: e.target.value }))} 
                    className={styles.editDuration} 
                    placeholder="المدة (مثال: 30 دقيقة)"
                  />
                </>
              ) : (
                <>
                  <div className={styles.processIcon}>{getIcon(step.icon)}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  <span className={styles.processDuration}>{step.duration}</span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* عرض معلومات الحالة */}
        {!isEditing && process_steps.id && (
          <div className={styles.statusInfo}>
            <span className={styles.statusBadge}>
               تم تحديث آخر مرة
            </span>
          </div>
        )}
        
        {!isEditing && !process_steps.id && (
          <div className={styles.statusInfo}>
            <span className={styles.statusBadgeWarning}>
              ⚠️ لم تتم إضافة خطوات بعد، اضغط تعديل للإضافة
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProcessSteps;