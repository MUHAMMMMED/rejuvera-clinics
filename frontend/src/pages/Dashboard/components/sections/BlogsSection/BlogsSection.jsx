import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // إضافة useNavigate
import { blogsApi } from '../../../api';
import { Icons } from '../../common/Icons/Icons';
import Modal from '../../common/Modal/Modal';
import './BlogsSection.css';

const BlogsSection = ({ blogs: initialBlogs, showToast, onRefresh }) => {
  const navigate = useNavigate(); // إضافة useNavigate
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    summary: '', 
    related_services: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setBlogs(initialBlogs || []);
  }, [initialBlogs]);

  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingBlog(null);
    setFormData({ title: '', summary: '', content: '', related_services: [] });
    setIsModalOpen(true);
  };

  // تعديل دالة handleEdit - التوجيه المباشر لصفحة BlogDashboard
  const handleEdit = (blog) => {
    // ✅ التأكد من وجود ID قبل التوجيه
    if (blog && blog.id) {
      navigate(`/blog/${blog.id}/edit`);
    } else {
      showToast('حدث خطأ: معرف المقال غير موجود', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      try {
        setIsLoading(true);
        await blogsApi.delete(id);
        showToast('تم حذف المقال بنجاح', 'success');
        onRefresh?.();
      } catch {
        showToast('حدث خطأ في حذف المقال', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showToast('يرجى إدخال عنوان المقال', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const submitData = {
        title: formData.title.trim(),
        summary: formData.summary || '',
        related_services: formData.related_services || []
      };
      
      let response;
      let blogId = null;
      
      if (editingBlog) {
        // ✅ تحديث مقال موجود
        response = await blogsApi.update(editingBlog.id, submitData);
        blogId = editingBlog.id;
        showToast('تم تحديث المقال بنجاح', 'success');
        setIsModalOpen(false);
        onRefresh?.();
      } else {
        // ✅ إنشاء مقال جديد - تأكد من استلام ID من الـ API
        response = await blogsApi.create(submitData);
        
        // ✅ التحقق من وجود ID في الـ response
        if (response && response.data && response.data.id) {
          blogId = response.data.id;
        } else if (response && response.id) {
          blogId = response.id;
        } else {
          console.error('Response does not contain blog ID:', response);
          showToast('تم إضافة المقال ولكن حدث خطأ في التوجيه', 'warning');
          setIsModalOpen(false);
          onRefresh?.();
          return;
        }
        
        showToast('تم إضافة المقال بنجاح', 'success');
        setIsModalOpen(false);
        onRefresh?.();
      }
      
      // ✅ التوجيه إلى صفحة التعديل بعد التأكد من وجود ID
      if (blogId) {
        navigate(`/blog/${blogId}/edit`);
      } else {
        console.error('No blog ID available for navigation');
        showToast('تم الحفظ بنجاح', 'success');
      }
      
    } catch (error) {
      console.error('Save error:', error);
      showToast('حدث خطأ في حفظ البيانات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <div className="bs-wrap">
      {/* Header */}
      <div className="bs-header">
        <div className="bs-header-left">
          <div className="bs-icon">
            <Icons.Categories />
          </div>
          <div>
            <h1 className="bs-title">المقالات والمدونة</h1>
            <p className="bs-subtitle">إدارة وتنظيم المقالات</p>
          </div>
        </div>
        <button className="bs-btn-primary" onClick={handleAdd} disabled={isLoading}>
          <Icons.Plus />
          <span>إضافة مقال</span>
        </button>
      </div>

      {/* Stat */}
      <div className="bs-stat-bar">
        <span className="bs-stat-value">{blogs.length}</span>
        <span className="bs-stat-label">مقال</span>
      </div>

      {/* Search */}
      <div className="bs-toolbar">
        <div className="bs-search">
          <input
            type="text"
            placeholder="البحث في المقالات..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="bs-clear" onClick={() => setSearchTerm('')}>
              <Icons.X />
            </button>
          )}
        </div>
        <span className="bs-count">{filteredBlogs.length} مقال</span>
      </div>

      {/* Grid */}
      <div className="bs-grid">
        {filteredBlogs.length === 0 ? (
          <div className="bs-empty">لا توجد مقالات مطابقة</div>
        ) : (
          filteredBlogs.map(blog => (
            <div key={blog.id} className="bs-card">
              <div className="bs-card-body">
                <div className="bs-card-icon">
                  <Icons.Services />
                </div>
                <div className="bs-card-info">
                  <div className="bs-card-top">
                    <span className="bs-card-title">{blog.title}</span>
                  </div>
                  {blog.created_at && (
                    <div className="bs-card-date">
                      <Icons.Calendar />
                      <span>{formatDate(blog.created_at)}</span>
                    </div>
                  )}
                  {blog.summary && (
                    <p className="bs-card-summary">{blog.summary}</p>
                  )}
                  {blog.related_services?.length > 0 && (
                    <div className="bs-card-services">
                      <span className="bs-services-badge">
                        {blog.related_services.length} خدمة مرتبطة
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bs-card-actions">
                <button className="bs-action-edit" onClick={() => handleEdit(blog)}>
                  <Icons.Edit />
                </button>
                <button className="bs-action-delete" onClick={() => handleDelete(blog.id)}>
                  <Icons.Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal - يظهر فقط للإضافة (لأن التعديل أصبح توجيه مباشر) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        title="إضافة مقال جديد" // تم تغيير العنوان ليكون فقط للإضافة
        size="lg"
      >
        <div className="bs-modal-body">
          <div className="bs-form-group">
            <label>
              عنوان المقال <span className="bs-required">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: أحدث تقنيات شد الوجه"
              disabled={isLoading}
            />
          </div>
          <div className="bs-form-group">
            <label>ملخص المقال</label>
            <textarea
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              rows="3"
              placeholder="ملخص مختصر للمقال..."
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="bs-modal-footer">
          <button
            className="bs-btn-secondary"
            onClick={() => setIsModalOpen(false)}
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button className="bs-btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <span className="bs-spinner" />
            ) : (
              <>
                <Icons.Check />
                <span>إضافة</span>
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BlogsSection;