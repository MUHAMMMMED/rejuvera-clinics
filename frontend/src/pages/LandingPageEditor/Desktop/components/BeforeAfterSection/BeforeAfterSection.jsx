import { ChevronLeft, ChevronRight, Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import styles from './BeforeAfterSection.module.css';

const BeforeAfterSection = ({ before_after, resultsData, fetchData, serviceId }) => {
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

  // Helper function to generate unique temp ID
  const generateTempId = () => Date.now() + Math.random();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (!isEditing && before_after && before_after.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % before_after.length);
      }, 5000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [before_after?.length, isEditing]);

  const initializeEditData = () => {
    if (before_after && before_after.length > 0) {
      setEditedItems(before_after.map(item => ({ ...item })));
    } else {
      setEditedItems([]);
    }
    setImageFiles({});
  };

  const saveBeforeAfterItems = async (items) => {
    try {
      const promises = [];
      
      for (const item of items) {
        if (item.id) {
          // Update existing item
          const hasNewBeforeImage = imageFiles[`before_${item.id}`];
          const hasNewAfterImage = imageFiles[`after_${item.id}`];
          
          let formData = new FormData();
          formData.append('title', item.title);
          formData.append('description', item.description || '');
          formData.append('service', Number(serviceId));
          
          if (hasNewBeforeImage) {
            formData.append('before_image', hasNewBeforeImage);
          } else if (item.before_image && typeof item.before_image === 'string' && !item.before_image.startsWith('data:')) {
            try {
              const response = await fetch(item.before_image);
              const blob = await response.blob();
              const file = new File([blob], 'before_image.jpg', { type: blob.type });
              formData.append('before_image', file);
            } catch (err) {
              console.warn('Could not fetch existing before image', err);
            }
          }
          
          if (hasNewAfterImage) {
            formData.append('after_image', hasNewAfterImage);
          } else if (item.after_image && typeof item.after_image === 'string' && !item.after_image.startsWith('data:')) {
            try {
              const response = await fetch(item.after_image);
              const blob = await response.blob();
              const file = new File([blob], 'after_image.jpg', { type: blob.type });
              formData.append('after_image', file);
            } catch (err) {
              console.warn('Could not fetch existing after image', err);
            }
          }
          
          promises.push(AxiosInstance.put(`/services/before-after-images/${item.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }));
        } else if (item.isNew) {
          // Add new item
          const tempId = item.tempId;
          let formData = new FormData();
          formData.append('title', item.title);
          formData.append('description', item.description || '');
          formData.append('service', Number(serviceId));
          
          const beforeImage = imageFiles[`before_${tempId}`];
          const afterImage = imageFiles[`after_${tempId}`];
          
          if (!beforeImage) {
            throw new Error('الرجاء إضافة صورة "قبل"');
          }
          if (!afterImage) {
            throw new Error('الرجاء إضافة صورة "بعد"');
          }
          
          formData.append('before_image', beforeImage);
          formData.append('after_image', afterImage);
          
          promises.push(AxiosInstance.post('/services/before-after-images/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }));
        }
      }
      
      // Delete items that were removed
      if (before_after && before_after.length > 0) {
        const deletedIds = before_after.filter(old => 
          !items.some(newItem => newItem.id === old.id)
        ).map(old => old.id);
        
        for (const id of deletedIds) {
          promises.push(AxiosInstance.delete(`/services/before-after-images/${id}/`));
        }
      }
      
      await Promise.all(promises);
      
      return true;
    } catch (error) {
      console.error('Save error:', error);
      throw new Error(error.response?.data?.message || 'فشل في حفظ البيانات');
    }
  };

  const handleEditClick = () => {
    initializeEditData();
    setIsEditing(true);
    setError(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const canSave = () => {
    if (!isEditing) return false;
    if (isSaving) return false;
    
    const hasInvalidNewItems = editedItems.some(item => {
      if (item.isNew) {
        const tempId = item.tempId;
        return !imageFiles[`before_${tempId}`] || !imageFiles[`after_${tempId}`];
      }
      return false;
    });
    
    return !hasInvalidNewItems;
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const invalidItems = editedItems.filter(item => {
        if (item.isNew) {
          const tempId = item.tempId;
          return !imageFiles[`before_${tempId}`] || !imageFiles[`after_${tempId}`];
        }
        return false;
      });
      
      if (invalidItems.length > 0) {
        throw new Error('يجب إضافة صور "قبل" و "بعد" لجميع العناصر الجديدة');
      }
      
      await saveBeforeAfterItems(editedItems);
      
      if (typeof fetchData === 'function') {
        await fetchData();
      }

      setIsEditing(false);
      setShowModal(false);
      setEditingItem(null);
      setImageFiles({});
      setEditedItems([]);
      setCurrentIndex(0);
      showNotification('  تم حفظ المعرض بنجاح!', 'success');
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
    setEditedItems([]);
    setImageFiles({});
    setError(null);
    setShowModal(false);
    setEditingItem(null);
  };

  const openAddModal = () => {
    const tempId = generateTempId();
    setEditingItem({
      title: '',
      description: '',
      before_image: null,
      after_image: null,
      before_preview: null,
      after_preview: null,
      isNew: true,
      tempId: tempId
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
      showNotification('❌ الرجاء إدخال عنوان للعنصر', 'error');
      return;
    }
    
    if (editingItem.isNew) {
      if (!editingItem.before_preview) {
        showNotification('❌ الرجاء إضافة صورة "قبل"', 'error');
        return;
      }
      if (!editingItem.after_preview) {
        showNotification('❌ الرجاء إضافة صورة "بعد"', 'error');
        return;
      }
    }
    
    const itemToSave = { ...editingItem };
    if (itemToSave.isNew && !itemToSave.tempId) {
      itemToSave.tempId = generateTempId();
    }
    
    if (editingIndex !== null) {
      setEditedItems(prev => prev.map((item, i) => 
        i === editingIndex ? itemToSave : item
      ));
      showNotification('  تم تحديث العنصر مؤقتاً، اضغط "حفظ الكل" لتأكيد التغييرات', 'success');
    } else {
      setEditedItems(prev => [...prev, itemToSave]);
      showNotification('  تم إضافة العنصر مؤقتاً، اضغط "حفظ الكل" لتأكيد الإضافة', 'success');
    }
    
    setShowModal(false);
    setEditingItem(null);
    setEditingIndex(null);
  };

  const handleDeleteItem = (index) => {
    const itemTitle = editedItems[index]?.title || 'العنصر';
    if (window.confirm(`هل أنت متأكد من حذف "${itemTitle}"؟`)) {
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
      const itemId = editingItem.id || editingItem.tempId;
      const imageKey = `${type}_${itemId}`;
      
      setImageFiles(prev => ({ ...prev, [imageKey]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem(prev => ({ ...prev, [`${type}_preview`]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextSlide = () => {
    const itemsLength = isEditing ? editedItems.length : (before_after?.length || 0);
    if (itemsLength === 0) return;
    setCurrentIndex((prev) => (prev + 1) % itemsLength);
    if (!isEditing) resetInterval();
  };

  const prevSlide = () => {
    const itemsLength = isEditing ? editedItems.length : (before_after?.length || 0);
    if (itemsLength === 0) return;
    setCurrentIndex((prev) => (prev - 1 + itemsLength) % itemsLength);
    if (!isEditing) resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      if (before_after && before_after.length > 1) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % before_after.length);
        }, 5000);
      }
    }
  };

  const displayItems = isEditing ? editedItems : (before_after || []);
  const currentItem = displayItems[currentIndex];
  const hasItems = displayItems && displayItems.length > 0;

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
                {!editingItem?.before_preview && editingItem?.isNew && (
                  <div className={styles.imagePlaceholder}>
                    <span>⚠️ مطلوب</span>
                  </div>
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
                {!editingItem?.after_preview && editingItem?.isNew && (
                  <div className={styles.imagePlaceholder}>
                    <span>⚠️ مطلوب</span>
                  </div>
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
        {/* زر التعديل - يظهر دائماً */}
        <div className={styles.editHeader}>
          {!isEditing ? (
            <button onClick={handleEditClick} className={styles.editButton}>
              <Edit2 size={18} />
              {hasItems ? 'إدارة المعرض' : 'إضافة صور المعرض'}
            </button>
          ) : (
            <div className={styles.editActions}>
              <button 
                onClick={handleSaveClick} 
                className={styles.saveButton} 
                disabled={isSaving || !canSave()}
                title={!canSave() && editedItems.some(i => i.isNew) ? 'يرجى إضافة صور قبل وبعد للعناصر الجديدة' : ''}
              >
                <Save size={18} />
                {isSaving ? 'جاري الحفظ...' : 'حفظ الكل'}
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
        
        {/* عرض حالة عدم وجود بيانات - مع زر إضافة واضح */}
        {!isEditing && !hasItems && (
          <div className={styles.emptyState}>
            <p>📭 لا توجد صور في المعرض</p>
            <button onClick={handleEditClick} className={styles.emptyStateButton}>
              <Plus size={18} />
              أضف صور المعرض
            </button>
          </div>
        )}
        
        {/* عرض معلومات الحالة */}
        {!isEditing && hasItems && (
          <div className={styles.statusInfo}>
            <span className={styles.statusBadge}>
                {displayItems.length} صورة قبل وبعد
            </span>
          </div>
        )}
        
        {hasItems && (
          <>
            <div className={styles.sliderContainer}>
              <button className={styles.sliderBtn} onClick={prevSlide} disabled={displayItems.length <= 1}>
                <ChevronRight size={32} />
              </button>
              
              <div className={styles.beforeAfterSlider}>
                <div className={styles.beforeAfterImages}>
                  <div className={styles.beforeImage}>
                    <img 
                      src={currentItem?.before_image || currentItem?.before_preview} 
                      alt="Before" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x400?text=صورة+قبل';
                      }}
                    />
                    <span className={styles.label}>قبل</span>
                  </div>
                  <div className={styles.afterImage}>
                    <img 
                      src={currentItem?.after_image || currentItem?.after_preview} 
                      alt="After" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x400?text=صورة+بعد';
                      }}
                    />
                    <span className={styles.label}>بعد</span>
                  </div>
                </div>
                <div className={styles.itemCaption}>
                  <h4>{currentItem?.title}</h4>
                  <p>{currentItem?.description}</p>
                </div>
              </div>
              
              <button className={styles.sliderBtn} onClick={nextSlide} disabled={displayItems.length <= 1}>
                <ChevronLeft size={32} />
              </button>
            </div>
            
            {displayItems.length > 1 && (
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
            )}

            {isEditing && (
              <div className={styles.managementButtons}>
                <button onClick={openAddModal} className={styles.addButton}>
                  <Plus size={18} />
                  إضافة صورة جديدة
                </button>
                
                <div className={styles.itemsList}>
                  {displayItems.map((item, idx) => (
                    <div key={item.id || item.tempId || idx} className={styles.listItem}>
                      <div className={styles.listItemInfo}>
                        <span>{item.title || 'بدون عنوان'}</span>
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
        )}
        
        {/* في وضع التعديل حتى لو مفيش صور، نعرض زر الإضافة */}
        {isEditing && !hasItems && (
          <div className={styles.emptyStateInEdit}>
            <p>📭 لا توجد صور في المعرض</p>
            <button onClick={openAddModal} className={styles.addButtonLarge}>
              <Plus size={24} />
              أضف أول صورة
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BeforeAfterSection;