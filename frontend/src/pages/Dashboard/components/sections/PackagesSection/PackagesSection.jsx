import React, { useEffect, useState } from 'react';
import { Icons } from '../../common/Icons/Icons';
import Modal from '../../common/Modal/Modal';
 
import { packagesApi } from '../../../api';
import './PackagesSection.css';

const PackagesSection = ({ showToast, packages: initialPackages, onRefresh }) => {
  const [packages, setPackages] = useState(initialPackages || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    popular: false,
    features: [{ feature: '' }] // تغيير من id: null إلى feature فقط
  });

  // تحديث الحالة المحلية عند تغيير الـ props
  useEffect(() => {
    setPackages(initialPackages || []);
  }, [initialPackages]);

  const handleAdd = () => {
    setEditingPackage(null);
    setFormData({ 
      name: '', 
      price: '', 
      popular: false, 
      features: [{ feature: '' }] 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      price: pkg.price,
      popular: pkg.popular || false,
      features: pkg.features && pkg.features.length > 0 
        ? pkg.features.map(f => ({ feature: typeof f === 'object' ? f.feature : f }))
        : [{ feature: '' }]
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) {
      try {
        setIsLoading(true);
        await packagesApi.delete(id);
        showToast('تم حذف الباقة بنجاح', 'success');
        
        // تحديث القائمة المحلية
        setPackages(prevPackages => prevPackages.filter(p => p.id !== id));
        
        // استدعاء onRefresh إذا كان موجوداً
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        console.error('Delete error:', error);
        showToast(error.response?.data?.message || 'حدث خطأ في حذف الباقة', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    // التحقق من الحقول المطلوبة
    if (!formData.name.trim()) {
      showToast('يرجى إدخال اسم الباقة', 'error');
      return;
    }
    
    if (!formData.price.trim()) {
      showToast('يرجى إدخال سعر الباقة', 'error');
      return;
    }

    // تصفية الميزات الفارغة
    const filteredFeatures = formData.features
      .filter(f => f.feature && f.feature.trim())
      .map(f => ({ feature: f.feature.trim() }));
    
    if (filteredFeatures.length === 0) {
      showToast('يرجى إضافة ميزة واحدة على الأقل', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // تحضير البيانات للإرسال
      const submitData = {
        name: formData.name.trim(),
        price: formData.price.trim(),
        popular: formData.popular,
        features: filteredFeatures
      };

      let response;
      
      if (editingPackage) {
        // تحديث باقة موجودة
        response = await packagesApi.update(editingPackage.id, submitData);
        showToast('تم تحديث الباقة بنجاح', 'success');
        
        // تحديث القائمة المحلية
        setPackages(prevPackages => 
          prevPackages.map(p => p.id === editingPackage.id ? response.data : p)
        );
      } else {
        // إنشاء باقة جديدة
        response = await packagesApi.create(submitData);
        showToast('تم إضافة الباقة بنجاح', 'success');
        
        // إضافة الباقة الجديدة إلى القائمة المحلية
        setPackages(prevPackages => [...prevPackages, response.data]);
      }

      // إغلاق المودال
      setIsModalOpen(false);
      
      // استدعاء onRefresh إذا كان موجوداً لتحديث البيانات من الخادم
      if (onRefresh) {
        await onRefresh();
      }
      
    } catch (error) {
      console.error('Save error:', error);
      
      // عرض رسالة خطأ مفصلة
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'حدث خطأ في حفظ البيانات';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addFeature = () => {
    setFormData({ 
      ...formData, 
      features: [...formData.features, { feature: '' }] 
    });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index].feature = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index) => {
    if (formData.features.length === 1) {
      // إذا كان هناك ميزة واحدة فقط، نقوم بتفريغها بدلاً من حذفها
      setFormData({ 
        ...formData, 
        features: [{ feature: '' }] 
      });
    } else {
      setFormData({ 
        ...formData, 
        features: formData.features.filter((_, i) => i !== index) 
      });
    }
  };

  const totalPackages = packages.length;
  const popularPackages = packages.filter(p => p.popular).length;

  return (
    <div className="ss-wrap">
      {/* Header */}
      <div className="ss-header">
        <div className="ss-header-left">
          <div className="ss-icon">
            <Icons.Packages />
          </div>
          <div>
            <h1 className="ss-title">الباقات</h1>
            <p className="ss-subtitle">إدارة باقات الخدمات والعروض</p>
          </div>
        </div>
        <button className="ss-btn-primary" onClick={handleAdd} disabled={isLoading}>
          <Icons.Plus size={16} />
          <span>إضافة باقة</span>
        </button>
      </div>

      {/* Stat Bar */}
      <div className="ss-stat-bar">
        <span className="ss-stat-value">{totalPackages}</span>
        <span className="ss-stat-label">باقة إجمالاً</span>
        <span className="ss-stat-sep">·</span>
        <span className="ss-stat-value">{popularPackages}</span>
        <span className="ss-stat-label">باقة مميزة</span>
      </div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <div className="ss-empty">
          <Icons.Packages size={48} />
          <h3>لا توجد باقات</h3>
          <p>قم بإضافة باقة جديدة للبدء</p>
          <button className="ss-btn-primary" onClick={handleAdd}>
            <Icons.Plus size={16} />
            إضافة باقة
          </button>
        </div>
      ) : (
        <div className="ss-packages-grid">
          {packages.map((pkg, index) => (
            <div 
              key={pkg.id} 
              className={`ss-package-card ${pkg.popular ? 'popular' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {pkg.popular && (
                <div className="ss-popular-badge">
                  <span className="ss-star-icon">⭐</span>
                  <span>الأكثر شيوعاً</span>
                </div>
              )}
              
              <div className="ss-package-header">
                <div className="ss-package-icon">
                  <Icons.Packages size={20} />
                </div>
                <h3 className="ss-package-name">{pkg.name}</h3>
              </div>
              
              <div className="ss-package-price">
                {pkg.price}
              </div>
              
              <ul className="ss-package-features">
                {(pkg.features || []).map((featureObj, i) => (
                  <li key={i}>
                    <Icons.Check size={14} />
                    <span>{typeof featureObj === 'object' ? featureObj.feature : featureObj}</span>
                  </li>
                ))}
              </ul>
              
              <div className="ss-package-actions">
                <button className="ss-action-edit" onClick={() => handleEdit(pkg)}>
                  <Icons.Edit size={14} />
                </button>
                <button className="ss-action-delete" onClick={() => handleDelete(pkg.id)}>
                  <Icons.Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        title={editingPackage ? 'تعديل باقة' : 'إضافة باقة جديدة'}
        size="md"
      >
        <div className="ss-modal-body">
          <div className="ss-form-group">
            <label>
              اسم الباقة <span className="ss-required">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: الباقة الذهبية"
              disabled={isLoading}
            />
          </div>

          <div className="ss-form-row">
            <div className="ss-form-group">
              <label>
                السعر <span className="ss-required">*</span>
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="مثال: 7,500 ريال"
                disabled={isLoading}
              />
            </div>
            <div className="ss-form-group">
              <label className="ss-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  disabled={isLoading}
                />
                <span>باقة مميزة (تظهر بشكل مختلف)</span>
              </label>
            </div>
          </div>

          <div className="ss-form-group">
            <label>
              المميزات <span className="ss-required">*</span>
              <small className="ss-form-hint">ميزة واحدة على الأقل</small>
            </label>
            {formData.features.map((featureObj, index) => (
              <div key={index} className="ss-feature-row">
                <input
                  type="text"
                  value={featureObj.feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="مثال: جلسة ليزر مجانية"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="ss-remove-feature"
                  onClick={() => removeFeature(index)}
                  disabled={isLoading}
                >
                  <Icons.X size={14} />
                </button>
              </div>
            ))}
            <button 
              type="button" 
              className="ss-add-feature" 
              onClick={addFeature}
              disabled={isLoading}
            >
              <Icons.Plus size={14} />
              <span>إضافة ميزة</span>
            </button>
          </div>
        </div>

        <div className="ss-modal-footer">
          <button
            className="ss-btn-secondary"
            onClick={() => setIsModalOpen(false)}
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button className="ss-btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <span className="ss-spinner" />
            ) : (
              <>
                <Icons.Check size={15} />
                <span>{editingPackage ? 'تحديث' : 'إضافة'}</span>
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PackagesSection;