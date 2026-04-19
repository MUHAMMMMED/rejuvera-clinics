import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AxiosInstance from "../../components/Authentication/AxiosInstance";
import Navbar from "../../components/Navbar/Navbar";

import { GTMEvents } from "../../hooks/useGTM";
import styles from "./Blog.module.css";
import BlogCard from "./BlogCard/BlogCard";

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ إضافة useEffect لإرسال حدث pageView عند تحميل الصفحة
  useEffect(() => {
    // إرسال حدث مشاهدة صفحة المدونة
    GTMEvents.pageView("blog_list");
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await AxiosInstance.get("/blog/list/");

        // Axios يرجع البيانات مباشرة في response.data
        setBlogPosts(response.data);

      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError(err.response?.data?.message || err.message || "فشل في جلب المقالات");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ✅ دالة للتعامل مع النقر على المقال - إرسال حدث viewContent
  const handleBlogClick = (post) => {
    // إرسال حدث GTM عند النقر على مقال
    GTMEvents.viewContent(post.id, post.title);
    
    // يمكنك إضافة أي منطق إضافي هنا مثل التوجيه إلى صفحة التفاصيل
    // window.location.href = `/blog/${post.slug}`; // أو استخدام react-router Link
  };

  // تصفية المقالات حسب البحث
  const filteredPosts = blogPosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // عرض حالة التحميل
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.blogPage}>
          <div className={styles.container}>
            <div className={styles.loading}>جاري تحميل المقالات...</div>
          </div>
        </div>
      </>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <>
        <Navbar />
        <div className={styles.blogPage}>
          <div className={styles.container}>
            <div className={styles.error}>
              حدث خطأ: {error}
              <br />
              <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>المدونة | ريجوفيرا كلينك</title>
        <meta
          name="description"
          content="اقرأ أحدث المقالات والنصائح الطبية في مجال التجميل والعناية بالبشرة من خبراء ريجوفيرا كلينك"
        />
      </Helmet>

      <Navbar />

      <div className={styles.blogPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionBadge}>مدونتنا الطبية</span>
            <h1 className={styles.sectionTitle}>
              أحدث <span className={styles.goldText}>المقالات والنصائح</span>
            </h1>
            <p className={styles.sectionSubtitle}>
              نشاركك أحدث المعلومات والنصائح الطبية من خبرائنا
            </p>
          </div>

          {/* Search Bar */}
          <div className={styles.searchWrapper}>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="ابحث عن مقال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Blog Grid */}
          {filteredPosts.length > 0 ? (
            <div className={styles.grid}>
              {filteredPosts
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // ترتيب من الأحدث للأقدم
                .map((post, index) => (
                  <div 
                    key={post.id} 
                    onClick={() => handleBlogClick(post)}
                    style={{ cursor: 'pointer' }}
                  >
                    <BlogCard post={post} index={index} />
                  </div>
                ))}
            </div>
          ) : searchTerm ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3>لا توجد مقالات</h3>
              <p>لم نعثر على مقالات تطابق بحثك. حاول بكلمات مختلفة.</p>
            </div>
          ) : (
            <div className={styles.noResults}>
              <h3>لا توجد مقالات حالياً</h3>
              <p>سيتم إضافة مقالات جديدة قريباً.</p>
            </div>
          )}
        </div>
      </div>
      {/* <WhatsAppFloat phone={safeData?.info?.phone} whatsapp={safeData?.info?.whatsapp} /> */}
    </>
  );
}