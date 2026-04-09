import { Check, Edit2, LayoutGrid, Package, Plus, Search, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { categoriesApi } from '../../../api';
import Modal from '../../common/Modal/Modal';
import './CategoriesSection.css';

const CategoriesSection = ({ categories: initialCategories, showToast, onRefresh }) => {
  const [categories, setCategories] = useState(initialCategories || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCategories(initialCategories || []);
  }, [initialCategories]);

  const totalServices = categories.reduce((sum, cat) => sum + (cat.services?.length || 0), 0);

  const filteredCategories = categories.filter(
    cat =>
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      try {
        setIsLoading(true);
        await categoriesApi.delete(id);
        showToast('تم حذف التصنيف بنجاح', 'success');
        onRefresh?.();
      } catch {
        showToast('حدث خطأ في حذف التصنيف', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast('يرجى إدخال اسم التصنيف', 'error');
      return;
    }
    try {
      setIsLoading(true);
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, formData);
        showToast('تم تحديث التصنيف بنجاح', 'success');
      } else {
        await categoriesApi.create(formData);
        showToast('تم إضافة التصنيف بنجاح', 'success');
      }
      setIsModalOpen(false);
      onRefresh?.();
    } catch {
      showToast('حدث خطأ في حفظ البيانات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cs-wrap">
      {/* Header */}
      <div className="cs-header">
        <div className="cs-header-left">
          <div className="cs-icon">
            <LayoutGrid size={18} />
          </div>
          <div>
            <h1 className="cs-title">تصنيفات الخدمات</h1>
            <p className="cs-subtitle">إدارة وتنظيم التصنيفات</p>
          </div>
        </div>
        <button className="cs-btn-primary" onClick={handleAdd} disabled={isLoading}>
          <Plus size={16} />
          <span>إضافة تصنيف</span>
        </button>
      </div>

      {/* Stat */}
      <div className="cs-stat-bar">
        <span className="cs-stat-value">{categories.length}</span>
        <span className="cs-stat-label">تصنيف</span>
        <span className="cs-stat-sep">·</span>
        <span className="cs-stat-value">{totalServices}</span>
        <span className="cs-stat-label">خدمة إجمالاً</span>
      </div>

      {/* Search */}
      <div className="cs-toolbar">
        <div className="cs-search">
          <Search size={15} className="cs-search-icon" />
          <input
            type="text"
            placeholder="البحث في التصنيفات..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="cs-clear" onClick={() => setSearchTerm('')}>
              <X size={13} />
            </button>
          )}
        </div>
        <span className="cs-count">{filteredCategories.length} تصنيف</span>
      </div>

      {/* Grid */}
      <div className="cs-grid">
        {filteredCategories.length === 0 ? (
          <div className="cs-empty">لا توجد تصنيفات مطابقة</div>
        ) : (
          filteredCategories.map(cat => (
            <div key={cat.id} className="cs-card">
              <div className="cs-card-body">
                <div className="cs-card-icon">
                  <LayoutGrid size={16} />
                </div>
                <div className="cs-card-info">
                  <div className="cs-card-top">
                    <span className="cs-card-name">{cat.name}</span>
                    <span className="cs-card-badge">
                      <Package size={11} />
                      {cat.services?.length || 0} خدمة
                    </span>
                  </div>
                  {cat.description && (
                    <p className="cs-card-desc">{cat.description}</p>
                  )}
                </div>
              </div>
              <div className="cs-card-actions">
                <button className="cs-action-edit" onClick={() => handleEdit(cat)}>
                  <Edit2 size={14} />
                </button>
                <button className="cs-action-delete" onClick={() => handleDelete(cat.id)}>
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
        title={editingCategory ? 'تعديل تصنيف' : 'إضافة تصنيف جديد'}
        size="md"
      >
        <div className="cs-modal-body">
          <div className="cs-form-group">
            <label>
              اسم التصنيف <span className="cs-required">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: جراحة التجميل"
              disabled={isLoading}
            />
          </div>
          <div className="cs-form-group">
            <label>الوصف</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              placeholder="وصف مختصر للتصنيف..."
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="cs-modal-footer">
          <button
            className="cs-btn-secondary"
            onClick={() => setIsModalOpen(false)}
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button className="cs-btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <span className="cs-spinner" />
            ) : (
              <>
                <Check size={15} />
                <span>{editingCategory ? 'حفظ' : 'إضافة'}</span>
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesSection;