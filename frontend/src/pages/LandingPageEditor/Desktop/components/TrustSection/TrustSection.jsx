import { Award, CheckCircle2, Edit2, Save, ThumbsUp, Users, X } from 'lucide-react';
import React, { useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import styles from './TrustSection.module.css';

const TrustSection = ({ trust, fetchData, onTrustUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...trust });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null); 

  if (!trust) return null;

  // فنكشن عرض الإشعار
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // فنكشن تحديث البيانات عبر API (CREATE or UPDATE)
  const saveServiceTrust = async (data) => {
    try {
      let response;
      
      // إذا كان يوجد id، نقوم بالتحديث (UPDATE)
      if (trust.id) {
        response = await AxiosInstance.put(`/services/service-trust/${trust.id}/`, data);
      } else {
        // إذا لم يوجد id، نقوم بالإضافة (CREATE)
        response = await AxiosInstance.post('/services/service-trust/', data);
      }
      
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'فشل في حفظ بيانات الثقة');
    }
  };

  // لما نضغط تعديل
  const handleEditClick = () => {
    setEditedData({ ...trust });
    setIsEditing(true);
    setError(null);
  };

  // لما نضغط حفظ
  const handleSaveClick = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // حفظ البيانات عبر API (سواء create أو update)
      const savedTrust = await saveServiceTrust(editedData);

      // طريقة 1: استخدام callback إذا وجد
      if (typeof onTrustUpdate === 'function') {
        onTrustUpdate(savedTrust);
      }
      
      // طريقة 2: استخدام fetchData إذا وجد (لإعادة تحميل البيانات بالكامل)
      if (typeof fetchData === 'function') {
        await fetchData();
      }

      // تحديث الـ editedData بالبيانات الجديدة
      setEditedData({ ...savedTrust });
      
      setIsEditing(false);
      showNotification('✅ تم حفظ إحصائيات الثقة بنجاح!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(`❌ ${err.message}`, 'error');
      console.error('Error saving data:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // إلغاء التعديل
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData({ ...trust });
    setError(null);
  };

  // التعامل مع تغيير الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    // التحقق من أن القيمة رقم صحيح
    const numberValue = value === '' ? '' : Number(value);
    setEditedData(prev => ({ ...prev, [name]: numberValue }));
  };

  // التحقق من صحة البيانات قبل الحفظ
  const validateData = () => {
    const errors = [];
    if (editedData.experience_years && isNaN(editedData.experience_years)) {
      errors.push('سنوات الخبرة يجب أن تكون رقم');
    }
    if (editedData.success_operations && isNaN(editedData.success_operations)) {
      errors.push('العمليات الناجحة يجب أن تكون رقم');
    }
    if (editedData.doctors_count && isNaN(editedData.doctors_count)) {
      errors.push('عدد الأطباء يجب أن يكون رقم');
    }
    if (editedData.satisfaction_rate && (isNaN(editedData.satisfaction_rate) || editedData.satisfaction_rate > 100)) {
      errors.push('نسبة الرضا يجب أن تكون رقم أقل من 100');
    }
    return errors;
  };

  // البيانات اللي هتتعرض
  const displayData = isEditing ? editedData : trust;

  const stats = [
    { 
      number: displayData.experience_years, 
      label: 'سنة خبرة', 
      icon: Award,
      fieldName: 'experience_years',
      suffix: '',
      placeholder: 'مثال: 15'
    },
    { 
      number: displayData.success_operations, 
      label: 'عملية ناجحة', 
      icon: CheckCircle2,
      fieldName: 'success_operations',
      suffix: '+',
      placeholder: 'مثال: 5000'
    },
    { 
      number: displayData.doctors_count, 
      label: 'طبيب استشاري', 
      icon: Users,
      fieldName: 'doctors_count',
      suffix: '',
      placeholder: 'مثال: 25'
    },
    { 
      number: displayData.satisfaction_rate, 
      label: 'رضا العملاء', 
      icon: ThumbsUp,
      fieldName: 'satisfaction_rate',
      suffix: '%',
      placeholder: 'مثال: 98'
    }
  ];

  return (
    <section className={styles.trustSection}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.container}>
        {/* زر التعديل */}
        <div className={styles.trustHeader}>
          {!isEditing ? (
            <button onClick={handleEditClick} className={styles.editButton}>
              <Edit2 size={18} />
              تعديل الإحصائيات
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

        <div className={styles.trustGrid}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={styles.trustCard}>
                <Icon size={32} />
                
                {isEditing ? (
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      name={stat.fieldName}
                      value={editedData[stat.fieldName] || ''}
                      onChange={handleChange}
                      className={styles.editInput}
                      placeholder={stat.placeholder}
                      min="0"
                      step="1"
                    />
                    {stat.suffix && <span className={styles.inputSuffix}>{stat.suffix}</span>}
                  </div>
                ) : (
                  <span className={styles.trustNumber}>
                    {stat.number}{stat.suffix}
                  </span>
                )}
                
                <span className={styles.trustLabel}>{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* عرض معلومات الحالة */}
        {!isEditing && trust.id && (
          <div className={styles.statusInfo}>
            <span className={styles.statusBadge}>
              ✅ تم تحديث آخر مرة
            </span>
          </div>
        )}
        
        {!isEditing && !trust.id && (
          <div className={styles.statusInfo}>
            <span className={styles.statusBadgeWarning}>
              ⚠️ لم يتم إضافة إحصائيات بعد، اضغط تعديل للإضافة
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrustSection;