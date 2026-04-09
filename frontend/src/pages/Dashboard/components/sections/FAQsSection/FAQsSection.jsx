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

  useEffect(() => { setFaqs(initialFaqs || []); }, [initialFaqs]);

  const filteredFaqs = faqs.filter(faq =>
    faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) =>
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAdd = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (faq) => {
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
      onRefresh?.();
    } catch {
      showToast('حدث خطأ في حذف السؤال', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    try {
      setIsLoading(true);
      const submitData = { question: formData.question.trim(), answer: formData.answer.trim() };
      if (editingFaq) {
        await faqsApi.update(editingFaq.id, submitData);
        showToast('تم تحديث السؤال بنجاح', 'success');
      } else {
        await faqsApi.create(submitData);
        showToast('تم إضافة السؤال بنجاح', 'success');
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
        <button className="fq-btn-primary" onClick={handleAdd} disabled={isLoading}>
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
            type="text" placeholder="البحث في الأسئلة..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="fq-clear" onClick={() => setSearchTerm('')}><X size={13} /></button>
          )}
        </div>
      </div>

      {/* FAQ List */}
      {filteredFaqs.length === 0 ? (
        <div className="fq-empty">
          <HelpCircle size={32} />
          <p>{searchTerm ? 'لا توجد نتائج مطابقة' : 'لا توجد أسئلة بعد'}</p>
          {searchTerm
            ? <button className="fq-btn-secondary" onClick={() => setSearchTerm('')}>مسح البحث</button>
            : <button className="fq-btn-primary" onClick={handleAdd}><Plus size={14} />إضافة سؤال</button>}
        </div>
      ) : (
        <div className="fq-list">
          {filteredFaqs.map((faq, index) => {
            const open = !!expandedItems[faq.id];
            return (
              <div key={faq.id} className={`fq-item${open ? ' open' : ''}`}>
                <button className="fq-item-header" onClick={() => toggleExpand(faq.id)}>
                  <span className="fq-num">{index + 1}</span>
                  <span className="fq-question">{faq.question}</span>
                  <div className="fq-item-actions" onClick={e => e.stopPropagation()}>
                    <button className="fq-action-edit" onClick={() => handleEdit(faq)}><Edit2 size={14} /></button>
                    <button className="fq-action-delete" onClick={() => setDeletingFaq(faq)}><Trash2 size={14} /></button>
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
      <Modal isOpen={isModalOpen} onClose={() => !isLoading && setIsModalOpen(false)}
        title={editingFaq ? 'تعديل السؤال' : 'إضافة سؤال جديد'} size="md">
        <div className="fq-modal-body">
          <div className="fq-form-group">
            <label>السؤال <span className="fq-required">*</span></label>
            <div className="fq-input-wrap">
              <HelpCircle size={15} className="fq-input-icon" />
              <input type="text" value={formData.question}
                onChange={e => setFormData(f => ({ ...f, question: e.target.value }))}
                placeholder="ما هي التقنيات المستخدمة في العيادة؟" disabled={isLoading} />
            </div>
          </div>
          <div className="fq-form-group">
            <label>الإجابة <span className="fq-required">*</span></label>
            <div className="fq-input-wrap">
              <MessageCircle size={15} className="fq-input-icon fq-icon-top" />
              <textarea value={formData.answer} rows="5"
                onChange={e => setFormData(f => ({ ...f, answer: e.target.value }))}
                placeholder="الإجابة على السؤال..." disabled={isLoading} />
            </div>
          </div>
        </div>
        <div className="fq-modal-footer">
          <button className="fq-btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isLoading}>إلغاء</button>
          <button className="fq-btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? <span className="fq-spinner" /> : <><Check size={15} /><span>{editingFaq ? 'تحديث' : 'إضافة'}</span></>}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deletingFaq} onClose={() => !isLoading && setDeletingFaq(null)}
        title="تأكيد الحذف" size="sm">
        <div className="fq-delete-body">
          <p className="fq-delete-msg">هل أنت متأكد من حذف هذا السؤال؟</p>
          {deletingFaq && <p className="fq-delete-preview">"{deletingFaq.question}"</p>}
        </div>
        <div className="fq-modal-footer">
          <button className="fq-btn-secondary" onClick={() => setDeletingFaq(null)} disabled={isLoading}>إلغاء</button>
          <button className="fq-btn-danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <span className="fq-spinner fq-spinner-danger" /> : 'حذف'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FAQsSection;