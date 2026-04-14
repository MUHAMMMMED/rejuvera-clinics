import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import EmptyState from "../../components/EmptyState/EmptyState";
import ErrorState from "../../components/ErrorState/ErrorState";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Navbar from "../../components/Navbar/Navbar";
import BookingModal from "../home/components/Desktop/components/BookingModal/BookingModal";
import styles from "./BlogDetails.module.css";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const [bookingModal, setBookingModal] = useState({ 
    isOpen: false, 
    id: null, 
    type: 's', 
    name: '' 
  });

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

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleBookService = (service) => {
    setBookingModal({
      isOpen: true,
      id: service.id,
      type: 's',
      name: service.name
    });
  };

  const handleBookingSuccess = () => {
    console.log('تم حجز الخدمة بنجاح');
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

  return (
    <>
      <Helmet>
        <title>{blog.title} | ريجوفيرا كلينك</title>
        <meta name="description" content={blog.summary} />
        <meta name="keywords" content={blog.tags?.join(', ') || ''} />
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

          {/* Content */}
          <div className={styles.blogContentWrapperUnique}>
            <div className={styles.blogMainContentUnique}>
              <div 
                className={styles.blogContentUnique}
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(
                    blog.content || '<p>لا يوجد محتوى متاح حالياً.</p>'
                  )
                }}
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, id: null, type: 's', name: '' })}
        itemId={bookingModal.id}
        itemType={bookingModal.type}
        itemName={bookingModal.name}
        onSuccess={handleBookingSuccess}
      />
    </>
  );
}