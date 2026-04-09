import { ChevronLeft, ChevronRight, Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './TestimonialsSlider.module.css';

const TestimonialsSlider = ({ reviews = [], onReviewsUpdate, serviceId }) => {
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
  };

  // ✅ تحميل الصورة من الرابط وتحويلها إلى File
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

  // فنكشن تحديث البيانات عبر API
  const updateReviews = async (reviewsData) => {
    try {
      const promises = [];
      
      for (const review of reviewsData) {
        if (review.id) {
          // ✅ للتحديث: لازم نرسل الصورة (سواء قديمة أو جديدة)
          let formData = new FormData();
          formData.append('service', Number(serviceId));
          
          const hasNewImage = imageFiles[`image_${review.id}`];
          
          if (hasNewImage) {
            // إذا تم اختيار صورة جديدة
            formData.append('image', hasNewImage);
          } else if (review.image) {
            // إذا لم تتغير الصورة، نحمل الصورة القديمة ونرسلها
            const imageFile = await urlToFile(review.image, `review_${review.id}.jpg`);
            if (imageFile) {
              formData.append('image', imageFile);
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
      throw new Error(error.response?.data?.message || 'فشل في تحديث البيانات');
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
      const updatedReviews = await updateReviews(editedReviews);
      
      if (typeof onReviewsUpdate === 'function') {
        onReviewsUpdate(updatedReviews.filter(r => r !== undefined));
      }

      setIsEditing(false);
      setShowModal(false);
      setEditingReview(null);
      showNotification('✅ تم حفظ التقييمات بنجاح!', 'success');
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
  };

  // فتح نافذة إضافة تقييم جديد
  const openAddModal = () => {
    setEditingReview({
      id: null,
      image: null,
      image_preview: null,
      isNew: true,
      tempId: Date.now(),
      rating: 5
    });
    setEditingIndex(null);
    setShowModal(true);
  };

  // فتح نافذة تعديل تقييم
  const openEditModal = (index) => {
    const review = editedReviews[index];
    setEditingReview({
      ...review,
      image_preview: review.image
    });
    setEditingIndex(index);
    setShowModal(true);
  };

  // حفظ العنصر من المودال
  const handleSaveReview = () => {
    if (editingIndex !== null) {
      // تحديث عنصر موجود
      setEditedReviews(prev => prev.map((item, i) => 
        i === editingIndex ? { ...editingReview } : item
      ));
      showNotification('✅ تم تحديث التقييم مؤقتاً، اضغط "حفظ الكل" لتأكيد التغييرات', 'success');
    } else {
      // إضافة عنصر جديد
      if (!imageFiles[`image_${editingReview.tempId}`]) {
        showNotification('❌ الرجاء إضافة صورة للتقييم الجديد', 'error');
        return;
      }
      setEditedReviews(prev => [...prev, { ...editingReview }]);
      showNotification('✅ تم إضافة التقييم مؤقتاً، اضغط "حفظ الكل" لتأكيد الإضافة', 'success');
    }
    
    setShowModal(false);
    setEditingReview(null);
    setEditingIndex(null);
  };

  // حذف تقييم
  const handleDeleteReview = (index) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      setEditedReviews(prev => prev.filter((_, i) => i !== index));
      showNotification('✅ تم حذف التقييم مؤقتاً، اضغط "حفظ الكل" لتأكيد الحذف', 'success');
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

  const createInfiniteArray = (arr) => {
    if (!arr || arr.length === 0) return [];
    return [...arr, ...arr, ...arr];
  };
  
  const displayReviews = isEditing ? editedReviews : reviews;
  const infiniteReviews = createInfiniteArray(displayReviews);
  const originalLength = displayReviews.length;
  const startIndex = originalLength;
  
  const getVisibleReviews = () => {
    if (infiniteReviews.length === 0) return [];
    return infiniteReviews.slice(currentIndex, currentIndex + itemsPerPage);
  };
  
  const visibleReviews = getVisibleReviews();

  const nextSlide = useCallback(() => {
    if (isTransitioning || isEditing) return;
    setIsTransitioning(true);
    
    setCurrentIndex((prev) => prev + 1);
    
    setTimeout(() => {
      if (currentIndex + 1 >= infiniteReviews.length - itemsPerPage) {
        setIsTransitioning(false);
        setCurrentIndex(startIndex);
      } else {
        setIsTransitioning(false);
      }
    }, 500);
  }, [currentIndex, isTransitioning, infiniteReviews.length, itemsPerPage, startIndex, isEditing]);

  const prevSlide = useCallback(() => {
    if (isTransitioning || isEditing) return;
    setIsTransitioning(true);
    
    setCurrentIndex((prev) => prev - 1);
    
    setTimeout(() => {
      if (currentIndex - 1 < 0) {
        setIsTransitioning(false);
        setCurrentIndex(infiniteReviews.length - itemsPerPage - startIndex);
      } else {
        setIsTransitioning(false);
      }
    }, 500);
  }, [currentIndex, isTransitioning, infiniteReviews.length, itemsPerPage, startIndex, isEditing]);

  // Auto-play
  useEffect(() => {
    if (!reviews.length || isEditing) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [nextSlide, reviews.length, isEditing]);

  useEffect(() => {
    if (displayReviews.length > 0) {
      setCurrentIndex(startIndex);
    }
  }, [displayReviews.length, startIndex]);

  // if (!reviews || reviews.length === 0) {
  //   return null;
  // }

  const currentPage = ((currentIndex - startIndex) % originalLength + originalLength) % originalLength;
  const actualPageNumber = Math.floor(currentPage / itemsPerPage) + 1;

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
                {!editingReview?.image_preview && !editingReview?.isNew && (
                  <div className={styles.modalImagePlaceholder}>
                    <span>الصورة الحالية محفوظة</span>
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
            disabled={isTransitioning || isEditing || displayReviews.length === 0}
          >
            <ChevronRight size={24} />
          </button>
          
          <div className={styles.testimonialSlider}>
            <div 
              className={styles.testimonialsGrid}
              style={{
                transition: isTransitioning && !isEditing ? 'transform 0.5s ease-in-out' : 'none'
              }}
            >
              {visibleReviews.map((review, idx) => {
                const actualIndex = (currentIndex + idx) % originalLength;
                return (
                  <div key={review.id || review.tempId || idx} className={styles.testimonialCard}>
                    {isEditing ? (
                      <>
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
                          <p className={styles.reviewTitle}>تقييم #{actualIndex + 1}</p>
                        </div>
                        <div className={styles.editReviewActions}>
                          <button 
                            onClick={() => openEditModal(actualIndex)}
                            className={styles.editReviewBtn}
                          >
                            <Edit2 size={14} />
                            تعديل
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(actualIndex)}
                            className={styles.deleteReviewBtn}
                          >
                            <Trash2 size={14} />
                            حذف
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <button 
            className={styles.testimonialSliderBtn} 
            onClick={nextSlide}
            aria-label="التالي"
            disabled={isTransitioning || isEditing || displayReviews.length === 0}
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
        
        {!isEditing && (
          <>
            <div className={styles.sliderDots}>
              {Array.from({ length: Math.ceil(originalLength / itemsPerPage) }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  className={`${styles.dot} ${pageIndex + 1 === actualPageNumber ? styles.active : ''}`}
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
              صفحة {actualPageNumber} من {Math.ceil(originalLength / itemsPerPage)} | 
              إجمالي {originalLength} تقييم
            </div>
            
            <div className={styles.autoPlayIndicator}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
              </div>
              <span className={styles.autoPlayText}>تغيير تلقائي كل 3 ثواني</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSlider;