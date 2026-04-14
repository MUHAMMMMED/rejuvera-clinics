import { Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import styles from './DoctorsSection.module.css';

const DoctorsSection = ({ doctorsData, serviceId, fetchData}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDoctors, setEditedDoctors] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [showDoctorSelector, setShowDoctorSelector] = useState(false);

  // فنكشن عرض الإشعار
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // جلب قائمة الأطباء المتاحين
  useEffect(() => {
    if (serviceId && serviceId !== 'undefined') {
      fetchAvailableDoctors();
    }
  }, [serviceId]);

  const fetchAvailableDoctors = async () => {
    try {
      const response = await AxiosInstance.get('/services/doctor/');
      setAvailableDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  // التحقق من صحة serviceId
  if (!serviceId || serviceId === 'undefined') {
    console.error('Invalid serviceId:', serviceId);
    return null;
  }

  // if (!doctorsData || doctorsData.length === 0) return null;

  // تهيئة بيانات التعديل
  const initializeEditData = () => {
    setEditedDoctors(doctorsData.map(item => ({ 
      id: item.id,
      doctor_id: item.doctor.id,
      doctor: { ...item.doctor }
    })));
  };

  // فنكشن تحديث البيانات عبر API
  const updateServiceDoctors = async (serviceDoctorsData) => {
    try {
      const promises = [];
      
      // جلب الـ service_doctors الحالية
      const currentResponse = await AxiosInstance.get(`/services/service-doctors/?service=${Number(serviceId)}`);
      const currentServiceDoctors = currentResponse.data;
      
 
      const newDoctorIds = serviceDoctorsData.map(sd => sd.doctor_id);
      const toDelete = currentServiceDoctors.filter(csd => !newDoctorIds.includes(csd.doctor));
      
      // حذف اللي مش موجودين
      for (const item of toDelete) {
        promises.push(AxiosInstance.delete(`/services/service-doctors/${item.id}/`));
      }
      
      // إضافة اللي موجودين في البيانات الجديدة
      for (const serviceDoctor of serviceDoctorsData) {
        // لو كان الـ service_doctor موجود بالفعل ن跳过
        const exists = currentServiceDoctors.some(csd => csd.doctor === serviceDoctor.doctor_id);
        if (!exists) {
        
          promises.push(AxiosInstance.post('/services/service-doctors/', {
            service: Number(serviceId),
            doctor: serviceDoctor.doctor_id
          }));
        }
      }
      
      await Promise.all(promises);
      
      // جلب البيانات المحدثة
      const updatedResponse = await AxiosInstance.get(`/services/service-doctors/?service=${Number(serviceId)}`);
      return updatedResponse.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'فشل في تحديث الأطباء');
    }
  };

  const handleEditClick = () => {
    initializeEditData();
    setIsEditing(true);
    setError(null);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updatedDoctors = await updateServiceDoctors(editedDoctors);
      
      if (typeof onDoctorsUpdate === 'function') {
        onDoctorsUpdate(updatedDoctors);
      }

      setIsEditing(false);
      showNotification(' تم حفظ الأطباء بنجاح!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(`  ${err.message}`, 'error');
      console.error('Error saving data:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedDoctors([]);
    setError(null);
  };

  // إضافة دكتور موجود
  const handleAddDoctor = (doctorId) => {
    const doctor = availableDoctors.find(d => d.id === parseInt(doctorId));
    if (doctor && !editedDoctors.some(d => d.doctor_id === doctor.id)) {
      setEditedDoctors(prev => [...prev, {
        id: null,
        doctor_id: doctor.id,
        doctor: { ...doctor }
      }]);
      showNotification(`  تم إضافة الدكتور ${doctor.name} مؤقتاً، اضغط "حفظ الكل" لتأكيد الإضافة`, 'success');
    }
    setShowDoctorSelector(false);
  };

  // إزالة دكتور من الخدمة
  const handleRemoveDoctor = (index) => {
    const doctorName = editedDoctors[index].doctor.name;
    if (window.confirm(`هل أنت متأكد من إزالة الدكتور ${doctorName}؟`)) {
      setEditedDoctors(prev => prev.filter((_, i) => i !== index));
      showNotification(`  تم إزالة الدكتور ${doctorName} مؤقتاً، اضغط "حفظ الكل" لتأكيد الإزالة`, 'success');
    }
  };

  const displayDoctors = isEditing ? editedDoctors : doctorsData;

  return (
    <section className={styles.doctorsSection}>
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
              إدارة الأطباء
            </button>
          ) : (
            <div className={styles.editActions}>
              <button 
                onClick={handleSaveClick} 
                className={styles.saveButton}
                disabled={isSaving}
              >
                <Save size={18} />
                {isSaving ? 'جاري الحفظ...' : '  حفظ الكل'}
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

        {/* نافذة اختيار الدكتور */}
        {showDoctorSelector && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>اختر الدكتور</h3>
              <div className={styles.doctorList}>
                {availableDoctors
                  .filter(d => !editedDoctors.some(ed => ed.doctor_id === d.id))
                  .map(doctor => (
                    <div 
                      key={doctor.id} 
                      className={styles.doctorOption}
                      onClick={() => handleAddDoctor(doctor.id)}
                    >
                      <img src={doctor.image} alt={doctor.name} />
                      <div>
                        <strong>{doctor.name}</strong>
                        <p>{doctor.title}</p>
                        <small>{doctor.experience} سنة خبرة</small>
                      </div>
                    </div>
                  ))}
                {availableDoctors.filter(d => !editedDoctors.some(ed => ed.doctor_id === d.id)).length === 0 && (
                  <p className={styles.noDoctors}>لا يوجد أطباء متاحون للإضافة</p>
                )}
              </div>
              <button onClick={() => setShowDoctorSelector(false)} className={styles.closeModal}>
                إغلاق
              </button>
            </div>
          </div>
        )}

        {/* Header ثابت - بدون تعديل */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>أطباؤنا</span>
          <h2>نخبة <span className={styles.gold}>الأطباء الخبراء</span></h2>
          <p>فريق طبي متميز يمتلك خبرات عالمية</p>
        </div>
        
        <div className={styles.doctorsGrid}>
          {displayDoctors.map((item, index) => (
            <div key={item.id || index} className={styles.doctorCard}>
              <img src={item.doctor?.image} alt={item.doctor?.name} />
              <h3>{item.doctor?.name}</h3>
              <p>{item.doctor?.title}</p>
              <span className={styles.doctorExperience}>{item.doctor?.experience} سنة خبرة</span>
              {isEditing && (
                <div className={styles.doctorActions}>
                  <button 
                    onClick={() => handleRemoveDoctor(index)}
                    className={styles.removeDoctorBtn}
                  >
                    <Trash2 size={14} />
                    إزالة
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* زر إضافة دكتور جديد في وضع التعديل */}
        {isEditing && (
          <div className={styles.addButtonWrapper}>
            <button onClick={() => setShowDoctorSelector(true)} className={styles.addButton}>
              <Plus size={18} />
              إضافة دكتور موجود
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsSection;