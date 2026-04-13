import {
  Check, ChevronDown, ChevronUp,
  Edit2, HelpCircle, MessageCircle,
  Plus, Search, Trash2, X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
 
import { faqsApi } from '../../../api';
import Modal from '../../common/Modal/Modal';
import './FAQsSection.css';

const FAQsSection = ({ faqs: initialFaqs, showToast, onRefresh }) => {
  const [faqs, setFaqs] = useState(initialFaqs || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deletingFaq, setDeletingFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [formData, setFormData] = useState({ question: '', answer: '' });

  useEffect(() => { 
    setFaqs(initialFaqs || []); 
  }, [initialFaqs]);

  const filteredFaqs = faqs.filter(faq =>
    faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) =>
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAdd = () => {
    console.log("Add button clicked - opening modal");
    setEditingFaq(null);
    setFormData({ question: '', answer: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (faq) => {
    console.log("Edit button clicked - opening modal");
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingFaq) return;
    try {
      setIsLoading(true);
      await faqsApi.delete(deletingFaq.id);
      showToast('تم حذف السؤال بنجاح', 'success');
      setDeletingFaq(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      showToast('حدث خطأ في حذف السؤال', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    console.log("Save button clicked");
    if (!formData.question.trim() || !formData.answer.trim()) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    try {
      setIsLoading(true);
      const submitData = { 
        question: formData.question.trim(), 
        answer: formData.answer.trim() 
      };
      
      if (editingFaq) {
        await faqsApi.update(editingFaq.id, submitData);
        showToast('تم تحديث السؤال بنجاح', 'success');
      } else {
        await faqsApi.create(submitData);
        showToast('تم إضافة السؤال بنجاح', 'success');
      }
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Save error:", error);
      showToast(error.response?.data?.message || 'حدث خطأ في حفظ البيانات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    if (!isLoading) {
      console.log("Closing modal");
      setIsModalOpen(false);
    }
  };

  const closeDeleteModal = () => {
    if (!isLoading) {
      setDeletingFaq(null);
    }
  };

  // عرض حالة عدم وجود بيانات مع زر إنشاء
  if (faqs.length === 0 && !searchTerm) {
    return (
      <div className="fq-wrap">
        <div className="fq-header">
          <div className="fq-header-left">
            <div className="fq-icon"><HelpCircle size={18} /></div>
            <div>
              <h1 className="fq-title">الأسئلة الشائعة</h1>
              <p className="fq-subtitle">إدارة الأسئلة والأجوبة للعملاء</p>
            </div>
          </div>
        </div>

        {/* Empty State with Create Button */}
        <div className="fq-empty-state">
          <div className="fq-empty-icon">
            <HelpCircle size={48} strokeWidth={1.5} />
          </div>
          <h3>لا توجد أسئلة بعد</h3>
          <p>أضف الأسئلة الشائعة لمساعدة عملائك في الحصول على إجابات سريعة</p>
          <button 
            className="fq-btn-primary" 
            onClick={handleAdd}
            type="button"
          >
            <Plus size={16} />
            <span>إضافة سؤال جديد</span>
          </button>
        </div>

        {/* Add Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          title="إضافة سؤال جديد" 
          size="md"
          showFooter={false}
        >
          <div className="fq-modal-body">
            <div className="fq-form-group">
              <label>السؤال <span className="fq-required">*</span></label>
              <div className="fq-input-wrap">
                <HelpCircle size={15} className="fq-input-icon" />
                <input 
                  type="text" 
                  value={formData.question}
                  onChange={e => setFormData(f => ({ ...f, question: e.target.value }))}
                  placeholder="مثال: ما هي ساعات العمل؟" 
                  disabled={isLoading} 
                  autoFocus
                />
              </div>
            </div>
            <div className="fq-form-group">
              <label>الإجابة <span className="fq-required">*</span></label>
              <div className="fq-input-wrap">
                <MessageCircle size={15} className="fq-input-icon fq-icon-top" />
                <textarea 
                  value={formData.answer} 
                  rows="5"
                  onChange={e => setFormData(f => ({ ...f, answer: e.target.value }))}
                  placeholder="أكتب الإجابة هنا..." 
                  disabled={isLoading} 
                />
              </div>
            </div>
          </div>
          <div className="fq-modal-footer">
            <button 
              className="fq-btn-secondary" 
              onClick={closeModal} 
              disabled={isLoading}
              type="button"
            >
              إلغاء
            </button>
            <button 
              className="fq-btn-primary" 
              onClick={handleSave} 
              disabled={isLoading}
              type="button"
            >
              {isLoading ? <span className="fq-spinner" /> : <><Check size={15} /><span>إضافة</span></>}
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="fq-wrap">
      {/* Header */}
      <div className="fq-header">
        <div className="fq-header-left">
          <div className="fq-icon"><HelpCircle size={18} /></div>
          <div>
            <h1 className="fq-title">الأسئلة الشائعة</h1>
            <p className="fq-subtitle">إدارة الأسئلة والأجوبة للعملاء</p>
          </div>
        </div>
        <button 
          className="fq-btn-primary" 
          onClick={handleAdd} 
          disabled={isLoading}
          type="button"
        >
          <Plus size={16} /><span>إضافة سؤال</span>
        </button>
      </div>

      {/* Stat */}
      <div className="fq-stat-bar">
        <span className="fq-stat-value">{faqs.length}</span>
        <span className="fq-stat-label">سؤال إجمالاً</span>
        {searchTerm && (
          <>
            <span className="fq-stat-sep">·</span>
            <span className="fq-stat-value">{filteredFaqs.length}</span>
            <span className="fq-stat-label">نتيجة</span>
          </>
        )}
      </div>

      {/* Search */}
      <div className="fq-toolbar">
        <div className="fq-search">
          <Search size={15} className="fq-search-icon" />
          <input
            type="text" 
            placeholder="البحث في الأسئلة..."
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="fq-clear" onClick={() => setSearchTerm('')} type="button">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* FAQ List */}
      {filteredFaqs.length === 0 ? (
        <div className="fq-empty">
          <HelpCircle size={32} />
          <p>{searchTerm ? 'لا توجد نتائج مطابقة' : 'لا توجد أسئلة بعد'}</p>
          {searchTerm
            ? <button className="fq-btn-secondary" onClick={() => setSearchTerm('')} type="button">
                مسح البحث
              </button>
            : <button className="fq-btn-primary" onClick={handleAdd} type="button">
                <Plus size={14} />إضافة سؤال
              </button>}
        </div>
      ) : (
        <div className="fq-list">
          {filteredFaqs.map((faq, index) => {
            const open = !!expandedItems[faq.id];
            return (
              <div key={faq.id} className={`fq-item${open ? ' open' : ''}`}>
                <button 
                  className="fq-item-header" 
                  onClick={() => toggleExpand(faq.id)}
                  type="button"
                >
                  <span className="fq-num">{index + 1}</span>
                  <span className="fq-question">{faq.question}</span>
                  <div className="fq-item-actions" onClick={e => e.stopPropagation()}>
                    <button 
                      className="fq-action-edit" 
                      onClick={() => handleEdit(faq)} 
                      type="button"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="fq-action-delete" 
                      onClick={() => setDeletingFaq(faq)} 
                      type="button"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <span className="fq-chevron">
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>
                {open && (
                  <div className="fq-answer">
                    <MessageCircle size={13} className="fq-answer-icon" />
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingFaq ? 'تعديل السؤال' : 'إضافة سؤال جديد'} 
        size="md"
        showFooter={false}
      >
        <div className="fq-modal-body">
          <div className="fq-form-group">
            <label>السؤال <span className="fq-required">*</span></label>
            <div className="fq-input-wrap">
              <HelpCircle size={15} className="fq-input-icon" />
              <input 
                type="text" 
                value={formData.question}
                onChange={e => setFormData(f => ({ ...f, question: e.target.value }))}
                placeholder="ما هي التقنيات المستخدمة في العيادة?" 
                disabled={isLoading} 
                autoFocus
              />
            </div>
          </div>
          <div className="fq-form-group">
            <label>الإجابة <span className="fq-required">*</span></label>
            <div className="fq-input-wrap">
              <MessageCircle size={15} className="fq-input-icon fq-icon-top" />
              <textarea 
                value={formData.answer} 
                rows="5"
                onChange={e => setFormData(f => ({ ...f, answer: e.target.value }))}
                placeholder="الإجابة على السؤال..." 
                disabled={isLoading} 
              />
            </div>
          </div>
        </div>
        <div className="fq-modal-footer">
          <button 
            className="fq-btn-secondary" 
            onClick={closeModal} 
            disabled={isLoading}
            type="button"
          >
            إلغاء
          </button>
          <button 
            className="fq-btn-primary" 
            onClick={handleSave} 
            disabled={isLoading}
            type="button"
          >
            {isLoading ? <span className="fq-spinner" /> : <><Check size={15} /><span>{editingFaq ? 'تحديث' : 'إضافة'}</span></>}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal 
        isOpen={!!deletingFaq} 
        onClose={closeDeleteModal}
        title="تأكيد الحذف" 
        size="sm"
        showFooter={false}
      >
        <div className="fq-delete-body">
          <p className="fq-delete-msg">هل أنت متأكد من حذف هذا السؤال؟</p>
          {deletingFaq && <p className="fq-delete-preview">"{deletingFaq.question}"</p>}
        </div>
        <div className="fq-modal-footer">
          <button 
            className="fq-btn-secondary" 
            onClick={closeDeleteModal} 
            disabled={isLoading}
            type="button"
          >
            إلغاء
          </button>
          <button 
            className="fq-btn-danger" 
            onClick={handleDelete} 
            disabled={isLoading}
            type="button"
          >
            {isLoading ? <span className="fq-spinner fq-spinner-danger" /> : 'حذف'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FAQsSection;