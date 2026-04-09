import * as Icons from 'lucide-react';
import React, { useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './ProcessSteps.module.css';

const ProcessSteps = ({ process_steps, onprocess_stepsUpdate }) => {
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

  const updateServiceProcedure = async (id, data) => {
    try {
      const response = await AxiosInstance.put(`/services/service-steps/${id}/`, data);
      return response.data;
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'فشل في تحديث البيانات');
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
      const updatedData = await updateServiceProcedure(process_steps.id, editedData);

      if (typeof onprocess_stepsUpdate === 'function') {
        onprocess_stepsUpdate(updatedData);
      }

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

  const steps = [
    { step: 1, title: editedData.consultation_title, desc: editedData.consultation_description, duration: editedData.consultation_duration, icon: stepIcons.consultation, fieldPrefix: 'consultation' },
    { step: 2, title: editedData.preparation_title, desc: editedData.preparation_description, duration: editedData.preparation_duration, icon: stepIcons.preparation, fieldPrefix: 'preparation' },
    { step: 3, title: editedData.procedure_title, desc: editedData.procedure_description, duration: editedData.procedure_duration, icon: stepIcons.procedure, fieldPrefix: 'procedure' },
    { step: 4, title: editedData.followup_title, desc: editedData.followup_description, duration: editedData.followup_duration, icon: stepIcons.followup, fieldPrefix: 'followup' }
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
              <button onClick={handleSaveClick} className={styles.saveButton} disabled={isSaving}>
                <Icons.Save size={18} /> {isSaving ? 'جاري الحفظ...' : '  حفظ الكل'}
              </button>
              <button onClick={handleCancelClick} className={styles.cancelButton} disabled={isSaving}>
                <Icons.X size={18} /> إلغاء
              </button>
            </div>
          )}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {isEditing ? (
          <div className={styles.editHeaderSection}>
            <input type="text" name="title" value={editedData.title || ''} onChange={(e) => setEditedData(prev => ({ ...prev, title: e.target.value }))} className={styles.editMainTitle} placeholder="العنوان الرئيسي" />
            <textarea name="subtitle" value={editedData.subtitle || ''} onChange={(e) => setEditedData(prev => ({ ...prev, subtitle: e.target.value }))} className={styles.editDescription} rows="2" placeholder="الوصف" />
          </div>
        ) : (
          <SectionHeader badge="خطوات الإجراء" highlightText="خطوة بخطوة" title={displayData.title || ''} description={displayData.subtitle || ''} />
        )}

        <div className={styles.processGrid}>
          {steps.map((step) => (
            <div key={step.step} className={styles.processCard}>
              <div className={styles.processNumber}>{step.step}</div>

              {isEditing ? (
                <>
                  <div className={styles.processIcon}>{getIcon(step.icon)}</div>
                  <input type="text" value={editedData[`${step.fieldPrefix}_title`] || ''} onChange={(e) => setEditedData(prev => ({ ...prev, [`${step.fieldPrefix}_title`]: e.target.value }))} className={styles.editStepTitle} placeholder="العنوان" />
                  <textarea value={editedData[`${step.fieldPrefix}_description`] || ''} onChange={(e) => setEditedData(prev => ({ ...prev, [`${step.fieldPrefix}_description`]: e.target.value }))} className={styles.editStepDesc} rows="3" placeholder="الوصف" />
                  <input type="text" value={editedData[`${step.fieldPrefix}_duration`] || ''} onChange={(e) => setEditedData(prev => ({ ...prev, [`${step.fieldPrefix}_duration`]: e.target.value }))} className={styles.editDuration} placeholder="المدة" />
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
      </div>
    </section>
  );
};

export default ProcessSteps;