import { Clock, Edit2, Heart, Save, Shield, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import styles from './BenefitsSection.module.css';

const BenefitsSection = ({ feature, fetchData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...feature });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  if (!feature) return null;

  // فنكشن عرض الإشعار
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // فنكشن حفظ البيانات (CREATE or UPDATE)
  const saveFeature = async (data) => {
    try {
      let response;
      
      // إذا كان يوجد id، نقوم بالتحديث (UPDATE)
      if (feature.id) {
        response = await AxiosInstance.put(`/services/feature/${feature.id}/`, data);
      } else {
        // إذا لم يوجد id، نقوم بالإضافة (CREATE)
        response = await AxiosInstance.post('/services/feature/', data);
      }
      
      return response.data;
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'فشل في حفظ البيانات');
    }
  };

  const handleEditClick = () => {
    setEditedData({ ...feature });
    setIsEditing(true);
    setError(null);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // حفظ البيانات عبر API (سواء create أو update)
      const savedData = await saveFeature(editedData);
      
      //   استخدام fetchData لإعادة تحميل البيانات بالكامل
      if (typeof fetchData === 'function') {
        await fetchData();
      }

      setIsEditing(false);
      showNotification('  تم حفظ المميزات بنجاح!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(`❌ ${err.message}`, 'error');
      console.error('Error saving data:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData({ ...feature });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const displayData = isEditing ? editedData : feature;

  // بناء مصفوفة الفوائد من البيانات
  const benefits = [
    {
      title: displayData.results_title,
      description: displayData.results_description,
      icon: Sparkles,
      fieldPrefix: 'results',
      placeholder: 'نتائج مذهلة وفعالة'
    },
    {
      title: displayData.safety_title,
      description: displayData.safety_description,
      icon: Shield,
      fieldPrefix: 'safety',
      placeholder: 'آمن ومعتمد'
    },
    {
      title: displayData.recovery_title,
      description: displayData.recovery_description,
      icon: Clock,
      fieldPrefix: 'recovery',
      placeholder: 'تعافي سريع'
    },
    {
      title: displayData.care_title,
      description: displayData.care_description,
      icon: Heart,
      fieldPrefix: 'care',
      placeholder: 'رعاية شاملة'
    }
  ];

  const hasData = feature.title || feature.subtitle || 
    benefits.some(b => b.title || b.description);

  return (
    <section className={styles.benefitsSection}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.container}>
        {/* زر التعديل */}
        <div className={styles.editHeader}>
          {!isEditing ? (
            <button onClick={handleEditClick} className={styles.editButton}>
              <Edit2 size={18} /> 
              {hasData ? 'تعديل المحتوى' : 'إضافة مميزات'}
            </button>
          ) : (
            <div className={styles.editActions}>
              <button 
                onClick={handleSaveClick} 
                className={styles.saveButton} 
                disabled={isSaving}
              >
                <Save size={18} /> 
                {isSaving ? 'جاري الحفظ...' : 'حفظ الكل'}
              </button>
              <button 
                onClick={handleCancelClick} 
                className={styles.cancelButton} 
                disabled={isSaving}
              >
                <X size={18} /> 
                إلغاء
              </button>
            </div>
          )}
        </div>

        {/* عرض رسالة الخطأ */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* الهيدر */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>لماذا ريجوفيرا؟</span>
          {isEditing ? (
            <>
              <input
                type="text"
                name="title"
                value={editedData.title || ''}
                onChange={handleChange}
                className={styles.editMainTitle}
                placeholder="العنوان الرئيسي (مثال: مميزات الخدمة)"
              />
              <input
                type="text"
                name="subtitle"
                value={editedData.subtitle || ''}
                onChange={handleChange}
                className={styles.editSubtitle}
                placeholder="العنوان الفرعي (مثال: نقدم لك تجربة استثنائية)"
              />
            </>
          ) : (
            <>
              <h2>
                مميزات <span className={styles.gold}>{displayData.title || 'الخدمة'}</span>
              </h2>
              <p>{displayData.subtitle}</p>
            </>
          )}
        </div>

        {/* عرض حالة عدم وجود بيانات */}
        {!isEditing && !hasData && (
          <div className={styles.emptyState}>
            <p>📭 لا توجد مميزات مضافة لهذه الخدمة بعد</p>
            <button onClick={handleEditClick} className={styles.emptyStateButton}>
              أضف مميزات الخدمة
            </button>
          </div>
        )}

        {/* عرض معلومات الحالة */}
        {!isEditing && hasData && (
          <div className={styles.statusInfo}>
            <span className={styles.statusBadge}>
              {benefits.filter(b => b.title).length} مميزات
            </span>
          </div>
        )}

        {/* شبكة البطاقات */}
        {hasData && (
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              const hasBenefitData = benefit.title || benefit.description;
              
              // في وضع التعديل، نظهر كل البطاقات
              // في وضع العرض، نظهر فقط البطاقات التي تحتوي على بيانات
              if (!isEditing && !hasBenefitData) return null;
              
              return (
                <div key={index} className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>
                    <IconComponent size={28} />
                  </div>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name={`${benefit.fieldPrefix}_title`}
                        value={editedData[`${benefit.fieldPrefix}_title`] || ''}
                        onChange={handleChange}
                        className={styles.editCardTitle}
                        placeholder={`عنوان الميزة (مثال: ${benefit.placeholder})`}
                      />
                      <textarea
                        name={`${benefit.fieldPrefix}_description`}
                        value={editedData[`${benefit.fieldPrefix}_description`] || ''}
                        onChange={handleChange}
                        className={styles.editCardDescription}
                        rows="2"
                        placeholder="وصف الميزة وفوائدها"
                      />
                    </>
                  ) : (
                    <>
                      <h3>{benefit.title}</h3>
                      <p>{benefit.description}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BenefitsSection;