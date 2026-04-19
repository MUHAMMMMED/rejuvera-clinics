import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import EmptyState from "../../components/EmptyState/EmptyState";
import ErrorState from "../../components/ErrorState/ErrorState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Navbar from "../../components/Navbar/Navbar";
import useDevice from "../../hooks/useDevice";
 
import { GTMEvents } from "../../hooks/useGTM";
import DesktopBookingModal from "../home/components/Desktop/components/BookingModal/BookingModal";
import MobileBookingModal from "../home/components/Mobile/components/BookingModal/BookingModal";
import styles from "./BlogDetails.module.css";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const deviceModal = useDevice();
  const [bookingModal, setBookingModal] = useState({ 
    isOpen: false, 
    id: null, 
    type: 's', 
    name: '' 
  });

  // ✅ GTM: Page View عند تحميل الصفحة
  useEffect(() => {
    GTMEvents.pageView("blog_details");
  }, []);

  // Fetch blog data from API
  const fetchBlogData = async () => {
    if (!id) {
      setError(new Error("No blog ID provided"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await AxiosInstance.get(`/blog/blog/${id}/detail`);
      const data = response.data;
      
      // Handle both possible API response structures
      if (data.blog) {
        // Case: API returns { blog: {...}, services: [...] }
        setBlog(data.blog);
        setAllServices(data.services || []);
      } else {
        // Case: API returns the blog object directly
        setBlog(data);
        setAllServices([]);
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [id, retryCount]);

  // ✅ GTM: View Content عند تحميل المقال بنجاح
  useEffect(() => {
    if (blog && blog.id) {
      GTMEvents.viewContent(blog.id, blog.title);
    }
  }, [blog]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // ✅ GTM: فتح نافذة الحجز (openBooking)
  const handleBookService = (service) => {
    GTMEvents.openBooking(service.id, service.name, 's');
    
    setBookingModal({
      isOpen: true,
      id: service.id,
      type: 's',
      name: service.name
    });
  };

  // ✅ GTM: نجاح الحجز (bookingSuccess)
  const handleBookingSuccess = () => {
    if (bookingModal.id && bookingModal.name) {
      GTMEvents.bookingSuccess(bookingModal.id, bookingModal.name, 's');
    }
  };

  // Helper to get related services data
  const getRelatedServices = () => {
    if (!blog?.related_services || blog.related_services.length === 0) return [];
    
    // If the API returns full service objects
    if (blog.related_services[0]?.name) {
      return blog.related_services;
    }
    
    // If the API only returns IDs, filter from allServices
    const serviceIds = blog.related_services.map(s => s.id || s);
    return allServices.filter(service => serviceIds.includes(service.id));
  };

  const relatedServices = getRelatedServices();

  // ============================================
  // SANITIZE AND PROCESS HTML CONTENT
  // ============================================
  
  // تكوين DOMPurify للأمان
  const sanitizeConfig = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'b', 'em', 'i', 'u', 'span',
      'a', 'img',
      'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'blockquote', 'pre', 'code',
      'div', 'section',
      'figure', 'figcaption',
      'iframe', 'video', 'source',
      'button',
      'del', 'ins', 'mark'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class',
      'id', 'style', 'width', 'height',
      'target', 'rel', 'loading',
      'controls', 'autoplay', 'loop', 'muted',
      'allow', 'allowfullscreen', 'frameborder'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  };

  // معالجة المحتوى HTML
  const processContent = (content) => {
    if (!content) return '<p>لا يوجد محتوى متاح حالياً.</p>';
    
    // تنظيف الـ HTML من أي أكواد ضارة
    let cleanContent = DOMPurify.sanitize(content, sanitizeConfig);
    
    // إضافة الكلاسات للصور لجعلها responsive
    cleanContent = cleanContent.replace(
      /<img(.*?)>/gi,
      (match, attrs) => {
        // إضافة كلاس responsive للصورة
        if (!attrs.includes('class=')) {
          return `<img${attrs} class="responsive-image" loading="lazy">`;
        }
        return match.replace(/class="([^"]*)"/, 'class="$1 responsive-image"');
      }
    );
    
    // إضافة كلاس للفيديو
    cleanContent = cleanContent.replace(
      /<iframe(.*?)>/gi,
      (match) => {
        // إضافة كلاس responsive للفيديو
        return match.replace(/<iframe/i, '<iframe class="responsive-video"');
      }
    );
    
    // إضافة wrapper للفيديو لجعله responsive
    cleanContent = cleanContent.replace(
      /<iframe(.*?)<\/iframe>/gi,
      (match) => {
        return `<div class="video-wrapper">${match}</div>`;
      }
    );
    
    // معالجة الجداول لجعلها responsive
    cleanContent = cleanContent.replace(
      /<table(.*?)>(.*?)<\/table>/gis,
      (match) => {
        return `<div class="table-wrapper">${match}</div>`;
      }
    );
    
    return cleanContent;
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  // Loading State
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.blogLoadingContainerUnique}>
          <LoadingSpinner 
            message="جاري تحميل المقال..."
            size="large"
            fullPage={false}
          />
        </div>
      </>
    );
  }

  // Error State
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
        <Navbar />
        <div className={styles.blogErrorContainerUnique}>
          <ErrorState
            type={errorType}
            title={errorTitle}
            message={errorMessage}
            onRetry={handleRetry}
            fullPage={false}
          />
        </div>
      </>
    );
  }

  // No Data State
  if (!blog) {
    return (
      <>
        <Navbar />
        <div className={styles.blogErrorContainerUnique}>
          <EmptyState 
            type="default"
            title="المقال غير موجود"
            message="المقال الذي تبحث عنه قد تم حذفه أو نقله."
            actionText="العودة إلى المدونة"
            onAction={() => navigate('/blog')}
            fullPage={false}
          />
        </div>
      </>
    );
  }

  const formattedDate = new Date(blog.created_at).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // معالجة المحتوى النهائي
  const sanitizedContent = processContent(blog.content);

  return (
    <>
      <Helmet>
        <title>{blog.title} | ريجوفيرا كلينك</title>
        <meta name="description" content={blog.summary} />
        <meta name="keywords" content={blog.tags?.join(', ') || ''} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.summary} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.created_at} />
        {blog.author && <meta property="article:author" content={blog.author} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.summary} />
      </Helmet>

      <Navbar />

      <article className={styles.blogDetailsUnique}>
        <div className={styles.blogContainerUnique}>
          {/* Breadcrumb */}
          <div className={styles.blogBreadcrumbUnique}>
            <Link to="/">الرئيسية</Link>
            <span>/</span>
            <Link to="/blog">المدونة</Link>
            <span>/</span>
            <span className={styles.blogBreadcrumbCurrentUnique}>{blog.title}</span>
          </div>

          {/* Hero Section */}
          <div className={styles.blogHeroUnique}>
            <div className={styles.blogHeroContentUnique}>
              <h1>{blog.title}</h1>
              <div className={styles.blogMetaUnique}>
                <div className={styles.blogAuthorInfoUnique}>
                  {blog.author && (
                    <>
                      <span className={styles.blogAuthorNameUnique}>{blog.author}</span>
                      {blog.author_title && (
                        <span className={styles.blogAuthorTitleUnique}>{blog.author_title}</span>
                      )}
                    </>
                  )}
                </div>
                <div className={styles.blogStatsUnique}>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content - معالجة الـ HTML الداخلي */}
          <div className={styles.blogContentWrapperUnique}>
            <div className={styles.blogMainContentUnique}>
              <div 
                className={styles.blogContentUnique}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
              
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className={styles.blogTagsUnique}>
                  <h4>وسوم:</h4>
                  <div className={styles.blogTagsListUnique}>
                    {blog.tags.map((tag, index) => (
                      <span key={index} className={styles.blogTagUnique}>#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className={styles.blogRelatedServicesUnique}>
              <h2>
                <span className={styles.blogGoldTextUnique}>✨ خدمات مرتبطة</span> بهذا المقال
              </h2>
              <p className={styles.blogServicesIntroUnique}>
                يمكنك حجز أي من هذه الخدمات التي تتعلق بموضوع المقال
              </p>
              
              <div className={styles.blogServicesGridUnique}>
                {relatedServices.map((service) => (
                  <div key={service.id} className={styles.blogServiceCardUnique}>
                    {/* Section 1: Icon + Content (title and description) */}
                    <div className={styles.blogServiceCardContentUnique}>
                      <div className={styles.blogServiceIconUnique} aria-hidden="true">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 12V8H4v4M12 4v4M8 4v4M16 4v4" />
                          <path d="M4 12h16v8H4z" />
                        </svg>
                      </div>
                      <div className={styles.blogServiceInfoUnique}>
                        <h3>{service.name}</h3>
                        {service.description && <p>{service.description}</p>}
                      </div>
                    </div>
                    
                    {/* Section 2: Booking Button */}
                    <div className={styles.blogServiceCardActionUnique}>
                      <button 
                        className={styles.blogBookServiceBtnUnique}
                        onClick={() => handleBookService(service)}
                      >
                        احجز الخدمة
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Booking Modal - Conditionally render based on device type */}
      {deviceModal === "mobile" ? (
        <MobileBookingModal
          isOpen={bookingModal.isOpen}
          onClose={() => setBookingModal({ isOpen: false, id: null, type: 's', name: '' })}
          itemId={bookingModal.id}
          itemType={bookingModal.type}
          itemName={bookingModal.name}
          onSuccess={handleBookingSuccess}
        />
      ) : (
        <DesktopBookingModal
          isOpen={bookingModal.isOpen}
          onClose={() => setBookingModal({ isOpen: false, id: null, type: 's', name: '' })}
          itemId={bookingModal.id}
          itemType={bookingModal.type}
          itemName={bookingModal.name}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
}