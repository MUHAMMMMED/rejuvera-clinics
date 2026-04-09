import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { devicesApi } from '../../../api';
import { Icons } from '../../common/Icons/Icons';
import Modal from '../../common/Modal/Modal';
import './DevicesSection.css';

const DevicesSection = ({ devices: initialDevices, showToast, onRefresh }) => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState(initialDevices || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    summary: '', 
    technology: '',
    treatments: 0,
    is_new: false,
    related_services: [],
    image: null
  });

  useEffect(() => {
    setDevices(initialDevices || []);
  }, [initialDevices]);

  const filteredDevices = devices.filter(device =>
    device.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.technology?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingDevice(null);
    setImagePreview(null);
    setImageFile(null);
    setFormData({ 
      name: '', 
      summary: '', 
      content: '',
      technology: '',
      treatments: 0,
      is_new: false,
      related_services: [],
      image: null
    });
    setIsModalOpen(true);
  };

  const handleEdit = (device) => {
    // ✅ التأكد من وجود ID قبل التوجيه
    if (device && device.id) {
      navigate(`/device/${device.id}/edit`);
    } else {
      showToast('حدث خطأ: معرف الجهاز غير موجود', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الجهاز؟')) {
      try {
        setIsLoading(true);
        await devicesApi.delete(id);
        showToast('تم حذف الجهاز بنجاح', 'success');
        onRefresh?.();
      } catch {
        showToast('حدث خطأ في حذف الجهاز', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

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
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast('يرجى إدخال اسم الجهاز', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('summary', formData.summary);
      submitData.append('technology', formData.technology);
      submitData.append('treatments', formData.treatments);
      submitData.append('is_new', formData.is_new);
      
      if (formData.related_services && formData.related_services.length > 0) {
        formData.related_services.forEach(serviceId => {
          submitData.append('related_services', serviceId);
        });
      }
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      let response;
      let deviceId = null;
      
      if (editingDevice) {
        // ✅ تحديث جهاز موجود
        response = await devicesApi.update(editingDevice.id, submitData);
        deviceId = editingDevice.id;
        showToast('تم تحديث الجهاز بنجاح', 'success');
        setIsModalOpen(false);
        onRefresh?.();
      } else {
        // ✅ إنشاء جهاز جديد - تأكد من استلام ID من الـ API
        response = await devicesApi.create(submitData);
        
        // ✅ التحقق من وجود ID في الـ response
        if (response && response.data && response.data.id) {
          deviceId = response.data.id;
        } else if (response && response.id) {
          deviceId = response.id;
        } else {
          console.error('Response does not contain device ID:', response);
          showToast('تم إضافة الجهاز ولكن حدث خطأ في التوجيه', 'warning');
          setIsModalOpen(false);
          onRefresh?.();
          return;
        }
        
        showToast('تم إضافة الجهاز بنجاح', 'success');
        setIsModalOpen(false);
        onRefresh?.();
      }
      
      // ✅ التوجيه إلى صفحة التعديل بعد التأكد من وجود ID
      if (deviceId) {
        navigate(`/device/${deviceId}/edit`);
      } else {
        console.error('No device ID available for navigation');
        showToast('تم الحفظ بنجاح', 'success');
      }
      
    } catch (error) {
      console.error('Save error:', error);
      showToast('حدث خطأ في حفظ البيانات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // تنظيف الـ preview عند إغلاق المودال
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="ds-wrap">
      {/* Header */}
      <div className="ds-header">
        <div className="ds-header-left">
          <div className="ds-icon">
            <Icons.Dashboard />
          </div>
          <div>
            <h1 className="ds-title">الأجهزة والتقنيات</h1>
            <p className="ds-subtitle">إدارة الأجهزة والتقنيات المستخدمة</p>
          </div>
        </div>
        <button className="ds-btn-primary" onClick={handleAdd} disabled={isLoading}>
          <Icons.Plus />
          <span>إضافة جهاز</span>
        </button>
      </div>

      {/* Stats */}
      <div className="ds-stat-bar">
        <span className="ds-stat-value">{devices.length}</span>
        <span className="ds-stat-label">جهاز</span>
        <span className="ds-stat-sep">·</span>
        <span className="ds-stat-value">{devices.filter(d => d.is_new).length}</span>
        <span className="ds-stat-label">جهاز جديد</span>
        <span className="ds-stat-sep">·</span>
        <span className="ds-stat-value">{devices.reduce((sum, d) => sum + (d.treatments || 0), 0)}</span>
        <span className="ds-stat-label">علاج</span>
      </div>

      {/* Search */}
      <div className="ds-toolbar">
        <div className="ds-search">
          <input
            type="text"
            placeholder="البحث في الأجهزة..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="ds-clear" onClick={() => setSearchTerm('')}>
              <Icons.X />
            </button>
          )}
        </div>
        <span className="ds-count">{filteredDevices.length} جهاز</span>
      </div>

      {/* Grid */}
      <div className="ds-grid">
        {filteredDevices.length === 0 ? (
          <div className="ds-empty">لا توجد أجهزة مطابقة</div>
        ) : (
          filteredDevices.map(device => (
            <div key={device.id} className="ds-card">
              <div className="ds-card-body">
                {device.image && (
                  <div className="ds-card-image">
                    <img 
                      src={device.image} 
                      alt={device.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-device.png';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                )}
                <div className="ds-card-info">
                  <div className="ds-card-top">
                    <span className="ds-card-name">{device.name}</span>
                    {device.is_new && (
                      <span className="ds-card-badge-new">جديد</span>
                    )}
                  </div>
                  {device.technology && (
                    <div className="ds-card-tech">
                      <span className="ds-tech-label">التقنية:</span>
                      <span className="ds-tech-value">{device.technology}</span>
                    </div>
                  )}
                  {device.summary && (
                    <p className="ds-card-summary">{device.summary}</p>
                  )}
                  {device.treatments > 0 && (
                    <div className="ds-card-stats">
                      <Icons.TrendingUp />
                      <span>{device.treatments} علاج</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="ds-card-actions">
                <button className="ds-action-edit" onClick={() => handleEdit(device)}>
                  <Icons.Edit />
                </button>
                <button className="ds-action-delete" onClick={() => handleDelete(device.id)}>
                  <Icons.Trash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal - للإضافة فقط */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        title="إضافة جهاز جديد"
        size="lg"
      >
        <div className="ds-modal-body">
          {/* قسم رفع الصورة */}
          <div className="ds-form-group">
            <label>صورة الجهاز</label>
            <div className="ds-image-upload">
              {imagePreview ? (
                <div className="ds-image-preview">
                  <img src={imagePreview} alt="معاينة الجهاز" />
                  <button 
                    type="button" 
                    className="ds-remove-image"
                    onClick={removeImage}
                    disabled={isLoading}
                  >
                    <Icons.X />
                  </button>
                </div>
              ) : (
                <div 
                  className="ds-image-placeholder"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icons.Gallery />
                  <span>انقر لاختيار صورة</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                disabled={isLoading}
              />
              {!imagePreview && (
                <button
                  type="button"
                  className="ds-btn-upload"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Icons.Plus />
                  <span>رفع صورة</span>
                </button>
              )}
            </div>
          </div>

          <div className="ds-form-group">
            <label>
              اسم الجهاز <span className="ds-required">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: جهاز المورفيوس 8"
              disabled={isLoading}
            />
          </div>

          <div className="ds-form-group">
            <label>التقنية المستخدمة</label>
            <input
              type="text"
              value={formData.technology}
              onChange={e => setFormData({ ...formData, technology: e.target.value })}
              placeholder="مثال: الراديو فريكونسي"
              disabled={isLoading}
            />
          </div>

          <div className="ds-form-group">
            <label>ملخص الجهاز</label>
            <textarea
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              rows="3"
              placeholder="وصف مختصر للجهاز..."
              disabled={isLoading}
            />
          </div>

          <div className="ds-form-row">
            <div className="ds-form-group ds-form-group-half">
              <label>عدد العلاجات</label>
              <input
                type="number"
                value={formData.treatments}
                onChange={e => setFormData({ ...formData, treatments: parseInt(e.target.value) || 0 })}
                disabled={isLoading}
              />
            </div>
            <div className="ds-form-group ds-form-group-half">
              <label className="ds-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={e => setFormData({ ...formData, is_new: e.target.checked })}
                  disabled={isLoading}
                />
                <span>جهاز جديد</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="ds-modal-footer">
          <button
            className="ds-btn-secondary"
            onClick={() => setIsModalOpen(false)}
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button className="ds-btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <span className="ds-spinner" />
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

export default DevicesSection;