import { ChevronLeft, ChevronRight, Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import styles from './BeforeAfterSection.module.css';

const BeforeAfterSection = ({ before_after, resultsData, onBeforeAfterUpdate, serviceId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [imageFiles, setImageFiles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const intervalRef = useRef(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (!isEditing && before_after.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % before_after.length);
      }, 5000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [before_after.length, isEditing]);

  const initializeEditData = () => {
    setEditedItems(before_after.map(item => ({ ...item })));
    setImageFiles({});
  };

 
  const updateBeforeAfterItems = async (items) => {
    try {
      const promises = [];
      
      for (const item of items) {
        if (item.id) {
 
          const hasNewBeforeImage = imageFiles[`before_${item.id}`];
          const hasNewAfterImage = imageFiles[`after_${item.id}`];
          
          let formData = new FormData();
          formData.append('title', item.title);
          formData.append('description', item.description || '');
          formData.append('service', Number(serviceId));
          
 
          if (hasNewBeforeImage) {
            formData.append('before_image', hasNewBeforeImage);
          } else if (item.before_image) {
 
            const response = await fetch(item.before_image);
            const blob = await response.blob();
            const file = new File([blob], 'before_image.jpg', { type: blob.type });
            formData.append('before_image', file);
          }
          
          if (hasNewAfterImage) {
            formData.append('after_image', hasNewAfterImage);
          } else if (item.after_image) {
            const response = await fetch(item.after_image);
            const blob = await response.blob();
            const file = new File([blob], 'after_image.jpg', { type: blob.type });
            formData.append('after_image', file);
          }
          
          promises.push(AxiosInstance.put(`/services/before-after-images/${item.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }));
        } else if (item.isNew) {
          // للإضافة الجديدة
          let formData = new FormData();
          formData.append('title', item.title);
          formData.append('description', item.description || '');
          formData.append('service', Number(serviceId));
          
          const beforeImage = imageFiles[`before_${item.tempId}`];
          const afterImage = imageFiles[`after_${item.tempId}`];
          
          if (!beforeImage) throw new Error('الرجاء إضافة صورة "قبل"');
          if (!afterImage) throw new Error('الرجاء إضافة صورة "بعد"');
          
          formData.append('before_image', beforeImage);
          formData.append('after_image', afterImage);
          
          promises.push(AxiosInstance.post('/services/before-after-images/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }));
        }
      }
      
      // حذف العناصر
      const deletedIds = before_after.filter(old => 
        !items.some(newItem => newItem.id === old.id)
      ).map(old => old.id);
      
      for (const id of deletedIds) {
        promises.push(AxiosInstance.delete(`/services/before-after-images/${id}/`));
      }
      
      const responses = await Promise.all(promises);
      return responses.map(r => r.data);
    } catch (error) {
     
      throw new Error(error.response?.data?.message || 'فشل في تحديث البيانات');
    }
  };

  const handleEditClick = () => {
    initializeEditData();
    setIsEditing(true);
    setError(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updatedItems = await updateBeforeAfterItems(editedItems);
      
      if (typeof onBeforeAfterUpdate === 'function') {
        onBeforeAfterUpdate(updatedItems.filter(item => item !== undefined));
      }

      setIsEditing(false);
      setShowModal(false);
      setEditingItem(null);
      showNotification('  تم حفظ المعرض بنجاح!', 'success');
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
    setEditedItems([]);
    setImageFiles({});
    setError(null);
    setShowModal(false);
    setEditingItem(null);
  };

  const openAddModal = () => {
    setEditingItem({
      title: '',
      description: '',
      before_image: null,
      after_image: null,
      before_preview: null,
      after_preview: null,
      isNew: true,
      tempId: Date.now()
    });
    setEditingIndex(null);
    setShowModal(true);
  };

  const openEditModal = (index) => {
    const item = editedItems[index];
    setEditingItem({
      ...item,
      before_preview: item.before_image,
      after_preview: item.after_image
    });
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleSaveItem = () => {
    if (!editingItem.title) {
      showNotification('  الرجاء إدخال عنوان للعنصر', 'error');
      return;
    }
    
    if (editingIndex !== null) {
      setEditedItems(prev => prev.map((item, i) => 
        i === editingIndex ? { ...editingItem } : item
      ));
    } else {
      setEditedItems(prev => [...prev, { ...editingItem }]);
    }
    
    setShowModal(false);
    setEditingItem(null);
    setEditingIndex(null);
    showNotification('  تم حفظ العنصر مؤقتاً، اضغط "حفظ الكل" لتأكيد التغييرات', 'success');
  };

  const handleDeleteItem = (index) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      setEditedItems(prev => prev.filter((_, i) => i !== index));
      if (currentIndex >= editedItems.length - 1 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
      showNotification('  تم حذف العنصر مؤقتاً، اضغط "حفظ الكل" لتأكيد الحذف', 'success');
    }
  };

  const handleModalImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file instanceof File) {
      const imageKey = `${type}_${editingItem.id || editingItem.tempId}`;
      setImageFiles(prev => ({ ...prev, [imageKey]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem(prev => ({ ...prev, [`${type}_preview`]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (isEditing ? editedItems.length : before_after.length));
    if (!isEditing) resetInterval();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (isEditing ? editedItems.length : before_after.length)) % (isEditing ? editedItems.length : before_after.length));
    if (!isEditing) resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % before_after.length);
      }, 5000);
    }
  };

  // if ((!before_after || before_after.length === 0) && !isEditing) return null;

  const displayItems = isEditing ? editedItems : before_after;
  const currentItem = displayItems[currentIndex];

  return (
    <section className={styles.beforeAfterSection}>
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingItem?.isNew ? '➕ إضافة صورة جديدة' : '✏️ تعديل الصورة'}</h3>
              <button onClick={() => setShowModal(false)} className={styles.closeModalBtn}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalImageSection}>
                <label className={styles.modalImageLabel}>
                  <span>📸 صورة قبل</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleModalImageChange(e, 'before')}
                  />
                </label>
                {editingItem?.before_preview && (
                  <img src={editingItem.before_preview} alt="Before preview" />
                )}
              </div>
              
              <div className={styles.modalImageSection}>
                <label className={styles.modalImageLabel}>
                  <span>📸 صورة بعد</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleModalImageChange(e, 'after')}
                  />
                </label>
                {editingItem?.after_preview && (
                  <img src={editingItem.after_preview} alt="After preview" />
                )}
              </div>
              
              <input
                type="text"
                value={editingItem?.title || ''}
                onChange={(e) => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="العنوان (مثال: نحت الخصر)"
                className={styles.modalInput}
              />
              
              <textarea
                value={editingItem?.description || ''}
                onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف النتيجة (اختياري)"
                rows="3"
                className={styles.modalTextarea}
              />
            </div>
            
            <div className={styles.modalFooter}>
              <button onClick={handleSaveItem} className={styles.modalSaveBtn}>
                <Save size={16} />
                حفظ
              </button>
              <button onClick={() => setShowModal(false)} className={styles.modalCancelBtn}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.editHeader}>
          {!isEditing ? (
            <button onClick={handleEditClick} className={styles.editButton}>
              <Edit2 size={18} />
              إدارة المعرض
            </button>
          ) : (
            <div className={styles.editActions}>
              <button onClick={handleSaveClick} className={styles.saveButton} disabled={isSaving}>
                <Save size={18} />
                {isSaving ? 'جاري الحفظ...' : '  حفظ الكل'}
              </button>
              <button onClick={handleCancelClick} className={styles.cancelButton} disabled={isSaving}>
                <X size={18} />
                إلغاء
              </button>
            </div>
          )}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>شاهدي النتائج</span>
          <h2>نتائج <span className={styles.gold}>قبل وبعد</span></h2>
          <p>{resultsData?.description || 'صور حقيقية لعملائنا توضح الفرق المبهر'}</p>
        </div>
        
        {displayItems.length > 0 ? (
          <>
            <div className={styles.sliderContainer}>
              <button className={styles.sliderBtn} onClick={prevSlide}>
                <ChevronRight size={32} />
              </button>
              
              <div className={styles.beforeAfterSlider}>
                <div className={styles.beforeAfterImages}>
                  <div className={styles.beforeImage}>
                    <img src={currentItem?.before_image} alt="Before" />
                    <span className={styles.label}>قبل</span>
                  </div>
                  <div className={styles.afterImage}>
                    <img src={currentItem?.after_image} alt="After" />
                    <span className={styles.label}>بعد</span>
                  </div>
                </div>
                <div className={styles.itemCaption}>
                  <h4>{currentItem?.title}</h4>
                  <p>{currentItem?.description}</p>
                </div>
              </div>
              
              <button className={styles.sliderBtn} onClick={nextSlide}>
                <ChevronLeft size={32} />
              </button>
            </div>
            
            <div className={styles.sliderDots}>
              {displayItems.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.dot} ${currentIndex === idx ? styles.active : ''}`}
                  onClick={() => {
                    setCurrentIndex(idx);
                    if (!isEditing) resetInterval();
                  }}
                />
              ))}
            </div>

            {isEditing && (
              <div className={styles.managementButtons}>
                <button onClick={openAddModal} className={styles.addButton}>
                  <Plus size={18} />
                  إضافة صورة جديدة
                </button>
                
                <div className={styles.itemsList}>
                  {displayItems.map((item, idx) => (
                    <div key={idx} className={styles.listItem}>
                      <div className={styles.listItemInfo}>
                        <span>{item.title}</span>
                        <small>{idx + 1}</small>
                      </div>
                      <div className={styles.listItemActions}>
                        <button onClick={() => openEditModal(idx)} className={styles.editItemBtn}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteItem(idx)} className={styles.deleteItemBtn}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>📭 لا توجد صور في المعرض</p>

        
              <button onClick={openAddModal} className={styles.addButtonEmpty}>
                <Plus size={18} />
                أضف أول صورة
              </button>
           
          </div>
        )}
      </div>
    </section>
  );
};

export default BeforeAfterSection;