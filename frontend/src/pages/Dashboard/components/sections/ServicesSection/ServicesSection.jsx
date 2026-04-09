 
import { Briefcase, Check, Edit2, Globe, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesApi } from '../../../api';
import Modal from '../../common/Modal/Modal';
import './ServicesSection.css';

const ServicesSection = ({ categories: initialCategories, showToast, onRefresh }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(initialCategories || []);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (initialCategories) {
      setCategories(initialCategories);
      const allServices = [];
      initialCategories.forEach(cat => {
        if (cat.services && cat.services.length > 0) {
          cat.services.forEach(service => {
            allServices.push({
              ...service,
              category_name: cat.name,
              category_id: cat.id,
            });
          });
        }
      });
      setServices(allServices);
    }
  }, [initialCategories]);

  const categoryList = ['all', ...categories.map(c => c.name)];

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category_name === selectedCategory;
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = () => {
    setEditingService(null);
    setFormData({ name: '', category: categories[0]?.name || '', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category_name,
      description: service.description || '',
    });
    setIsModalOpen(true);
  };

  const handleEditLandingPage = (serviceId) => {
    if (serviceId && serviceId !== 'undefined') {
      navigate(`/service/${serviceId}/edit/`);
    } else {
      showToast('معرّف الخدمة غير صالح', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      try {
        setIsLoading(true);
        await servicesApi.delete(id);
        showToast('تم حذف الخدمة بنجاح', 'success');
        onRefresh?.();
      } catch {
        showToast('حدث خطأ في حذف الخدمة', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.category) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      const selectedCat = categories.find(c => c.name === formData.category);
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: selectedCat?.id,
        slug: formData.name.trim().replace(/ /g, '-').toLowerCase(),
      };
      
      let response;
      
      if (editingService) {
        // تحديث خدمة موجودة
        response = await servicesApi.update(editingService.id, submitData);
        showToast('تم تحديث الخدمة بنجاح', 'success');
        setIsModalOpen(false);
        onRefresh?.();
        
        // سؤال المستخدم إذا كان يريد التعديل على landing page
        if (window.confirm('هل تريد الانتقال إلى صفحة تحرير الهبوط لهذه الخدمة؟')) {
          navigate(`/service/${editingService.id}/edit/`);
        }
      } else {
        // إضافة خدمة جديدة
        response = await servicesApi.create(submitData);
        showToast('تم إضافة الخدمة بنجاح', 'success');
        setIsModalOpen(false);
        onRefresh?.();
        
        // استخراج ID الخدمة من الاستجابة
        let serviceId = null;
        
        // محاولة استخراج ID من response بعدة طرق
        if (response && typeof response === 'object') {
          // طباعة response للمساعدة في التصحيح (يمكن إزالتها بعد التأكد من العمل)
          console.log('Response from API:', response);
          
          // الحالة 1: response.id مباشرة
          if (response.id) {
            serviceId = response.id;
          }
          // الحالة 2: response.data.id
          else if (response.data && response.data.id) {
            serviceId = response.data.id;
          }
          // الحالة 3: response.service && response.service.id
          else if (response.service && response.service.id) {
            serviceId = response.service.id;
          }
          // الحالة 4: response.pk (Django sometimes uses pk)
          else if (response.pk) {
            serviceId = response.pk;
          }
        }
        
        if (serviceId && serviceId !== 'undefined') {
          // الانتقال إلى صفحة تحرير landing page
          navigate(`/service/${serviceId}/edit/`);
        } else {
          console.error('Could not extract service ID from response:', response);
          showToast('تم إضافة الخدمة ولكن حدث خطأ في التوجيه، يرجى تحديث الصفحة', 'warning');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ في حفظ البيانات';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ss-wrap">
      {/* Header */}
      <div className="ss-header">
        <div className="ss-header-left">
          <div className="ss-icon">
            <Briefcase size={18} />
          </div>
          <div>
            <h1 className="ss-title">الخدمات الطبية</h1>
            <p className="ss-subtitle">إدارة خدمات العيادة</p>
          </div>
        </div>
        <button className="ss-btn-primary" onClick={handleAdd} disabled={isLoading}>
          <Plus size={16} />
          <span>إضافة خدمة</span>
        </button>
      </div>

      {/* Stat */}
      <div className="ss-stat-bar">
        <span className="ss-stat-value">{services.length}</span>
        <span className="ss-stat-label">خدمة إجمالاً</span>
        <span className="ss-stat-sep">·</span>
        <span className="ss-stat-value">{filteredServices.length}</span>
        <span className="ss-stat-label">ظاهرة الآن</span>
      </div>

      {/* Toolbar */}
      <div className="ss-toolbar">
        <div className="ss-search">
          <Search size={15} className="ss-search-icon" />
          <input
            type="text"
            placeholder="البحث..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="ss-clear" onClick={() => setSearchTerm('')}>
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="ss-tabs-scroll">
        <div className="ss-tabs">
          {categoryList.map(cat => (
            <button
              key={cat}
              className={`ss-tab${selectedCategory === cat ? ' active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'الكل' : cat}
              {cat !== 'all' && (
                <span className="ss-tab-count">
                  {services.filter(s => s.category_name === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="ss-grid">
        {filteredServices.length === 0 ? (
          <div className="ss-empty">لا توجد خدمات مطابقة</div>
        ) : (
          filteredServices.map(service => (
            <div key={service.id} className="ss-card">
              <div className="ss-card-body">
                <div className="ss-card-icon">
                  <Briefcase size={16} />
                </div>
                <div className="ss-card-info">
                  <div className="ss-card-top">
                    <span className="ss-card-name">{service.name}</span>
                    <span className="ss-card-cat">{service.category_name}</span>
                  </div>
                  {service.description && (
                    <p className="ss-card-desc">{service.description}</p>
                  )}
                </div>
              </div>
              <div className="ss-card-actions">
                <button 
                  className="ss-action-landing" 
                  onClick={() => handleEditLandingPage(service.id)}
                  title="تعديل صفحة الهبوط"
                >
                  <Globe size={14} />
                </button>
                <button className="ss-action-edit" onClick={() => handleEdit(service)}>
                  <Edit2 size={14} />
                </button>
                <button className="ss-action-delete" onClick={() => handleDelete(service.id)}>
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
        title={editingService ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}
        size="md"
      >
        <div className="ss-modal-body">
          <div className="ss-form-group">
            <label>
              اسم الخدمة <span className="ss-required">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: شد الوجه"
              disabled={isLoading}
            />
          </div>
          <div className="ss-form-group">
            <label>
              التصنيف <span className="ss-required">*</span>
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              disabled={isLoading}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="ss-form-group">
            <label>الوصف</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              placeholder="وصف اختياري للخدمة..."
              disabled={isLoading}
            />
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
                <Check size={15} />
                <span>{editingService ? 'حفظ' : 'إضافة'}</span>
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ServicesSection;