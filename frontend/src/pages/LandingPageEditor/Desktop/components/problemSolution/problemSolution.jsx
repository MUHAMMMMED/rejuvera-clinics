import { Edit2, Image as ImageIcon, Lightbulb, Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import styles from './ProblemSolution.module.css';

const ProblemSolution = ({ problem_solution, onProblemSolutionUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...problem_solution });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [imageFiles, setImageFiles] = useState({
    problem_image: null,
    solution_image: null
  });
  const [imagePreviews, setImagePreviews] = useState({
    problem_image: problem_solution?.problem_image || null,
    solution_image: problem_solution?.solution_image || null
  });
  
  // حالة جديدة لحفظ الأمثلة من قاعدة البيانات
  const [fieldExamples, setFieldExamples] = useState({
    problem_title: [],
    problem_description: [],
    solution_title: [],
    solution_description: []
  });
  const [showHint, setShowHint] = useState({});

  if (!problem_solution) return null;

  // جلب الأمثلة من قاعدة البيانات عند تحميل المكون
  useEffect(() => {
    fetchFieldExamples();
  }, []);

  // فنكشن لجلب الأمثلة من الخدمات الأخرى
  const fetchFieldExamples = async () => {
    try {
      const response = await AxiosInstance.get('/services/service-problem-solution/examples/');
      if (response.data) {
        setFieldExamples(response.data);
      }
    } catch (error) {
      console.error('Error fetching field examples:', error);
      // أمثلة افتراضية لو فشل الجلب
      setFieldExamples({
        problem_title: [
          'تراكم الدهون العنيد؟',
          'ترهلات البطن بعد الحمل؟',
          'فقدان مرونة الجلد؟',
          'علامات التمدد المزعجة؟'
        ],
        problem_description: [
          'تعانين من دهون موضعية لا تستجيب للرياضة والرجيم؟',
          'بشرة مترهلة وعضلات منفصلة تسبب مظهراً غير متناسق',
          'الجلد فقد مرونته الطبيعية بسبب التقدم في العمر أو الحمل'
        ],
        solution_title: [
          'الحل: نحت الجسم بالفيزر',
          'الحل: عملية شد البطن المتكاملة',
          'الحل: تقنية الليزر المتطورة'
        ],
        solution_description: [
          'تقنية متطورة تزيل الدهون وتشد الجلد في نفس الوقت',
          'إزالة الجلد الزائد وشد العضلات للحصول على بطن مشدود',
          'تقنية آمنة وفعالة تعيد للبشرة حيويتها ونضارتها'
        ]
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

  // فنكشن تحديث البيانات عبر API مع دعم الصور
  const updateServiceProblemSolution = async (id, textData, images) => {
    try {
      let formData = new FormData();
      
      // إضافة النصوص فقط
      const allowedFields = ['problem_title', 'problem_description', 'solution_title', 'solution_description', 'service'];
      allowedFields.forEach(key => {
        if (textData[key] !== null && textData[key] !== undefined) {
          formData.append(key, textData[key]);
        }
      });
      
      // إضافة الصور الجديدة فقط إذا تم اختيار ملف جديد
      if (images.problem_image && images.problem_image instanceof File) {
        formData.append('problem_image', images.problem_image);
      }
      if (images.solution_image && images.solution_image instanceof File) {
        formData.append('solution_image', images.solution_image);
      }
      
      const response = await AxiosInstance.put(`/services/service-problem-solutions/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'فشل في تحديث البيانات');
    }
  };

  // لما نضغط تعديل
  const handleEditClick = () => {
    setEditedData({ ...problem_solution });
    setImagePreviews({
      problem_image: problem_solution.problem_image,
      solution_image: problem_solution.solution_image
    });
    setImageFiles({ problem_image: null, solution_image: null });
    setIsEditing(true);
    setError(null);
  };

  // لما نضغط حفظ
  const handleSaveClick = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const textData = {
        problem_title: editedData.problem_title,
        problem_description: editedData.problem_description,
        solution_title: editedData.solution_title,
        solution_description: editedData.solution_description,
        service: editedData.service
      };
      
      const updatedData = await updateServiceProblemSolution(
        problem_solution.id, 
        textData, 
        imageFiles
      );

      if (typeof onProblemSolutionUpdate === 'function') {
        onProblemSolutionUpdate(updatedData);
      }

      setImagePreviews({
        problem_image: updatedData.problem_image,
        solution_image: updatedData.solution_image
      });

      setIsEditing(false);
      setImageFiles({ problem_image: null, solution_image: null });
      showNotification('✓ تم حفظ المشكلة والحل بنجاح!', 'success');
      
      // إعادة جلب الأمثلة بعد الحفظ
      fetchFieldExamples();
    } catch (err) {
      setError(err.message);
      showNotification(`✗ ${err.message}`, 'error');
      console.error('Error saving data:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // إلغاء التعديل
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData({ ...problem_solution });
    setImageFiles({ problem_image: null, solution_image: null });
    setImagePreviews({
      problem_image: problem_solution.problem_image,
      solution_image: problem_solution.solution_image
    });
    setError(null);
  };

  // التعامل مع تغيير النصوص
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
    
    // إخفاء ال hint تلقائياً عند البدء بالكتابة
    if (showHint[name]) {
      setShowHint(prev => ({ ...prev, [name]: false }));
    }
  };

  // التعامل مع تغيير الصور
  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file && file instanceof File) {
      setImageFiles(prev => ({ ...prev, [fieldName]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // عرض حقل الإدخال مع Hint
  const renderFieldWithHint = (fieldName, placeholder, type = 'text', rows = null) => {
    const examples = fieldExamples[fieldName] || [];
    const isHintVisible = showHint[fieldName];
    const isTitle = fieldName.includes('title');
    
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
            type="text"
            name={fieldName}
            value={editedData[fieldName] || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className={isTitle ? styles.editInputTitle : styles.editInput}
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
                  {example.length > 60 ? example.substring(0, 60) + '...' : example}
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

  const displayData = isEditing ? editedData : problem_solution;
  const displayImages = isEditing ? imagePreviews : {
    problem_image: problem_solution.problem_image,
    solution_image: problem_solution.solution_image
  };

  return (
    <section className={styles.problemSolution}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.problemSolutionWrapper}>
        {/* زر التعديل */}
        <div className={styles.editHeader}>
          {!isEditing ? (
            <button onClick={handleEditClick} className={styles.editButton}>
              <Edit2 size={18} />
              تعديل المحتوى
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

        {/* Problem Card */}
        <div className={styles.problemCard}>
          <div className={styles.cardContent}>
            <div className={styles.cardText}>
              <span className={styles.sectionBadge}>⚠️ المشكلة</span>
              {isEditing ? (
                <>
                  {renderFieldWithHint('problem_title', 'عنوان المشكلة', 'text')}
                  {renderFieldWithHint('problem_description', 'وصف المشكلة', 'textarea', 4)}
                </>
              ) : (
                <>
                  <h2>{displayData.problem_title}</h2>
                  <p>{displayData.problem_description}</p>
                </>
              )}
            </div>
            <div className={styles.cardImage}>
              {isEditing ? (
                <div className={styles.imageUploadWrapper}>
                  <label className={styles.imageUploadLabel}>
                    <ImageIcon size={24} />
                    <span>
                      {displayImages.problem_image ? 'تغيير صورة المشكلة' : 'إضافة صورة المشكلة'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'problem_image')}
                      className={styles.imageInput}
                    />
                  </label>
                  {displayImages.problem_image ? (
                    <img 
                      src={displayImages.problem_image} 
                      alt="Problem preview" 
                      className={styles.previewImage}
                    />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <ImageIcon size={48} />
                      <span>لا توجد صورة</span>
                      <small>يفضل إضافة صورة توضح المشكلة</small>
                    </div>
                  )}
                </div>
              ) : (
                displayImages.problem_image ? (
                  <>
                    <img src={displayImages.problem_image} alt="Problem" />
                    <div className={styles.imageGlow} />
                  </>
                ) : (
                  <div className={styles.placeholderImage}>
                    <ImageIcon size={48} />
                    <span>لا توجد صورة</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        
        {/* Solution Card */}
        <div className={styles.solutionCard}>
          <div className={styles.cardContent}>
            <div className={styles.cardImage}>
              {isEditing ? (
                <div className={styles.imageUploadWrapper}>
                  <label className={styles.imageUploadLabel}>
                    <ImageIcon size={24} />
                    <span>
                      {displayImages.solution_image ? 'تغيير صورة الحل' : 'إضافة صورة الحل'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'solution_image')}
                      className={styles.imageInput}
                    />
                  </label>
                  {displayImages.solution_image ? (
                    <img 
                      src={displayImages.solution_image} 
                      alt="Solution preview" 
                      className={styles.previewImage}
                    />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <ImageIcon size={48} />
                      <span>لا توجد صورة</span>
                      <small>أضف صورة توضح النتيجة أو الحل</small>
                    </div>
                  )}
                </div>
              ) : (
                displayImages.solution_image ? (
                  <>
                    <img src={displayImages.solution_image} alt="Solution" />
                    <div className={styles.imageGlow} />
                  </>
                ) : (
                  <div className={styles.placeholderImage}>
                    <ImageIcon size={48} />
                    <span>لا توجد صورة</span>
                  </div>
                )
              )}
            </div>
            <div className={styles.cardText}>
              <span className={styles.sectionBadge}>✨ الحل</span>
              {isEditing ? (
                <>
                  {renderFieldWithHint('solution_title', 'عنوان الحل', 'text')}
                  {renderFieldWithHint('solution_description', 'وصف الحل', 'textarea', 4)}
                </>
              ) : (
                <>
                  <h2>{displayData.solution_title}</h2>
                  <p>{displayData.solution_description}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* نصائح إضافية في وضع التعديل */}
        {isEditing && (
          <div className={styles.tipsCard}>
            <div className={styles.tipsHeader}>
              <Lightbulb size={18} />
              <span>نصائح لكتابة مشكلة وحل مؤثرين</span>
            </div>
            <div className={styles.tipsContent}>
              <ul>
                <li>🎯 <strong>اجعل عنوان المشكلة سؤالاً</strong> - مثل "تعانين من دهون البطن العنيدة؟"</li>
                <li>💬 <strong>استخدم لغة تعاطفية</strong> - تحدث عن معاناة العميل الحقيقية</li>
                <li>🔬 <strong>اذكر تفاصيل تقنية</strong> - مثل التقنيات المستخدمة والأجهزة المعتمدة</li>
                <li>✨ <strong>أبرز النتائج</strong> - اذكر الفوائد والنتائج المتوقعة بوضوح</li>
                <li>📸 <strong>الصور مهمة جداً</strong> - استخدم صوراً توضح المشكلة قبل وبعد الحل</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProblemSolution;