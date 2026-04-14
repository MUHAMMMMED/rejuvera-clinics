import { ChevronLeft, ChevronRight, Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './TestimonialsSlider.module.css';

const TestimonialsSlider = ({ reviews = [], fetchData, serviceId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReviews, setEditedReviews] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [imageFiles, setImageFiles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  
  const itemsPerPage = 3;

  // فنكشن عرض الإشعار
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // تهيئة بيانات التعديل
  const initializeEditData = () => {
    setEditedReviews(reviews.map(review => ({ ...review })));
    setImageFiles({});
    setCurrentIndex(0);
  };

 
  const urlToFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('Error converting URL to file:', error);
      return null;
    }
  };

  // فنكشن حفظ البيانات (CREATE or UPDATE)
  const saveReviews = async (reviewsData) => {
    try {
      const promises = [];
      
      for (const review of reviewsData) {
        if (review.id) {
          // تحديث عنصر موجود
          let formData = new FormData();
          formData.append('service', Number(serviceId));
          
          const hasNewImage = imageFiles[`image_${review.id}`];
          
          if (hasNewImage) {
            formData.append('image', hasNewImage);
          } else if (review.image && typeof review.image === 'string' && !review.image.startsWith('data:')) {
            // الاحتفاظ بالصورة القديمة
            try {
              const imageFile = await urlToFile(review.image, `review_${review.id}.jpg`);
              if (imageFile) {
                formData.append('image', imageFile);
              }
            } catch (err) {
              console.warn('Could not fetch existing image', err);
            }
          }
          
          promises.push(AxiosInstance.put(`/services/service-reviews/${review.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }));
        } else if (review.isNew) {
          // إضافة عنصر جديد
          const imageFile = imageFiles[`image_${review.tempId}`];
          if (!imageFile) {
            throw new Error('الرجاء إضافة صورة للتقييم الجديد');
          }
          
          let formData = new FormData();
          formData.append('service', Number(serviceId));
          formData.append('image', imageFile);
          promises.push(AxiosInstance.post('/services/service-reviews/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }));
        }
      }
      
      // حذف العناصر
      const deletedIds = reviews.filter(old => 
        !reviewsData.some(newReview => newReview.id === old.id)
      ).map(old => old.id);
      
      for (const id of deletedIds) {
        promises.push(AxiosInstance.delete(`/services/service-reviews/${id}/`));
      }
      
      const responses = await Promise.all(promises);
      return responses.filter(r => r && r.data).map(r => r.data);
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'فشل في حفظ البيانات');
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
      // حفظ البيانات عبر API
        await saveReviews(editedReviews);
      
 
      if (typeof fetchData === 'function') {
        await fetchData();
      }

      // إعادة تعيين الحالة
      setIsEditing(false);
      setShowModal(false);
      setEditingReview(null);
      setImageFiles({});
      setCurrentIndex(0);
      setEditedReviews([]);
      
      showNotification('  تم حفظ التقييمات بنجاح!', 'success');
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
    setEditedReviews([]);
    setImageFiles({});
    setError(null);
    setShowModal(false);
    setEditingReview(null);
    setCurrentIndex(0);
  };

  // فتح نافذة إضافة تقييم جديد
  const openAddModal = () => {
    const tempId = Date.now();
    setEditingReview({
      id: null,
      image: null,
      image_preview: null,
      isNew: true,
      tempId: tempId,
      rating: 5
    });
    setEditingIndex(null);
    setShowModal(true);
  };

  // فتح نافذة تعديل تقييم
  const openEditModal = (index) => {
    const actualReview = editedReviews[index];
    if (!actualReview) return;
    
    setEditingReview({
      ...actualReview,
      image_preview: actualReview.image
    });
    setEditingIndex(index);
    setShowModal(true);
  };

  // حفظ العنصر من المودال
  const handleSaveReview = () => {
    if (!editingReview.image_preview && !editingReview.image && editingReview.isNew) {
      showNotification('❌ الرجاء إضافة صورة للتقييم', 'error');
      return;
    }
    
    if (editingIndex !== null) {
      // تحديث عنصر موجود
      setEditedReviews(prev => prev.map((item, i) => 
        i === editingIndex ? { ...editingReview, isNew: false } : item
      ));
      showNotification('  تم تحديث التقييم مؤقتاً، اضغط "حفظ الكل" لتأكيد التغييرات', 'success');
    } else {
      // إضافة عنصر جديد
      const newReview = { 
        ...editingReview, 
        isNew: true,
        id: null
      };
      setEditedReviews(prev => [...prev, newReview]);
      showNotification('  تم إضافة التقييم مؤقتاً، اضغط "حفظ الكل" لتأكيد الإضافة', 'success');
    }
    
    setShowModal(false);
    setEditingReview(null);
    setEditingIndex(null);
  };

  // حذف تقييم
  const handleDeleteReview = (index) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      setEditedReviews(prev => prev.filter((_, i) => i !== index));
      if (currentIndex >= editedReviews.length - 1 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
      showNotification('  تم حذف التقييم مؤقتاً، اضغط "حفظ الكل" لتأكيد الحذف', 'success');
    }
  };

  // تحديث صورة التقييم في المودال
  const handleModalImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file instanceof File) {
      const imageKey = `image_${editingReview.id || editingReview.tempId}`;
      setImageFiles(prev => ({ ...prev, [imageKey]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingReview(prev => ({ ...prev, image_preview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // إنشاء مصفوفة لانهائية للعرض فقط (وليس للتعديل)
  const getDisplayReviews = () => {
    const displayData = isEditing ? editedReviews : reviews;
    if (!displayData || displayData.length === 0) return [];
    
    if (isEditing) {
      return displayData;
    }
    
    if (displayData.length <= itemsPerPage) {
      return [...displayData, ...displayData, ...displayData];
    }
    return [...displayData, ...displayData, ...displayData];
  };
  
  const displayReviews = getDisplayReviews();
  const originalLength = isEditing ? editedReviews.length : reviews.length;
  const startIndex = isEditing ? 0 : originalLength;
  
  const getCurrentIndex = () => {
    if (isEditing) {
      return currentIndex;
    }
    if (displayReviews.length === 0) return 0;
    let safeIndex = currentIndex;
    if (safeIndex >= displayReviews.length) {
      safeIndex = startIndex;
    }
    return safeIndex;
  };
  
  const getVisibleReviews = () => {
    const displayData = isEditing ? editedReviews : displayReviews;
    if (!displayData || displayData.length === 0) return [];
    
    if (isEditing) {
      return displayData;
    }
    
    const idx = getCurrentIndex();
    return displayReviews.slice(idx, idx + itemsPerPage);
  };
  
  const visibleReviews = getVisibleReviews();

  const nextSlide = useCallback(() => {
    if (isTransitioning || isEditing) return;
    if (displayReviews.length === 0) return;
    
    setIsTransitioning(true);
    
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    
    setTimeout(() => {
      if (nextIndex >= displayReviews.length - itemsPerPage) {
        setIsTransitioning(false);
        setCurrentIndex(startIndex);
      } else {
        setIsTransitioning(false);
      }
    }, 500);
  }, [currentIndex, isTransitioning, displayReviews.length, itemsPerPage, startIndex, isEditing]);

  const prevSlide = useCallback(() => {
    if (isTransitioning || isEditing) return;
    if (displayReviews.length === 0) return;
    
    setIsTransitioning(true);
    
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    
    setTimeout(() => {
      if (prevIndex < 0) {
        setIsTransitioning(false);
        setCurrentIndex(displayReviews.length - itemsPerPage - startIndex);
      } else {
        setIsTransitioning(false);
      }
    }, 500);
  }, [currentIndex, isTransitioning, displayReviews.length, itemsPerPage, startIndex, isEditing]);

  // Auto-play فقط في وضع العرض العادي
  useEffect(() => {
    if (!reviews.length || isEditing || isTransitioning) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [nextSlide, reviews.length, isEditing, isTransitioning]);

  // إعادة تعيين المؤشر عند تغيير البيانات
  useEffect(() => {
    if (!isEditing && reviews.length > 0) {
      setCurrentIndex(startIndex);
    }
  }, [reviews.length, isEditing, startIndex]);

  const getCurrentPageNumber = () => {
    if (isEditing) return 1;
    if (originalLength === 0) return 1;
    const currentPos = (currentIndex - startIndex + originalLength) % originalLength;
    return Math.floor(currentPos / itemsPerPage) + 1;
  };
  
  const totalPages = Math.ceil(originalLength / itemsPerPage);

  return (
    <section className={styles.testimonialsSection}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      {/* Modal للإضافة والتعديل */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingReview?.isNew ? '➕ إضافة تقييم جديد' : '✏️ تعديل التقييم'}</h3>
              <button onClick={() => setShowModal(false)} className={styles.closeModalBtn}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalImageSection}>
                <label className={styles.modalImageLabel}>
                  <span>📸 صورة التقييم</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleModalImageChange}
                  />
                </label>
                {editingReview?.image_preview && (
                  <img src={editingReview.image_preview} alt="Review preview" />
                )}
                {!editingReview?.image_preview && !editingReview?.isNew && editingReview?.image && (
                  <div className={styles.modalImagePlaceholder}>
                    <span>الصورة الحالية محفوظة</span>
                    <img src={editingReview.image} alt="Current" style={{ marginTop: '0.5rem', maxHeight: '150px' }} />
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button onClick={handleSaveReview} className={styles.modalSaveBtn}>
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
        {/* زر التعديل */}
        <div className={styles.editHeader}>
          {!isEditing ? (
            <button onClick={handleEditClick} className={styles.editButton}>
              <Edit2 size={18} />
              إدارة التقييمات
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
        
        <SectionHeader 
          badge="آراء عملائنا"
          title="قصص نجاح"
          highlightText="حقيقية"
          description="ما قاله عملاؤنا عن تجربتهم معنا"
        />
        
        <div className={styles.testimonialSliderContainer}>
          <button 
            className={styles.testimonialSliderBtn} 
            onClick={prevSlide}
            aria-label="السابق"
            disabled={isTransitioning || isEditing || displayReviews.length === 0 || originalLength === 0}
          >
            <ChevronRight size={24} />
          </button>
          
          <div className={styles.testimonialSlider}>
            <div 
              className={`${styles.testimonialsGrid} ${isEditing ? styles.editMode : ''}`}
              style={{
                transition: isTransitioning && !isEditing ? 'transform 0.5s ease-in-out' : 'none'
              }}
            >
              {isEditing ? (
                visibleReviews.map((review, idx) => (
                  <div key={review.id || review.tempId || idx} className={styles.testimonialCard}>
                    <div className={styles.screenshotImage}>
                      <img 
                        src={review.image_preview || review.image} 
                        alt={`تقييم العميل`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x800?text=صورة+التقييم';
                        }}
                      />
                    </div>
                    <div className={styles.reviewInfo}>
                      <p className={styles.reviewTitle}>تقييم #{idx + 1}</p>
                    </div>
                    <div className={styles.editReviewActions}>
                      <button 
                        onClick={() => openEditModal(idx)}
                        className={styles.editReviewBtn}
                      >
                        <Edit2 size={14} />
                        تعديل
                      </button>
                      <button 
                        onClick={() => handleDeleteReview(idx)}
                        className={styles.deleteReviewBtn}
                      >
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                visibleReviews.map((review, idx) => {
                  const actualIndex = ((currentIndex - startIndex + originalLength) % originalLength) + idx;
                  return (
                    <div key={review.id || actualIndex} className={styles.testimonialCard}>
                      <div className={styles.ratingBadge}>
                        <div className={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < (review.rating || 5) ? styles.starFilled : styles.starEmpty}>★</span>
                          ))}
                        </div>
                        <span className={styles.ratingValue}>{review.rating || 5}.0</span>
                      </div>
                      
                      <div className={styles.screenshotImage}>
                        <img 
                          src={review.image} 
                          alt={`تقييم العميل`}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x800?text=صورة+التقييم';
                          }}
                        />
                      </div>
                      
                      <div className={styles.reviewNumber}>
                        تقييم {actualIndex + 1} من {originalLength}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          <button 
            className={styles.testimonialSliderBtn} 
            onClick={nextSlide}
            aria-label="التالي"
            disabled={isTransitioning || isEditing || displayReviews.length === 0 || originalLength === 0}
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        
        {/* زر إضافة جديد في وضع التعديل */}
        {isEditing && (
          <div className={styles.addButtonWrapper}>
            <button onClick={openAddModal} className={styles.addButton}>
              <Plus size={18} />
              إضافة تقييم جديد
            </button>
          </div>
        )}
        
        {!isEditing && originalLength > 0 && (
          <>
            <div className={styles.sliderDots}>
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  className={`${styles.dot} ${pageIndex + 1 === getCurrentPageNumber() ? styles.active : ''}`}
                  onClick={() => {
                    if (isTransitioning) return;
                    const targetIndex = startIndex + (pageIndex * itemsPerPage);
                    setCurrentIndex(targetIndex);
                  }}
                  aria-label={`Go to page ${pageIndex + 1}`}
                />
              ))}
            </div>
            
            <div className={styles.counter}>
              صفحة {getCurrentPageNumber()} من {totalPages} | 
              إجمالي {originalLength} تقييم
            </div>
            
            <div className={styles.autoPlayIndicator}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
              </div>
              <span className={styles.autoPlayText}>تغيير تلقائي كل 5 ثواني</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSlider;