import { Award, CheckCircle2, Edit2, Save, ThumbsUp, Users, X } from 'lucide-react';
import React, { useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import styles from './TrustSection.module.css';

const TrustSection = ({ trust, onTrustUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...trust });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null); 

  if (!trust) return null;

  // فنكشن عرض الإشعار
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    // إخفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // فنكشن تحديث البيانات عبر API
  const updateServiceTrust = async (id, data) => {
    try {
      const response = await AxiosInstance.put(`/services/service-trust/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'فشل في تحديث بيانات الثقة');
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
      const updatedTrust = await updateServiceTrust(trust.id, editedData);

      // تحديث البيانات في الـ parent
      if (typeof onTrustUpdate === 'function') {
        onTrustUpdate(updatedTrust);
      }

      setIsEditing(false);
      showNotification('  تم حفظ إحصائيات الثقة بنجاح!', 'success');
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
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  // البيانات اللي هتتعرض
  const displayData = isEditing ? editedData : trust;

  const stats = [
    { 
      number: displayData.experience_years, 
      label: 'سنة خبرة', 
      icon: Award,
      fieldName: 'experience_years'
    },
    { 
      number: displayData.success_operations, 
      label: 'عملية ناجحة', 
      icon: CheckCircle2,
      fieldName: 'success_operations'
    },
    { 
      number: displayData.doctors_count, 
      label: 'طبيب استشاري', 
      icon: Users,
      fieldName: 'doctors_count'
    },
    { 
      number: displayData.satisfaction_rate, 
      label: 'رضا العملاء', 
      icon: ThumbsUp,
      fieldName: 'satisfaction_rate'
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
                {isSaving ? 'جاري الحفظ...' : 'حفظ'}
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
                  <input
                    type="text"
                    name={stat.fieldName}
                    value={editedData[stat.fieldName] || ''}
                    onChange={handleChange}
                    className={styles.editInput}
                    placeholder={stat.label}
                  />
                ) : (
                  <span className={styles.trustNumber}>{stat.number}</span>
                )}
                
                <span className={styles.trustLabel}>{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;