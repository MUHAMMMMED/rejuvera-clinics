import { Edit2, Lightbulb, MessageCircle, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../../../components/Authentication/AxiosInstance';
import styles from './FaqSection.module.css';

const FaqSection = ({ faqsData, serviceName, serviceId, fetchData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFaqs, setEditedFaqs] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // حالة جديدة لحفظ الأمثلة من قاعدة البيانات
  const [suggestions, setSuggestions] = useState({
    questions: [],
    answers: []
  });
  const [showSuggestions, setShowSuggestions] = useState({});

  // جلب الأمثلة من قاعدة البيانات عند تحميل المكون
  useEffect(() => {
    fetchFaqSuggestions();
  }, [serviceId]);

  // فنكشن لجلب الأمثلة من الخدمات الأخرى
  const fetchFaqSuggestions = async () => {
    try {
      const response = await AxiosInstance.get('/services/service-faqs/suggestions/', {
        params: { current_service_id: serviceId }
      });
      if (response.data) {
        setSuggestions(response.data);
      }
    } catch (error) {
      console.error('Error fetching FAQ suggestions:', error);
      // أمثلة افتراضية لو فشل الجلب
      setSuggestions({
        questions: [
          'هل العملية مؤلمة؟',
          'كم تستغرق فترة التعافي؟',
          'هل النتائج دائمة؟',
          'متى أستطيع العودة للعمل؟',
          'هل هناك آثار جانبية؟',
          'هل تناسبني هذه العملية؟',
          'كم تكلفة العملية؟'
        ],
        answers: [
          'يتم الإجراء تحت التخدير، ولا يشعر المريض بأي ألم أثناء العملية.',
          'يمكن العودة للحياة الطبيعية خلال 3-7 أيام حسب نوع الإجراء.',
          'نعم، النتائج دائمة مع الحفاظ على الوزن المثالي ونمط الحياة الصحي.',
          'يمكن العودة للعمل بعد 3-7 أيام حسب طبيعة العمل.',
          'قد يحدث تورم وكدمات بسيطة وتختفي خلال أسبوع.'
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

  // تهيئة بيانات التعديل - حتى لو faqsData فاضي
  const initializeEditData = () => {
    if (faqsData && faqsData.length > 0) {
      setEditedFaqs(faqsData.map(faq => ({ ...faq })));
    } else {
      // لو مفيش أسئلة، نبدأ بقائمة فاضية
      setEditedFaqs([]);
    }
    setShowSuggestions({});
  };

  // فنكشن حفظ البيانات (CREATE or UPDATE)
  const saveFaqs = async (faqsDataToUpdate) => {
    try {
      const promises = [];
      
      for (const faq of faqsDataToUpdate) {
        if (faq.id) {
          // تحديث عنصر موجود
          promises.push(AxiosInstance.put(`/services/service-faqs/${faq.id}/`, {
            service: Number(serviceId),
            question: faq.question,
            answer: faq.answer
          }));
        } else if (faq.isNew) {
          // إضافة عنصر جديد
          promises.push(AxiosInstance.post('/services/service-faqs/', {
            service: Number(serviceId),
            question: faq.question,
            answer: faq.answer
          }));
        }
      }
      
      // حذف العناصر التي تم حذفها (فقط لو في عناصر أصلية)
      if (faqsData && faqsData.length > 0) {
        const deletedIds = faqsData.filter(old => 
          !faqsDataToUpdate.some(newFaq => newFaq.id === old.id)
        ).map(old => old.id);
        
        for (const id of deletedIds) {
          promises.push(AxiosInstance.delete(`/services/service-faqs/${id}/`));
        }
      }
      
      const responses = await Promise.all(promises);
      return responses.filter(r => r && r.data).map(r => r.data);
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'فشل في حفظ الأسئلة');
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
      const savedFaqs = await saveFaqs(editedFaqs);
      
 
      if (typeof fetchData === 'function') {
        await fetchData();
      }

      setIsEditing(false);
      showNotification('  تم حفظ الأسئلة الشائعة بنجاح!', 'success');
      
      // إعادة جلب الاقتراحات بعد الحفظ
      fetchFaqSuggestions();
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
    setEditedFaqs([]);
    setError(null);
    setShowSuggestions({});
  };

  // إضافة سؤال جديد
  const handleAddNew = () => {
    const newFaq = {
      id: null,
      question: '',
      answer: '',
      isNew: true,
      tempId: Date.now()
    };
    setEditedFaqs(prev => [...prev, newFaq]);
    // فتح الاقتراحات تلقائياً للسؤال الجديد
    setTimeout(() => {
      const newIndex = editedFaqs.length;
      setShowSuggestions(prev => ({ ...prev, [newIndex]: true }));
    }, 100);
    showNotification('  تم إضافة سؤال جديد، يمكنك اختيار سؤال من الاقتراحات', 'success');
  };

  // حذف سؤال
  const handleDeleteFaq = (index) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      setEditedFaqs(prev => prev.filter((_, i) => i !== index));
      showNotification('  تم حذف السؤال مؤقتاً، اضغط "حفظ الكل" لتأكيد الحذف', 'success');
    }
  };

  // تحديث سؤال
  const handleFaqChange = (index, field, value) => {
    setEditedFaqs(prev => prev.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    ));
    
    // إخفاء الاقتراحات عند البدء بالكتابة
    if (showSuggestions[index]) {
      setShowSuggestions(prev => ({ ...prev, [index]: false }));
    }
  };

  // اختيار سؤال مقترح
  const handleSelectSuggestion = (index, type, value) => {
    if (type === 'question') {
      setEditedFaqs(prev => prev.map((faq, i) => 
        i === index ? { ...faq, question: value } : faq
      ));
    } else {
      setEditedFaqs(prev => prev.map((faq, i) => 
        i === index ? { ...faq, answer: value } : faq
      ));
    }
    setShowSuggestions(prev => ({ ...prev, [index]: false }));
  };

  // تبديل عرض الاقتراحات
  const toggleSuggestions = (index) => {
    setShowSuggestions(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const displayFaqs = isEditing ? editedFaqs : (faqsData || []);
  const hasFaqs = displayFaqs.length > 0;

  return (
    <section className={styles.faqSection}>
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
              {hasFaqs ? 'إدارة الأسئلة' : 'إضافة أسئلة'}
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

        {/* Header ثابت */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>أسئلة شائعة</span>
          <h2>كل ما تريدين <span className={styles.gold}>معرفته</span></h2>
          <p>أجوبة على الأسئلة الأكثر شيوعاً حول {serviceName}</p>
        </div>
        
        {/* عرض حالة عدم وجود أسئلة (في وضع العرض فقط) */}
        {!isEditing && !hasFaqs && (
          <div className={styles.emptyState}>
            <MessageCircle size={48} />
            <h3>لا توجد أسئلة شائعة بعد</h3>
            <p>أضف أسئلة وأجوبة لمساعدة العملاء على فهم الخدمة بشكل أفضل</p>
            <button onClick={handleEditClick} className={styles.emptyStateButton}>
              <Plus size={18} />
              أضف أول سؤال
            </button>
          </div>
        )}

        {/* عرض معلومات الحالة */}
        {!isEditing && hasFaqs && (
          <div className={styles.statusInfo}>
            <span className={styles.statusBadge}>
             {displayFaqs.length} سؤال شائع
            </span>
          </div>
        )}

        {/* عرض الأسئلة */}
        {hasFaqs && (
          <div className={styles.faqGrid}>
            {displayFaqs.map((item, i) => (
              <div key={item.id || item.tempId || i} className={styles.faqCard}>
                <div className={styles.faqQuestion}>
                  <MessageCircle size={20} />
                  {isEditing ? (
                    <div className={styles.questionWrapper}>
                      <div className={styles.questionInputWrapper}>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => handleFaqChange(i, 'question', e.target.value)}
                          className={styles.editQuestion}
                          placeholder="اكتب السؤال هنا..."
                        />
                        <button
                          type="button"
                          onClick={() => toggleSuggestions(i)}
                          className={styles.suggestionButton}
                          title="اقتراحات أسئلة"
                        >
                          <Lightbulb size={14} />
                        </button>
                      </div>
                      
                      {/* لوحة اقتراحات الأسئلة */}
                      {showSuggestions[i] && suggestions.questions.length > 0 && (
                        <div className={styles.suggestionPanel}>
                          <div className={styles.suggestionTitle}>
                            <Lightbulb size={12} />
                            <span>أسئلة مقترحة من خدمات أخرى:</span>
                          </div>
                          <div className={styles.suggestionList}>
                            {suggestions.questions.slice(0, 6).map((question, qIdx) => (
                              <button
                                key={qIdx}
                                type="button"
                                className={styles.suggestionItem}
                                onClick={() => handleSelectSuggestion(i, 'question', question)}
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <h3>{item.question}</h3>
                  )}
                  {isEditing && (
                    <button 
                      onClick={() => handleDeleteFaq(i)}
                      className={styles.deleteButton}
                      title="حذف السؤال"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className={styles.answerWrapper}>
                    <textarea
                      value={item.answer}
                      onChange={(e) => handleFaqChange(i, 'answer', e.target.value)}
                      className={styles.editAnswer}
                      rows="3"
                      placeholder="اكتب الإجابة هنا..."
                    />
                    
                    {/* اقتراحات الإجابات */}
                    {suggestions.answers.length > 0 && (
                      <div className={styles.answerHints}>
                        <button
                          type="button"
                          className={styles.showAnswerHints}
                          onClick={() => {
                            const newState = !showSuggestions[`answer_${i}`];
                            setShowSuggestions(prev => ({ ...prev, [`answer_${i}`]: newState }));
                          }}
                        >
                          <Lightbulb size={12} />
                          <span>اقتراحات إجابات</span>
                        </button>
                        
                        {showSuggestions[`answer_${i}`] && (
                          <div className={styles.answerSuggestionPanel}>
                            <div className={styles.suggestionTitle}>إجابات مقترحة:</div>
                            <div className={styles.suggestionList}>
                              {suggestions.answers.slice(0, 4).map((answer, aIdx) => (
                                <button
                                  key={aIdx}
                                  type="button"
                                  className={styles.suggestionItem}
                                  onClick={() => handleSelectSuggestion(i, 'answer', answer)}
                                >
                                  {answer.length > 80 ? answer.substring(0, 80) + '...' : answer}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* زر إضافة جديد - يظهر دائماً في وضع التعديل */}
        {isEditing && (
          <div className={styles.addButtonWrapper}>
            <button onClick={handleAddNew} className={styles.addButton}>
              <Plus size={18} />
              إضافة سؤال جديد
            </button>
          </div>
        )}

        {/* نصائح إضافية في وضع التعديل */}
        {isEditing && (
          <div className={styles.tipsCard}>
            <div className={styles.tipsHeader}>
              <Lightbulb size={16} />
              <span>نصائح لكتابة أسئلة شائعة فعالة</span>
            </div>
            <div className={styles.tipsContent}>
              <ul>
                <li>🎯 <strong>ركز على الأسئلة الحقيقية</strong> - استمع لاستفسارات العملاء المتكررة</li>
                <li>📝 <strong>اجعل الإجابات واضحة ومختصرة</strong> - تجنب المصطلحات الطبية المعقدة</li>
                <li>✨ <strong>أضف تفاصيل مفيدة</strong> - اذكر المدة، التكلفة، والتعافي إن أمكن</li>
                <li>🔍 <strong>حسّن SEO</strong> - استخدم كلمات مفتاحية يبحث عنها العملاء</li>
                <li>📊 <strong>نوع الأسئلة</strong> - اجمع بين أسئلة عن العملية، التعافي، التكلفة، والنتائج</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqSection;