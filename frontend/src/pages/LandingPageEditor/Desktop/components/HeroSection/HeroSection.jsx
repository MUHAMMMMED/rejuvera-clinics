import { Edit2, Lightbulb, Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import styles from './HeroSection.module.css';

const HeroSection = ({ heroData, serviceName, scrollToBooking, fetchData }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...heroData });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(heroData?.image || null);
  const [notification, setNotification] = useState(null);
  
  // حالة جديدة لحفظ الأمثلة من قاعدة البيانات
  const [fieldExamples, setFieldExamples] = useState({
    badge: [],
    title: [],
    subtitle: [],
    cta_text: []
  });
  const [showHint, setShowHint] = useState({});

  // جلب الأمثلة من قاعدة البيانات عند تحميل المكون
  useEffect(() => {
    fetchFieldExamples();
  }, []);

  // فنكشن لجلب الأمثلة من الخدمات الأخرى
  const fetchFieldExamples = async () => {
    try {
      const response = await AxiosInstance.get('/services/service-hero/examples/');
      if (response.data) {
        setFieldExamples(response.data);
      }
    } catch (error) {
      console.error('Error fetching field examples:', error);
      // أمثلة افتراضية لو فشل الجلب
      setFieldExamples({
        badge: ['أحدث التقنيات', 'نتائج مضمونة', 'آمن ومعتمد', 'حصري'],
        title: ['نحت الجسم 360', 'شد البطن', 'شفط الدهون بالفيزر'],
        subtitle: ['جسم مثالي من كل الزوايا', 'استعيدي ثقتك بنفسك', 'نتائج طبيعية'],
        cta_text: ['احجزي استشارتك المجانية', 'استشيري الطبيب الآن', 'تعرفي على المزيد']
      });
    }
  };

  // فنكشن عرض الإشعار
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // تبديل عرض الـ hint لحقل معين
  const toggleHint = (fieldName) => {
    setShowHint(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  // فنكشن حفظ البيانات (CREATE or UPDATE)
  const saveServiceHero = async (data, image) => {
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined && key !== 'image') {
          formData.append(key, data[key]);
        }
      });
      
      if (image) {
        formData.append('image', image);
      }
      
      let response;
      
      // إذا كان يوجد id، نقوم بالتحديث (UPDATE)
      if (heroData.id) {
        response = await AxiosInstance.put(`/services/service-hero/${heroData.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // إذا لم يوجد id، نقوم بالإضافة (CREATE)
        response = await AxiosInstance.post('/services/service-hero/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'فشل في حفظ البيانات');
    }
  };

  const handleEditClick = () => {
    setEditedData({ ...heroData });
    setImagePreview(heroData?.image || null);
    setImageFile(null);
    setIsEditing(true);
    setError(null);
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const textData = {
        title: editedData.title,
        subtitle: editedData.subtitle,
        description: editedData.description,
        alt_text: editedData.alt_text,
        video_url: editedData.video_url,
        badge: editedData.badge,
        cta_text: editedData.cta_text,
        service: editedData.service
      };
      
      // حفظ البيانات عبر API (سواء create أو update)
       await saveServiceHero(textData, imageFile);
      
    
      if (typeof fetchData === 'function') {
        await fetchData();
      }
      
      setIsEditing(false);
      setImageFile(null);
      showNotification(' تم حفظ التغييرات بنجاح!', 'success');
      
      // إعادة جلب الأمثلة بعد الحفظ
      fetchFieldExamples();
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
    setEditedData({ ...heroData });
    setImageFile(null);
    setImagePreview(heroData?.image || null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
    
    // إخفاء ال hint تلقائياً عند البدء بالكتابة
    if (showHint[name]) {
      setShowHint(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // عرض حقل الإدخال مع Hint
  const renderFieldWithHint = (fieldName, placeholder, type = 'text', rows = null) => {
    const examples = fieldExamples[fieldName] || [];
    const isHintVisible = showHint[fieldName];
    
    return (
      <div className={styles.fieldWrapper}>
        <div className={styles.fieldHeader}>
          <label className={styles.fieldLabel}>{placeholder}</label>
          {examples.length > 0 && (
            <button
              type="button"
              onClick={() => toggleHint(fieldName)}
              className={styles.hintButton}
              title="عرض أمثلة من خدمات أخرى"
            >
              <Lightbulb size={14} />
              <span>أمثلة</span>
            </button>
          )}
        </div>
        
        {type === 'textarea' ? (
          <textarea
            name={fieldName}
            value={editedData[fieldName] || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className={styles.editTextarea}
            rows={rows || 4}
          />
        ) : (
          <input
            type={type}
            name={fieldName}
            value={editedData[fieldName] || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className={fieldName === 'title' ? styles.editInputTitle : styles.editInput}
          />
        )}
        
        {isHintVisible && examples.length > 0 && (
          <div className={styles.hintPanel}>
            <div className={styles.hintTitle}>📋 أمثلة من خدمات أخرى:</div>
            <div className={styles.hintExamples}>
              {examples.slice(0, 5).map((example, index) => (
                <button
                  key={index}
                  type="button"
                  className={styles.exampleButton}
                  onClick={() => {
                    setEditedData(prev => ({ ...prev, [fieldName]: example }));
                    setShowHint(prev => ({ ...prev, [fieldName]: false }));
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
            <div className={styles.hintNote}>
              💡 انقر على أي مثال لاستخدامه مباشرة
            </div>
          </div>
        )}
      </div>
    );
  };

  // فنكشن مساعدة لتحويل رابط يوتيوب
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  const displayData = isEditing ? editedData : heroData;

  return (
    <section className={styles.hero}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.heroBackground}>
        {!isEditing && displayData.image && (
          <img src={displayData.image} alt={displayData.alt_text || serviceName} className={styles.heroBgImage} />
        )}
        <div className={styles.heroOverlay} />
      </div>
      
      <div className={styles.heroContent}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {!isEditing ? (
          <button onClick={handleEditClick} className={styles.editButton}>
            <Edit2 size={18} />
            تعديل
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

        {isEditing ? (
          <div className={styles.editForm}>
            {/* رفع الصورة */}
            <div className={styles.imageUploadWrapper}>
              <label className={styles.imageUploadLabel}>
                <span>📸 تغيير الصورة الخلفية</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.imageInput}
                />
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
              )}
              <div className={styles.fieldNote}>
                💡 يفضل استخدام صورة عالية الجودة بحجم 1920x1080 بكسل
              </div>
            </div>

            {/* الشارة (Badge) */}
            {renderFieldWithHint('badge', 'الشارة (مثال: أحدث التقنيات)', 'text')}
            
            {/* العنوان الرئيسي */}
            {renderFieldWithHint('title', 'العنوان الرئيسي', 'text')}
            
            {/* العنوان الفرعي */}
            {renderFieldWithHint('subtitle', 'العنوان الفرعي', 'text')}
            
            {/* الوصف */}
            {renderFieldWithHint('description', 'الوصف', 'textarea', 4)}
            
            {/* النص البديل للصورة */}
            <div className={styles.fieldWrapper}>
              <div className={styles.fieldHeader}>
                <label className={styles.fieldLabel}>النص البديل للصورة (SEO)</label>
              </div>
              <input
                type="text"
                name="alt_text"
                value={editedData.alt_text || ''}
                onChange={handleChange}
                placeholder="مثال: نحت الجسم قبل وبعد - مركز ريجوفيرا"
                className={styles.editInput}
              />
              <div className={styles.fieldNote}>
                ⚡ مهم لمحركات البحث - صف ما في الصورة بدقة
              </div>
            </div>
            
            {/* رابط الفيديو */}
            <div className={styles.fieldWrapper}>
              <div className={styles.fieldHeader}>
                <label className={styles.fieldLabel}>🎥 رابط الفيديو (YouTube)</label>
              </div>
              <input
                type="url"
                name="video_url"
                value={editedData.video_url || ''}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className={styles.editInput}
              />
              <div className={styles.fieldNote}>
                💡 الصق رابط YouTube فقط - سيتم تضمينه تلقائياً
              </div>
            </div>
            
            {/* زر الحث على الإجراء */}
            {renderFieldWithHint('cta_text', 'زر الحث على الإجراء (CTA)', 'text')}
          </div>
        ) : (
          <>
            {displayData.badge && <span className={styles.heroBadge}>{displayData.badge}</span>}
            <h1 className={styles.heroTitle}>{displayData.title || serviceName}</h1>
            <p className={styles.heroSubtitle}>{displayData.subtitle}</p>
            <p className={styles.heroDescription}>{displayData.description}</p>
            
            <div className={styles.heroButtons}>
              <button onClick={scrollToBooking} className={styles.heroCta}>
                {displayData.cta_text || 'احجزي استشارتك المجانية'}
              </button>
              {displayData.video_url && (
                <button onClick={() => setShowVideo(true)} className={styles.heroSecondary}>
                  ▶️ شاهد الفيديو
                </button>
              )}
            </div>
          </>
        )}

        {/* عرض معلومات الحالة */}
        {!isEditing && heroData.id && (
          <div className={styles.statusInfo}>
            <span className={styles.statusBadge}>
                تم تحديث آخر مرة
            </span>
          </div>
        )}
        
        {!isEditing && !heroData.id && (
          <div className={styles.statusInfo}>
            <span className={styles.statusBadgeWarning}>
              ⚠️ لم تتم إضافة محتوى الهيرو بعد، اضغط تعديل للإضافة
            </span>
          </div>
        )}
      </div>

      {/* Modal للفيديو */}
      {showVideo && displayData.video_url && (
        <div className={styles.videoModal} onClick={() => setShowVideo(false)}>
          <div className={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowVideo(false)}>✕</button>
            <iframe
              width="100%"
              height="400"
              src={getYouTubeEmbedUrl(displayData.video_url)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;