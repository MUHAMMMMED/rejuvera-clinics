import { AlertCircle, Check, Grid3x3, Image, Plus, Search, Trash2, Upload, X, ZoomIn } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryApi } from '../../../api';
import Modal from '../../common/Modal/Modal';
import './GallerySection.css';

const GallerySection = ({ gallery: initialGallery, showToast, onRefresh }) => {
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(initialGallery || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [deletingImage, setDeletingImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    image: null, 
    alt_text: '',
    imagePreview: ''
  });

  useEffect(() => {
    setGallery(initialGallery || []);
  }, [initialGallery]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/media')) {
      return `http://127.0.0.1:8000${imagePath}`;
    }
    return imagePath;
  };

  const filteredGallery = gallery.filter(img => {
    const matchesSearch = img.alt_text?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('يرجى اختيار ملف صورة صالح', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setEditingImage(null);
    setFormData({ 
      image: null, 
      alt_text: '',
      imagePreview: ''
    });
    setIsModalOpen(true);
  };

  // const handleEdit = (image) => {
  //   // التوجيه إلى صفحة التعديل الخاصة بالصورة (إذا كانت موجودة)
  //   if (image && image.id) {
  //     navigate(`/gallery/${image.id}/edit`);
  //   } else {
  //     showToast('حدث خطأ: معرف الصورة غير موجود', 'error');
  //   }
  // };

  const handleDeleteClick = (img) => {
    setDeletingImage(img);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingImage) return;
    
    try {
      setIsLoading(true);
      await galleryApi.delete(deletingImage.id);
      showToast('تم حذف الصورة بنجاح', 'success');
      setIsDeleteModalOpen(false);
      setDeletingImage(null);
      onRefresh?.();
    } catch (error) {
      showToast('حدث خطأ في حذف الصورة', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingImage && !formData.image) {
      showToast('يرجى اختيار صورة', 'error');
      return;
    }

    try {
      setIsLoading(true);
      
      const submitData = new FormData();
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      if (formData.alt_text) {
        submitData.append('alt_text', formData.alt_text);
      }

      let response;
      let imageId = null;

      if (editingImage) {
        response = await galleryApi.update(editingImage.id, submitData);
        imageId = editingImage.id;
        showToast('تم تحديث الصورة بنجاح', 'success');
        setIsModalOpen(false);
        onRefresh?.();
      } else {
        response = await galleryApi.create(submitData);
        
        // التحقق من وجود ID في الـ response
        if (response && response.data && response.data.id) {
          imageId = response.data.id;
        } else if (response && response.id) {
          imageId = response.id;
        } else {
          console.error('Response does not contain image ID:', response);
          showToast('تم إضافة الصورة ولكن حدث خطأ في التوجيه', 'warning');
          setIsModalOpen(false);
          onRefresh?.();
          return;
        }
        
        showToast('تم إضافة الصورة بنجاح', 'success');
        setIsModalOpen(false);
        onRefresh?.();
      }
      
      // التوجيه إلى صفحة التعديل بعد التأكد من وجود ID
      // if (imageId && editingImage) {
      //   navigate(`/gallery/${imageId}/edit`);
      // }
      
    } catch (error) {
      console.error('Error saving image:', error);
      showToast('حدث خطأ في حفظ البيانات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewImage = (img) => {
    setSelectedImage(img);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="gallery-wrap">
      {/* Header */}
      <div className="gallery-header">
        <div className="gallery-header-left">
          <div className="gallery-icon">
            <Image size={18} />
          </div>
          <div>
            <h1 className="gallery-title">معرض الصور</h1>
            <p className="gallery-subtitle">إدارة صور المعرض وعرضها</p>
          </div>
        </div>
        <button className="gallery-btn-primary" onClick={handleAdd} disabled={isLoading}>
          <Plus size={16} />
          <span>إضافة صورة</span>
        </button>
      </div>

      {/* Stat Bar */}
      <div className="gallery-stat-bar">
        <span className="gallery-stat-value">{gallery.length}</span>
        <span className="gallery-stat-label">صورة إجمالاً</span>
        <span className="gallery-stat-sep">·</span>
        <span className="gallery-stat-value">{filteredGallery.length}</span>
        <span className="gallery-stat-label">ظاهرة الآن</span>
      </div>

      {/* Toolbar مع بحث و View Toggle */}
      <div className="gallery-toolbar">
        <div className="gallery-search">
          <Search size={15} className="gallery-search-icon" />
          <input
            type="text"
            placeholder="البحث في الصور..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="gallery-clear" onClick={() => setSearchTerm('')}>
              <X size={13} />
            </button>
          )}
        </div>
        
        {/* View Toggle Buttons */}
        <div className="gallery-view-toggle">
          <button 
            className={`gallery-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="عرض شبكي"
          >
            <Grid3x3 size={15} />
          </button>
          <button 
            className={`gallery-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="عرض قائمة"
          >
            <Image size={15} />
          </button>
        </div>
      </div>

      {/* Gallery Grid/List */}
      {filteredGallery.length === 0 ? (
        <div className="gallery-empty">
          {searchTerm ? 'لا توجد صور مطابقة للبحث' : 'لا توجد صور في المعرض'}
        </div>
      ) : (
        <div className={`gallery-grid ${viewMode === 'list' ? 'gallery-list-view' : ''}`}>
          {filteredGallery.map((img) => (
            <div key={img.id} className="gallery-card">
              <div className="gallery-card-body">
                <div className="gallery-card-icon">
                  <Image size={16} />
                </div>
                <div className="gallery-card-info">
                  <div className="gallery-card-top">
                    <span className="gallery-card-name">{img.alt_text || 'صورة بدون وصف'}</span>
                  </div>
                  {viewMode === 'list' && (
                    <p className="gallery-card-desc">تم الرفع: {new Date(img.created_at).toLocaleDateString('ar-EG')}</p>
                  )}
                </div>
              </div>
              
              {/* Preview Image Thumbnail */}
              <div className="gallery-card-preview">
                <img 
                  src={getImageUrl(img.image)} 
                  alt={img.alt_text || 'صورة المعرض'}
                  onClick={() => handleViewImage(img)}
                />
              </div>
              
              <div className="gallery-card-actions">
                <button className="gallery-action-view" onClick={() => handleViewImage(img)}>
                  <ZoomIn size={14} />
                </button>
                {/* <button className="gallery-action-edit" onClick={() => handleEdit(img)}>
                  <Check size={14} />
                </button> */}
                <button className="gallery-action-delete" onClick={() => handleDeleteClick(img)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <button className="gallery-lightbox-close" onClick={closeLightbox}>×</button>
          <img 
            src={getImageUrl(selectedImage.image)} 
            alt={selectedImage.alt_text || 'صورة المعرض'}
            onClick={(e) => e.stopPropagation()}
          />
          {selectedImage.alt_text && (
            <div className="gallery-lightbox-caption">{selectedImage.alt_text}</div>
          )}
        </div>
      )}

      {/* Add/Edit Image Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        title={editingImage ? 'تعديل الصورة' : 'إضافة صورة جديدة'}
        size="md"
      >
        <div className="gallery-modal-body">
          <div className="gallery-form-group">
            <label>
              الصورة {!editingImage && <span className="gallery-required">*</span>}
            </label>
            <div className="gallery-image-upload">
              {formData.imagePreview ? (
                <div className="gallery-image-preview">
                  <img src={formData.imagePreview} alt="Preview" />
                  <button 
                    className="gallery-remove-image"
                    onClick={() => setFormData({ ...formData, image: null, imagePreview: '' })}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : editingImage?.image ? (
                <div className="gallery-image-preview">
                  <img src={getImageUrl(editingImage.image)} alt="Current" />
                  <button 
                    className="gallery-remove-image"
                    onClick={() => setFormData({ ...formData, imagePreview: '', image: null })}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="gallery-upload-label">
                  <Upload size={20} />
                  <span>اختر صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            <small className="gallery-form-hint">الصيغ المدعومة: JPG, PNG, GIF. الحد الأقصى: 5MB</small>
          </div>

          <div className="gallery-form-group">
            <label>الوصف</label>
            <textarea
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              rows="3"
              placeholder="وصف اختياري للصورة..."
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="gallery-modal-footer">
          <button
            className="gallery-btn-secondary"
            onClick={() => setIsModalOpen(false)}
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button className="gallery-btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <span className="gallery-spinner" />
            ) : (
              <>
                <Check size={15} />
                <span>{editingImage ? 'تحديث' : 'إضافة'}</span>
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isLoading && setIsDeleteModalOpen(false)}
        title="تأكيد الحذف"
        size="sm"
      >
        <div className="gallery-modal-body" style={{ textAlign: 'center' }}>
          <AlertCircle size={48} style={{ color: '#e53e3e', marginBottom: '16px' }} />
          <p>هل أنت متأكد من حذف هذه الصورة؟</p>
          <p style={{ fontSize: '12px', color: '#718096' }}>لا يمكن التراجع عن هذا الإجراء</p>
          {deletingImage && (
            <div className="gallery-delete-preview">
              <img src={getImageUrl(deletingImage.image)} alt={deletingImage.alt_text} />
              <span>{deletingImage.alt_text || 'صورة'}</span>
            </div>
          )}
        </div>
        <div className="gallery-modal-footer">
          <button
            className="gallery-btn-secondary"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button className="gallery-btn-danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <span className="gallery-spinner" /> : 'حذف'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GallerySection;