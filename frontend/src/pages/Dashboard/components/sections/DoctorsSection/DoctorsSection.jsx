import {
  Award, Check, Edit2, Instagram,
  Plus, Search, Trash2, UserPlus, X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Config from '../../../../../components/Authentication/config';
import { doctorsApi } from '../../../api';
import Modal from '../../common/Modal/Modal';
import './DoctorsSection.css';

const DoctorsSection = ({ doctors: initialDoctors, showToast, onRefresh }) => {
  const [doctors, setDoctors] = useState(initialDoctors || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '', title: '', experience: '', instagram: '', image: null, imagePreview: ''
  });

  const specialties = ['all', ...new Set(doctors.map(d => d.title).filter(Boolean))];

  useEffect(() => {
    setDoctors(initialDoctors || []);
  }, [initialDoctors]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = !searchTerm ||
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.title === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${Config.apiUrl}${imagePath}`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(f => ({ ...f, image: file, imagePreview: reader.result }));
        if (formErrors.image) {
          setFormErrors(prev => ({ ...prev, image: null }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setEditingDoctor(null);
    setFormData({ name: '', title: '', experience: '', instagram: '', image: null, imagePreview: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '', title: doctor.title || '',
      experience: doctor.experience || '', instagram: doctor.instagram || '',
      image: null, imagePreview: getImageUrl(doctor.image)
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطبيب؟')) {
      try {
        setIsLoading(true);
        await doctorsApi.delete(id);
        showToast('تم حذف الطبيب بنجاح', 'success');
        if (onRefresh) onRefresh();
        else {
          const updatedDoctors = await doctorsApi.getAll();
          setDoctors(updatedDoctors);
        }
      } catch (error) {
        console.error('Delete error:', error);
        showToast('حدث خطأ في حذف الطبيب', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'اسم الطبيب مطلوب';
    }
    
    if (!formData.title.trim()) {
      errors.title = 'التخصص مطلوب';
    }
    
    if (!editingDoctor && !formData.image) {
      errors.image = 'الصورة مطلوبة';
    }
    
    if (editingDoctor && !formData.image && !formData.imagePreview) {
      if (!formData.imagePreview) {
        errors.image = 'الصورة مطلوبة';
      }
    }
    
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('title', formData.title.trim());
      submitData.append('experience', formData.experience || '');
      submitData.append('instagram', formData.instagram || '');
      
      if (formData.image && formData.image instanceof File) {
        submitData.append('image', formData.image);
      }

      if (editingDoctor) {
        await doctorsApi.update(editingDoctor.id, submitData);
        showToast('تم تحديث بيانات الطبيب بنجاح', 'success');
      } else {
        await doctorsApi.create(submitData);
        showToast('تم إضافة الطبيب بنجاح', 'success');
      }
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
      else {
        const updatedDoctors = await doctorsApi.getAll();
        setDoctors(updatedDoctors);
      }
    } catch (error) {
      console.error('Save error:', error);
      showToast('حدث خطأ في حفظ البيانات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ds-doctors-section-wrap">
      {/* Header */}
      <div className="ds-doctors-section-header">
        <div className="ds-doctors-section-header-left">
          <div className="ds-doctors-section-icon"><UserPlus size={18} /></div>
          <div>
            <h1 className="ds-doctors-section-title">فريق الأطباء</h1>
            <p className="ds-doctors-section-subtitle">إدارة بيانات الأطباء والمختصين</p>
          </div>
        </div>
        <button className="ds-doctors-section-btn-primary" onClick={handleAdd} disabled={isLoading}>
          <Plus size={16} /><span>إضافة طبيب</span>
        </button>
      </div>

      {/* Stat */}
      <div className="ds-doctors-section-stat-bar">
        <span className="ds-doctors-section-stat-value">{doctors.length}</span>
        <span className="ds-doctors-section-stat-label">طبيب</span>
        <span className="ds-doctors-section-stat-sep">·</span>
        <span className="ds-doctors-section-stat-value">{filteredDoctors.length}</span>
        <span className="ds-doctors-section-stat-label">ظاهر الآن</span>
      </div>

      {/* Toolbar */}
      <div className="ds-doctors-section-toolbar">
        <div className="ds-doctors-section-search">
          <Search size={15} className="ds-doctors-section-search-icon" />
          <input
            type="text" placeholder="البحث في الأطباء..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="ds-doctors-section-clear" onClick={() => setSearchTerm('')}><X size={13} /></button>
          )}
        </div>
      </div>

      {/* Specialty Tabs */}
      <div className="ds-doctors-section-tabs-scroll">
        <div className="ds-doctors-section-tabs">
          {specialties.map(spec => (
            <button
              key={spec}
              className={`ds-doctors-section-tab${selectedSpecialty === spec ? ' active' : ''}`}
              onClick={() => setSelectedSpecialty(spec)}
            >
              {spec === 'all' ? 'الكل' : spec}
              {spec !== 'all' && (
                <span className="ds-doctors-section-tab-count">
                  {doctors.filter(d => d.title === spec).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="ds-doctors-section-grid">
        {filteredDoctors.length === 0 ? (
          <div className="ds-doctors-section-empty">
            <p>لا يوجد أطباء مطابقون</p>
            <button className="ds-doctors-section-btn-secondary" onClick={() => { setSearchTerm(''); setSelectedSpecialty('all'); }}>
              مسح الفلاتر
            </button>
          </div>
        ) : (
          filteredDoctors.map(doctor => (
            <div key={doctor.id} className="ds-doctors-section-card">
              {/* Avatar */}
              <div className="ds-doctors-section-avatar-wrap">
                {doctor.image ? (
                  <img
                    src={getImageUrl(doctor.image)} alt={doctor.name}
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div className="ds-doctors-section-avatar-fallback" style={{ display: doctor.image ? 'none' : 'flex' }}>
                  {getInitials(doctor.name)}
                </div>
              </div>

              {/* Info */}
              <div className="ds-doctors-section-card-info">
                <div className="ds-doctors-section-card-top">
                  <span className="ds-doctors-section-card-name">{doctor.name}</span>
                </div>
                <span className="ds-doctors-section-card-title">{doctor.title}</span>
                {doctor.experience && (
                  <span className="ds-doctors-section-card-exp">
                    <Award size={12} />{doctor.experience} سنة خبرة
                  </span>
                )}

                {/* Instagram only */}
                {doctor.instagram && (
                  <div className="ds-doctors-section-contact">
                    <a
                      href={`https://instagram.com/${doctor.instagram.replace('@', '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="ds-doctors-section-contact-btn ds-doctors-section-contact-insta" title={doctor.instagram}
                    >
                      <Instagram size={13} />
                    </a>
                  </div>
                )}
              </div>

              {/* Actions - Horizontal Layout */}
              <div className="ds-doctors-section-card-actions">
                <button className="ds-doctors-section-action-edit" onClick={() => handleEdit(doctor)}>
                  <Edit2 size={14} />
                </button>
                <button className="ds-doctors-section-action-delete" onClick={() => handleDelete(doctor.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        title={editingDoctor ? 'تعديل بيانات الطبيب' : 'إضافة طبيب جديد'}
        size="lg"
      >
        <div className="ds-doctors-section-modal-body">
          {/* Image Upload */}
          <div className="ds-doctors-section-form-group ds-doctors-section-image-group">
            <div className="ds-doctors-section-image-preview">
              {formData.imagePreview
                ? <img src={formData.imagePreview} alt="preview" />
                : <div className="ds-doctors-section-image-placeholder"><UserPlus size={24} /></div>}
            </div>
            <input type="file" id="ds-doctors-section-img" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            <label htmlFor="ds-doctors-section-img" className={`ds-doctors-section-upload-btn ${formErrors.image ? 'error' : ''}`}>
              اختر صورة {!editingDoctor && <span className="ds-doctors-section-required">*</span>}
            </label>
            {formErrors.image && <span className="ds-doctors-section-error-text">{formErrors.image}</span>}
          </div>

          <div className="ds-doctors-section-form-row">
            <div className="ds-doctors-section-form-group">
              <label>اسم الطبيب <span className="ds-doctors-section-required">*</span></label>
              <div className={`ds-doctors-section-input-wrap ${formErrors.name ? 'has-error' : ''}`}>
                <UserPlus size={15} className="ds-doctors-section-input-icon" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => {
                    setFormData(f => ({ ...f, name: e.target.value }));
                    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: null }));
                  }}
                  placeholder="د. أحمد محمد" 
                  disabled={isLoading} 
                />
              </div>
              {formErrors.name && <span className="ds-doctors-section-error-text">{formErrors.name}</span>}
            </div>
            <div className="ds-doctors-section-form-group">
              <label>التخصص / اللقب <span className="ds-doctors-section-required">*</span></label>
              <div className={`ds-doctors-section-input-wrap ${formErrors.title ? 'has-error' : ''}`}>
                <Award size={15} className="ds-doctors-section-input-icon" />
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => {
                    setFormData(f => ({ ...f, title: e.target.value }));
                    if (formErrors.title) setFormErrors(prev => ({ ...prev, title: null }));
                  }}
                  placeholder="استشاري جراحة التجميل" 
                  disabled={isLoading} 
                />
              </div>
              {formErrors.title && <span className="ds-doctors-section-error-text">{formErrors.title}</span>}
            </div>
          </div>

          <div className="ds-doctors-section-form-group">
            <label>سنوات الخبرة</label>
            <div className="ds-doctors-section-input-wrap">
              <Award size={15} className="ds-doctors-section-input-icon" />
              <input type="text" value={formData.experience}
                onChange={e => setFormData(f => ({ ...f, experience: e.target.value }))}
                placeholder="10 سنوات" disabled={isLoading} />
            </div>
          </div>

          <div className="ds-doctors-section-form-group">
            <label>Instagram</label>
            <div className="ds-doctors-section-input-wrap">
              <Instagram size={15} className="ds-doctors-section-input-icon" />
              <input type="text" value={formData.instagram}
                onChange={e => setFormData(f => ({ ...f, instagram: e.target.value }))}
                placeholder="@username" disabled={isLoading} />
            </div>
          </div>
        </div>

        <div className="ds-doctors-section-modal-footer">
          <button className="ds-doctors-section-btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isLoading}>إلغاء</button>
          <button className="ds-doctors-section-btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? <span className="ds-doctors-section-spinner" /> : <><Check size={15} /><span>{editingDoctor ? 'حفظ' : 'إضافة'}</span></>}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorsSection;