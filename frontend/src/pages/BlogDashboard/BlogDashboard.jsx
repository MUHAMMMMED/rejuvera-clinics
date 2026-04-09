 
import DOMPurify from 'dompurify';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AxiosInstance from '../../components/Authentication/AxiosInstance';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import EmptyState from '../../components/EmptyState/EmptyState';
import ErrorState from '../../components/ErrorState/ErrorState';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './BlogDashboard.module.css';

const EMPTY_FORM = {
  title: '',
  summary: '',
  content: '',
  related_services: [],  
};

function blogToForm(blog) {
  return {
    title:            blog.title            ?? '',
    summary:          blog.summary          ?? '',
    content:          blog.content          ?? '',
    related_services: blog.related_services?.map((s) => (typeof s === 'object' ? s.id : s)) ?? [],
  };
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function BlogDashboard() {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [blog,        setBlog]        = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [isEditing,   setIsEditing]   = useState(false);
  const [isSaving,    setIsSaving]    = useState(false);
  const [saveMsg,     setSaveMsg]     = useState({ type: '', text: '' });
  const [retryCount,  setRetryCount]  = useState(0);

  const [formData,     setFormData]     = useState(EMPTY_FORM);
  const [originalForm, setOriginalForm] = useState(null);
  const [searchService, setSearchService] = useState('');

  const editorRef   = useRef(null);
  const quillRef    = useRef(null);
  const quillReady  = useRef(false);
  const skipSyncRef = useRef(false);

  // ── helpers ─────────────────────────────────────────────────
  const setForm  = (patch) => setFormData((prev) => ({ ...prev, ...patch }));
  const clearMsg = () => setSaveMsg({ type: '', text: '' });

  const hasChanges = useCallback(() => {
    if (!originalForm) return false;
    const fields = ['title', 'summary', 'content'];
    const basicChanged = fields.some((f) => originalForm[f] !== formData[f]);
    const servicesChanged =
      JSON.stringify([...originalForm.related_services].sort()) !==
      JSON.stringify([...formData.related_services].sort());
    return basicChanged || servicesChanged;
  }, [originalForm, formData]);

  const resetToBlog = useCallback((src = blog) => {
    if (!src) return;
    const fresh = blogToForm(src);
    setFormData(fresh);
    setOriginalForm(JSON.parse(JSON.stringify(fresh)));
    if (quillRef.current) {
      skipSyncRef.current = true;
      quillRef.current.root.innerHTML = fresh.content;
    }
  }, [blog]);

  // ── fetch blog ───────────────────────────────────────────────
  const fetchBlog = useCallback(async () => {
    if (!id) {
      setError(new Error("No blog ID provided"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data } = await AxiosInstance.get(`/blog/dashboard/blog/${id}/`);
      setBlog(data.blog);
      setAllServices(data.services ?? []);
      const fresh = blogToForm(data.blog);
      setFormData(fresh);
      setOriginalForm(JSON.parse(JSON.stringify(fresh)));
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // ── Quill: init when editing starts, destroy when it ends ───
  useEffect(() => {
    if (!isEditing || !editorRef.current || quillReady.current) return;

    const imageHandler = () => {
      const input = document.createElement('input');
      input.type   = 'file';
      input.accept = 'image/*';
      input.click();
      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('image', file);
        try {
          const { data } = await AxiosInstance.post('/media/upload/', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const range = quillRef.current.getSelection(true);
          quillRef.current.insertEmbed(range.index, 'image', data.url);
        } catch {
          setSaveMsg({ type: 'error', text: 'فشل رفع الصورة' });
        }
      };
    };

    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: 'اكتب محتوى المقال هنا...',
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean'],
          ],
          handlers: { image: imageHandler },
        },
      },
    });

    quillReady.current = true;
    quillRef.current.root.innerHTML = formData.content ?? '';

    quillRef.current.on('text-change', () => {
      if (skipSyncRef.current) {
        skipSyncRef.current = false;
        return;
      }
      const html = quillRef.current.root.innerHTML;
      setFormData((prev) => ({ ...prev, content: html }));
    });

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        quillRef.current = null;
        quillReady.current = false;
        if (editorRef.current) editorRef.current.innerHTML = '';
      }
    };
  }, [isEditing, formData.content]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ [name]: value });
  };

  // ── related services ─────────────────────────────────────────
  const addService = (sid) => {
    if (formData.related_services.includes(sid)) return;
    setForm({ related_services: [...formData.related_services, sid] });
  };

  const removeService = (sid) => {
    setForm({ related_services: formData.related_services.filter((x) => x !== sid) });
  };

  // ── edit mode toggle ─────────────────────────────────────────
  const startEditing = () => {
    resetToBlog(blog);
    setIsEditing(true);
    clearMsg();
  };

  const cancelEditing = () => {
    if (hasChanges()) {
      if (!window.confirm('هل أنت متأكد من إلغاء التعديلات؟ سيتم فقدان التغييرات غير المحفوظة.')) return;
    }
    resetToBlog(blog);
    setIsEditing(false);
    clearMsg();
  };

  // ── validation ───────────────────────────────────────────────
  const validate = () => {
    const blank = (s) => !s || !s.trim();
    if (blank(formData.title))   { setSaveMsg({ type: 'error', text: 'يرجى إدخال عنوان المقال' });  return false; }
    if (blank(formData.summary)) { setSaveMsg({ type: 'error', text: 'يرجى إدخال ملخص المقال' });   return false; }
    const emptyContent = !formData.content || ['', '<p><br></p>', '<p></p>'].includes(formData.content.trim());
    if (emptyContent)            { setSaveMsg({ type: 'error', text: 'يرجى إضافة محتوى للمقال' });  return false; }
    return true;
  };

  // ── submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    clearMsg();

    try {
      const { data: updated } = await AxiosInstance.patch(`/blog/blogs/${id}/`, {
        title:            formData.title,
        summary:          formData.summary,
        content:          formData.content,
        related_services: formData.related_services,
      });

      setBlog(updated);
      const fresh = blogToForm(updated);
      setFormData(fresh);
      setOriginalForm(JSON.parse(JSON.stringify(fresh)));

      setSaveMsg({ type: 'success', text: 'تم حفظ التعديلات بنجاح!' });
      setTimeout(() => {
        setIsEditing(false);
        clearMsg();
      }, 1500);
    } catch (err) {
      setSaveMsg({
        type: 'error',
        text: err.response?.data?.message ?? 'حدث خطأ أثناء حفظ التعديلات',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── derived ──────────────────────────────────────────────────
  const filteredServices = allServices.filter((s) =>
    s.name.toLowerCase().includes(searchService.toLowerCase()),
  );
  const selectedServices = allServices.filter((s) =>
    formData.related_services.includes(s.id),
  );

  // ── Loading State ────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <DashboardHeader
          title="جاري التحميل..."
          showBackButton={true}
        />
        <LoadingSpinner
          message="جاري تحميل بيانات المقال..."
          size="large"
          fullPage={false}
        />
      </>
    );
  }

  // ── Error State ──────────────────────────────────────────────
  if (error) {
    let errorType = 'error';
    let errorTitle = 'حدث خطأ';
    let errorMessage = 'عذراً، حدث خطأ أثناء تحميل المقال. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.status === 404) {
      errorType = 'no-data';
      errorTitle = 'مقال غير موجود';
      errorMessage = 'المقال الذي تبحث عنه غير موجود. قد يكون قد تم حذفه أو تغيير رابطها.';
    } else if (error.response?.status === 403) {
      errorType = 'error';
      errorTitle = 'غير مصرح';
      errorMessage = 'ليس لديك صلاحية للوصول إلى هذا المقال.';
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

  // ── No Data State ────────────────────────────────────────────
  if (!blog) {
    return (
      <>
        <DashboardHeader
          title="المقال غير موجود"
          showBackButton={true}
        />
        <EmptyState 
          type="default"
          title="المقال غير موجود"
          message="المقال الذي تبحث عنه قد تم حذفه أو نقله."
          actionText="العودة إلى المدونة"
          onAction={() => navigate('/blog')}
          fullPage={false}
        />
      </>
    );
  }

  const formattedDate = new Date(blog.created_at).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // ─────────────────────────────────────────────────────────────
  // Render – main
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>{isEditing ? 'تعديل المقال' : blog.title} | ريجوفيرا كلينك</title>
        <meta name="description" content={blog.summary} />
        {isEditing && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>

      <DashboardHeader
        title={blog?.title || ''}
        showBackButton={true}
      />

      <article className={styles.blogDetails}>
        <div className={styles.container}>

          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link to="/">الرئيسية</Link>
            <span>/</span>
            <Link to="/blog">المدونة</Link>
            <span>/</span>
            <span className={styles.current}>
              {isEditing ? 'تعديل المقال' : blog.title}
            </span>
          </nav>

          {/* Edit toggle */}
          <div className={styles.editModeToggle}>
            <button
              className={`${styles.editModeBtn} ${isEditing ? styles.active : ''}`}
              onClick={isEditing ? cancelEditing : startEditing}
            >
              {isEditing ? '  إلغاء التعديل' : ' تعديل المقال'}
            </button>
          </div>

          {/* Feedback message */}
          {saveMsg.text && (
            <div className={`${styles.saveMessage} ${styles[saveMsg.type]}`} role="alert">
              {saveMsg.text}
            </div>
          )}

          {/* ════════════ EDIT MODE ════════════ */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className={styles.editForm} noValidate>

              {/* ── Basic info ── */}
              <section className={styles.formSection}>
                <h3>  معلومات المقال</h3>

                <div className={styles.formGroup}>
                  <label htmlFor="title">عنوان المقال *</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="أدخل عنوان المقال"
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="summary">الملخص *</label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="ملخص قصير للمقال (يظهر في بطاقة المقال)"
                    required
                    disabled={isSaving}
                  />
                  <small className={styles.hintText}>
                    الملخص يظهر في قائمة المقالات وفي نتائج البحث
                  </small>
                </div>
              </section>

              {/* ── Rich-text editor ── */}
              <section className={styles.formSection}>
                <h3>✍️ محتوى المقال *</h3>
                <div className={styles.richTextEditor}>
                  <div ref={editorRef} className={styles.quillEditor} />
                  <small className={styles.hintText}>
                    💡 يمكنك استخدام أدوات التنسيق لإضافة عناوين، قوائم، روابط، صور، وأكثر
                  </small>
                </div>
              </section>

              {/* ── Related services ── */}
              <section className={styles.formSection}>
                <h3>🔗 الخدمات المرتبطة بالمقال</h3>

                {/* Selected */}
                <div className={styles.selectedServices}>
                  <h4>  الخدمات المختارة حالياً</h4>
                  <div className={styles.selectedServicesGrid}>
                    {selectedServices.length > 0 ? (
                      selectedServices.map((s) => (
                        <div key={s.id} className={styles.selectedServiceItem}>
                          <span>{s.name}</span>
                          <button
                            type="button"
                            onClick={() => removeService(s.id)}
                            className={styles.removeServiceBtn}
                            aria-label={`إزالة ${s.name}`}
                            disabled={isSaving}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className={styles.noServicesMsg}>⚠️ لم يتم اختيار أي خدمات مرتبطة</p>
                    )}
                  </div>
                </div>

                {/* Available */}
                <div className={styles.availableServices}>
                  <h4>➕ إضافة خدمة جديدة</h4>
                  <input
                    type="text"
                    placeholder="🔍 ابحث عن خدمة..."
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    className={styles.searchInput}
                    disabled={isSaving}
                  />
                  <div className={styles.servicesList}>
                    {filteredServices.length > 0 ? (
                      filteredServices.map((s) => {
                        const added = formData.related_services.includes(s.id);
                        return (
                          <div key={s.id} className={styles.serviceItem}>
                            <div className={styles.serviceItemInfo}>
                              <strong>{s.name}</strong>
                              {s.description && (
                                <small>{s.description.substring(0, 100)}…</small>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => addService(s.id)}
                              disabled={added || isSaving}
                              className={styles.addServiceBtn}
                            >
                              {added ? '✓ تمت الإضافة' : '+ أضف'}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className={styles.noResults}>لا توجد خدمات تطابق بحثك</p>
                    )}
                  </div>
                </div>
              </section>

              {/* ── Actions ── */}
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveAllBtn} disabled={isSaving}>
                  {isSaving ? 'جاري الحفظ...' : '  حفظ التغييرات'}
                </button>
                <button type="button" className={styles.cancelAllBtn} onClick={cancelEditing} disabled={isSaving}>
                   إلغاء
                </button>
              </div>
            </form>

          ) : (
            /* ════════════ VIEW MODE ════════════ */
            <>
              <div className={styles.blogHero}>
                <div className={styles.blogHeroContent}>
                  <h1>{blog.title}</h1>
                  <div className={styles.blogMeta}>
                    <span>  {formattedDate}</span>
                  </div>
                </div>
              </div>

              <div className={styles.blogContentWrapper}>
                <div className={styles.blogMainContent}>
                  <div
                    className={styles.blogContent}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        blog.content || '<p>لا يوجد محتوى متاح حالياً.</p>',
                      ),
                    }}
                  />
                </div>
              </div>

              {/* Related Services */}
              {blog.related_services?.length > 0 && (
                <div className={styles.relatedServices}>
                  <h2>
                    <span className={styles.goldText}>✨ خدمات مرتبطة</span> بهذا المقال
                  </h2>
                  <p className={styles.servicesIntro}>
                    يمكنك حجز أي من هذه الخدمات التي تتعلق بموضوع المقال
                  </p>
                  <div className={styles.servicesGrid}>
                    {blog.related_services.map((s) => (
                      <div key={s.id} className={styles.serviceCard}>
                        <div className={styles.serviceIcon} aria-hidden="true">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 12V8H4v4M12 4v4M8 4v4M16 4v4" />
                            <path d="M4 12h16v8H4z" />
                          </svg>
                        </div>
                        <div className={styles.serviceInfo}>
                          <h3>{s.name}</h3>
                          {s.description && <p>{s.description}</p>}
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
            </>
          )}

        </div>
      </article>
    </>
  );
}