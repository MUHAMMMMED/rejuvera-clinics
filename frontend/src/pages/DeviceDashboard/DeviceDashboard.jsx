 
import DOMPurify from 'dompurify';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
 
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from "./DeviceDashboard.module.css";

export default function DeviceDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [originalFormData, setOriginalFormData] = useState(null);
  
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const isInitialized = useRef(false);
  
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    content: "",
    technology: "",
    treatments: 0,
    is_new: false,
    image: null,
    imagePreview: "",
    related_services: []
  });
  
  const [searchServiceTerm, setSearchServiceTerm] = useState("");
  const fileInputRef = useRef(null);

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (!originalFormData) return false;
    
    const basicFieldsEqual = 
      originalFormData.name === formData.name &&
      originalFormData.summary === formData.summary &&
      originalFormData.content === formData.content &&
      originalFormData.technology === formData.technology &&
      originalFormData.treatments === formData.treatments &&
      originalFormData.is_new === formData.is_new &&
      JSON.stringify(originalFormData.related_services) === JSON.stringify(formData.related_services);
    
    const imageChanged = formData.image !== null;
    
    return !basicFieldsEqual || imageChanged;
  };

  // Reset form to original data
  const resetForm = () => {
    if (device) {
      setFormData({
        name: device.name || "",
        summary: device.summary || "",
        content: device.content || "",
        technology: device.technology || "",
        treatments: device.treatments || 0,
        is_new: device.is_new || false,
        image: null,
        imagePreview: device.image || "",
        related_services: device.related_services?.map(s => s.id) || []
      });
      if (quillInstance.current && device.content) {
        quillInstance.current.root.innerHTML = device.content;
      }
    }
  };

  // Image upload handler for Quill
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        try {
          const response = await AxiosInstance.post(`/device/devices/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          const range = quillInstance.current.getSelection();
          quillInstance.current.insertEmbed(range.index, 'image', response.data.url);
        } catch (error) {
          console.error('Error uploading image:', error);
          setSaveMessage({ type: "error", text: "فشل رفع الصورة" });
        }
      }
    };
  };

  // Fetch device data
  const fetchDeviceData = async () => {
    if (!id) {
      setError(new Error("No device ID provided"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await AxiosInstance.get(`/device/dashboard/device/${id}/`);
      const data = response.data;
      setDevice(data.device);
      setAllServices(data.services || []);
      
      const newFormData = {
        name: data.device.name || "",
        summary: data.device.summary || "",
        content: data.device.content || "",
        technology: data.device.technology || "",
        treatments: data.device.treatments || 0,
        is_new: data.device.is_new || false,
        image: null,
        imagePreview: data.device.image || "",
        related_services: data.device.related_services?.map(s => s.id) || []
      };
      setFormData(newFormData);
      setOriginalFormData(JSON.parse(JSON.stringify(newFormData)));
    } catch (err) {
      console.error("Error fetching device:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceData();
  }, [id, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Initialize Quill editor
  useEffect(() => {
    if (isEditing && editorRef.current && !isInitialized.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'اكتب المحتوى التفصيلي للجهاز هنا...',
        modules: {
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'align': [] }],
              ['blockquote', 'code-block'],
              ['link', 'image'],
              ['clean']
            ],
            handlers: {
              image: imageHandler
            }
          },
        },
      });
      
      isInitialized.current = true;
      
      if (formData.content) {
        quillInstance.current.root.innerHTML = formData.content;
      }
      
      quillInstance.current.on('text-change', () => {
        const html = quillInstance.current.root.innerHTML;
        setFormData(prev => ({ ...prev, content: html }));
      });
    }
    
    return () => {
      if (quillInstance.current) {
        quillInstance.current.off('text-change');
        if (!isEditing) {
          quillInstance.current = null;
          isInitialized.current = false;
        }
      }
    };
  }, [isEditing]);

  // Update content when formData.content changes from external source
  useEffect(() => {
    if (quillInstance.current && formData.content !== quillInstance.current.root.innerHTML) {
      quillInstance.current.root.innerHTML = formData.content;
    }
  }, [formData.content]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSaveMessage({ type: "error", text: "يرجى اختيار ملف صورة صالح" });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setSaveMessage({ type: "error", text: "حجم الصورة يجب أن لا يتجاوز 5 ميجابايت" });
        return;
      }
      
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addRelatedService = (serviceId) => {
    if (!formData.related_services.includes(serviceId)) {
      setFormData({
        ...formData,
        related_services: [...formData.related_services, serviceId]
      });
    }
  };

  const removeRelatedService = (serviceId) => {
    setFormData({
      ...formData,
      related_services: formData.related_services.filter(id => id !== serviceId)
    });
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges()) {
      if (window.confirm('هل أنت متأكد من إلغاء التعديلات؟ سيتم فقدان التغييرات غير المحفوظة.')) {
        resetForm();
        setIsEditing(false);
        setSaveMessage({ type: "", text: "" });
      }
    } else {
      setIsEditing(false);
      setSaveMessage({ type: "", text: "" });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setSaveMessage({ type: "error", text: "يرجى إدخال اسم الجهاز" });
      return false;
    }
    
    if (!formData.summary.trim()) {
      setSaveMessage({ type: "error", text: "يرجى إدخال ملخص الجهاز" });
      return false;
    }
    
    if (!formData.content || formData.content === "<p><br></p>" || formData.content.trim() === "") {
      setSaveMessage({ type: "error", text: "يرجى إضافة محتوى تفصيلي للجهاز" });
      return false;
    }
    
    if (!formData.technology.trim()) {
      setSaveMessage({ type: "error", text: "يرجى إدخال التقنية المستخدمة" });
      return false;
    }
    
    if (formData.treatments < 0) {
      setSaveMessage({ type: "error", text: "عدد العلاجات يجب أن يكون رقم موجب" });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('summary', formData.summary);
      submitData.append('content', formData.content);
      submitData.append('technology', formData.technology);
      submitData.append('treatments', formData.treatments);
      submitData.append('is_new', formData.is_new);
      submitData.append('related_services', JSON.stringify(formData.related_services));
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await AxiosInstance.patch(`/device/devices/${id}/`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedDevice = response.data;
      setDevice(updatedDevice);
      
      const newFormData = {
        ...formData,
        image: null,
        imagePreview: updatedDevice.image || formData.imagePreview,
      };
      setOriginalFormData(JSON.parse(JSON.stringify(newFormData)));
      
      setSaveMessage({ type: "success", text: "تم حفظ جميع التعديلات بنجاح!" });
      
      setTimeout(() => {
        setIsEditing(false);
        setSaveMessage({ type: "", text: "" });
        fetchDeviceData(); // Refresh data instead of reload
      }, 1500);
    } catch (error) {
      console.error("Error updating device:", error);
      setSaveMessage({ type: "error", text: error.response?.data?.message || "حدث خطأ أثناء حفظ التعديلات" });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredServices = allServices.filter(service =>
    service.name.toLowerCase().includes(searchServiceTerm.toLowerCase())
  );

  const selectedServices = allServices.filter(service =>
    formData.related_services.includes(service.id)
  );

  // Loading State
  if (loading) {
    return (
      <>
        <DashboardHeader
          title="جاري التحميل..."
          showBackButton={true}
        />
        <LoadingSpinner 
          message="جاري تحميل بيانات الجهاز..."
          size="large"
          fullPage={false}
        />
      </>
    );
  }

  // Error State
  if (error) {
    let errorType = 'error';
    let errorTitle = 'حدث خطأ';
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل بيانات الجهاز. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'جهاز غير موجود';
      errorMessage = 'الجهاز الذي تبحث عنه غير موجود. قد يكون قد تم حذفه أو تغيير رابطها.';
    } else if (error.response?.status === 403) {
      errorType = 'error';
      errorTitle = 'غير مصرح';
      errorMessage = 'ليس لديك صلاحية للوصول إلى هذا الجهاز.';
    } else if (error.response?.status === 500) {
      errorType = 'server';
      errorTitle = 'خطأ في الخادم';
      errorMessage = 'عذراً، حدث خطأ في الخادم. يرجى المحاولة لاحقاً.';
    } else if (error.code === 'ERR_NETWORK') {
      errorType = 'network';
      errorTitle = 'مشكلة في الاتصال';
      errorMessage = 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
    }
    
    return (
      <>
        <DashboardHeader
          title="خطأ"
          showBackButton={true}
        />
        <ErrorState
          type={errorType}
          title={errorTitle}
          message={errorMessage}
          onRetry={handleRetry}
          fullPage={false}
        />
      </>
    );
  }

  // No Data State
  if (!device) {
    return (
      <>
        <DashboardHeader
          title="الجهاز غير موجود"
          showBackButton={true}
        />
        <EmptyState 
          type="default"
          title="الجهاز غير موجود"
          message="الجهاز الذي تبحث عنه قد تم حذفه أو نقله."
          actionText="العودة إلى الأجهزة"
          onAction={() => navigate('/devices')}
          fullPage={false}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? "تعديل الجهاز" : device.name} | ريجوفيرا كلينك</title>
        <meta name="description" content={device.summary} />
        {isEditing && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>

      <DashboardHeader
        title={device?.name || ''}
        showBackButton={true}
      />
      
      <article className={styles.deviceDetails}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link to="/">الرئيسية</Link>
            <span>/</span>
            <Link to="/devices">الأجهزة</Link>
            <span>/</span>
            <span className={styles.current}>{isEditing ? "تعديل الجهاز" : device.name}</span>
          </div>

          <div className={styles.editModeToggle}>
            <button 
              className={`${styles.editModeBtn} ${isEditing ? styles.active : ''}`}
              onClick={() => {
                if (!isEditing) {
                  resetForm();
                  setIsEditing(true);
                } else {
                  handleCancelEdit();
                }
              }}
            >
              {isEditing ? "❌ إلغاء التعديل" : "✏️ تعديل الجهاز"}
            </button>
          </div>

          {saveMessage.text && (
            <div className={`${styles.saveMessage} ${styles[saveMessage.type]}`}>
              {saveMessage.text}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className={styles.editForm}>
              {/* المعلومات الأساسية */}
              <div className={styles.formSection}>
                <h3>  المعلومات الأساسية</h3>
                
                <div className={styles.formGroup}>
                  <label>اسم الجهاز *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسم الجهاز"
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>صورة الجهاز</label>
                  <div className={styles.imageUploadArea}>
                    {formData.imagePreview && (
                      <div className={styles.imagePreview}>
                        <img src={formData.imagePreview} alt="Preview" />
                        <button
                          type="button"
                          className={styles.removeImageBtn}
                          onClick={() => {
                            setFormData({...formData, imagePreview: "", image: null});
                            if(fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          disabled={isSaving}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageSelect}
                      className={styles.fileInput}
                      disabled={isSaving}
                    />
                    <small className={styles.hintText}>يُفضل استخدام صورة بحجم 500x500 بكسل (الحد الأقصى 5 ميجابايت)</small>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>الملخص القصير *</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="ملخص قصير عن الجهاز (يظهر في بطاقة الجهاز)"
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>التقنية المستخدمة *</label>
                    <input
                      type="text"
                      name="technology"
                      value={formData.technology}
                      onChange={handleInputChange}
                      placeholder="مثال: الراديو فريكونسي"
                      required
                      disabled={isSaving}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>عدد العلاجات *</label>
                    <input
                      type="number"
                      name="treatments"
                      value={formData.treatments}
                      onChange={handleInputChange}
                      placeholder="مثال: 15"
                      min="0"
                      required
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="is_new"
                      checked={formData.is_new}
                      onChange={handleInputChange}
                      disabled={isSaving}
                    /> 
                    <span>🆕 جهاز جديد (يظهر علامة NEW)</span>
                  </label>
                </div>
              </div>

              {/* محرر المحتوى المتقدم */}
              <div className={styles.formSection}>
                <h3>✍️ المحتوى التفصيلي *</h3>
                <div className={styles.richTextEditor}>
                  <div ref={editorRef} className={styles.quillEditor}></div>
                  <small className={styles.hintText}>
                    💡 يمكنك استخدام أدوات التنسيق أعلاه لإضافة عناوين، قوائم، روابط، صور، وأكثر
                  </small>
                </div>
              </div>

              {/* إدارة الخدمات المرتبطة */}
              <div className={styles.formSection}>
                <h3>🔗 الخدمات المرتبطة بالجهاز</h3>
                
                <div className={styles.selectedServices}>
                  <h4>  الخدمات المختارة حالياً</h4>
                  <div className={styles.selectedServicesGrid}>
                    {selectedServices.map(service => (
                      <div key={service.id} className={styles.selectedServiceItem}>
                        <span>{service.name}</span>
                        <button
                          type="button"
                          onClick={() => removeRelatedService(service.id)}
                          className={styles.removeServiceBtn}
                          title="إزالة الخدمة"
                          disabled={isSaving}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedServices.length === 0 && (
                    <p className={styles.noServicesMsg}>⚠️ لم يتم اختيار أي خدمات مرتبطة</p>
                  )}
                </div>

                <div className={styles.availableServices}>
                  <h4>➕ إضافة خدمة جديدة</h4>
                  <input
                    type="text"
                    placeholder="🔍 ابحث عن خدمة..."
                    value={searchServiceTerm}
                    onChange={(e) => setSearchServiceTerm(e.target.value)}
                    className={styles.searchInput}
                    disabled={isSaving}
                  />
                  <div className={styles.servicesList}>
                    {filteredServices.length > 0 ? (
                      filteredServices.map(service => (
                        <div key={service.id} className={styles.serviceItem}>
                          <div className={styles.serviceItemInfo}>
                            <strong>{service.name}</strong>
                            <small>{service.description?.substring(0, 100)}...</small>
                          </div>
                          <button
                            type="button"
                            onClick={() => addRelatedService(service.id)}
                            disabled={formData.related_services.includes(service.id) || isSaving}
                            className={styles.addServiceBtn}
                          >
                            {formData.related_services.includes(service.id) ? "✓ تمت الإضافة" : "+ أضف"}
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className={styles.noResults}>لا توجد خدمات تطابق بحثك</p>
                    )}
                  </div>
                </div>
              </div>

              {/* أزرار الحفظ */}
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveAllBtn} disabled={isSaving}>
                  {isSaving ? " جاري الحفظ..." : "  حفظ جميع التغييرات"}
                </button>
                <button type="button" className={styles.cancelAllBtn} onClick={handleCancelEdit} disabled={isSaving}>
                    إلغاء
                </button>
              </div>
            </form>
          ) : (
            // وضع العرض
            <>
              <div className={styles.deviceHero}>
                <div className={styles.deviceHeroImage}>
                  <img src={device.image} alt={device.name} />
                  {device.is_new && <span className={styles.newTag}>جديد</span>}
                </div>
                <div className={styles.deviceHeroContent}>
                  <h1>{device.name}</h1>
                  <p className={styles.deviceSummary}>{device.summary}</p>
                  <div className={styles.deviceStats}>
                    <div className={styles.stat}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      <span>{device.technology}</span>
                    </div>
                    <div className={styles.stat}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 12V8H4v4M12 4v4M8 4v4M16 4v4" />
                        <path d="M4 12h16v8H4z" />
                      </svg>
                      <span>{device.treatments}+ علاج</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.deviceContentWrapper}>
                <div className={styles.deviceMainContent}>
                  <h2>  وصف الجهاز</h2>
                  <div 
                    className={styles.deviceDescription}
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(device.content || "<p>لا يوجد وصف متاح حالياً.</p>")
                    }}
                  />
                </div>

                {device.related_services && device.related_services.length > 0 && (
                  <div className={styles.relatedServices}>
                    <h2>
                      <span className={styles.goldText}>✨ خدمات مرتبطة</span> بهذا الجهاز
                    </h2>
                    <div className={styles.servicesGrid}>
                      {device.related_services.map((service) => (
                        <div key={service.id} className={styles.serviceCard}>
                          <div className={styles.serviceIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M20 12V8H4v4M12 4v4M8 4v4M16 4v4" />
                              <path d="M4 12h16v8H4z" />
                            </svg>
                          </div>
                          <div className={styles.serviceInfo}>
                            <h3>{service.name}</h3>
                            <p>{service.description}</p>
                          </div>
                          <button 
                            className={styles.bookServiceBtn}
 
                          >
                            احجز الخدمة
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </article>
    </>
  );
}