import { Check, ChevronDown, ChevronUp, Copy, Download, Edit2, Link, Plus, Tag, Trash2, TrendingUp, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { trackingApi } from '../../../api';
import Modal from '../../common/Modal/Modal';
import './TrackingDashboard.css';

const TrackingDashboard = ({ sources: initialSources = [], showToast, onRefresh }) => {
  const [sources, setSources] = useState(initialSources);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSources, setExpandedSources] = useState({});
  const [copiedLink, setCopiedLink] = useState(null);

  // Modals state
  const [sourceModal, setSourceModal] = useState(false);
  const [campaignModal, setCampaignModal] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  
  // Editing targets
  const [editingSource, setEditingSource] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  // Forms
  const [sourceForm, setSourceForm] = useState({ name: '' });
  const [campaignForm, setCampaignForm] = useState({ name: '' });
  const [linkForm, setLinkForm] = useState({ base_url: '' });

  // Update local state when props change
  useEffect(() => {
    setSources(initialSources);
  }, [initialSources]);

  // Toggle source expansion
  const toggleSource = (sourceId) => {
    setExpandedSources(prev => ({ ...prev, [sourceId]: !prev[sourceId] }));
  };

  // Generate UTM URL
  const generateUtmUrl = (baseUrl, sourceName, campaignName) => {
    if (!baseUrl || !sourceName || !campaignName) return '';
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}utm_source=${encodeURIComponent(sourceName)}&utm_campaign=${encodeURIComponent(campaignName)}`;
  };

  // Copy to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    showToast('تم نسخ الرابط', 'success');
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Source CRUD
  const openSourceModal = (source = null) => {
    setEditingSource(source);
    setSourceForm({ name: source?.name || '' });
    setSourceModal(true);
  };

  const saveSource = async () => {
    if (!sourceForm.name.trim()) {
      showToast('يرجى إدخال اسم المصدر', 'error');
      return;
    }
    
    try {
      setLoading(true);
      if (editingSource) {
        await trackingApi.updateSource(editingSource.id, sourceForm);
        showToast('تم تحديث المصدر بنجاح', 'success');
      } else {
        await trackingApi.createSource(sourceForm);
        showToast('تم إضافة المصدر بنجاح', 'success');
      }
      setSourceModal(false);
      // Refresh the parent component to get updated data
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error saving source:', error);
      showToast(error.response?.data?.name?.[0] || error.response?.data?.error || 'حدث خطأ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteSource = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف المصدر "${name}" وجميع حملاته؟`)) return;
    
    try {
      setLoading(true);
      await trackingApi.deleteSource(id);
      showToast('تم حذف المصدر بنجاح', 'success');
      // Refresh the parent component to get updated data
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error deleting source:', error);
      showToast(error.response?.data?.error || 'حدث خطأ في الحذف', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Campaign CRUD
  const openCampaignModal = (source = null, campaign = null) => {
    setSelectedSource(source);
    setEditingCampaign(campaign);
    setCampaignForm({ name: campaign?.name || '' });
    setCampaignModal(true);
  };

  const saveCampaign = async () => {
    if (!campaignForm.name.trim()) {
      showToast('يرجى إدخال اسم الحملة', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      if (editingCampaign) {
        // Update existing campaign
        await trackingApi.updateCampaign(editingCampaign.id, campaignForm);
        showToast('تم تحديث الحملة بنجاح', 'success');
      } else if (selectedSource) {
        // Create new campaign with resource_id directly
        const campaignData = {
          name: campaignForm.name,
          resource_id: selectedSource.id  // Send the source ID with the campaign
        };
        
        await trackingApi.createCampaign(campaignData);
        showToast(`تم إضافة الحملة "${campaignForm.name}" إلى المصدر "${selectedSource.name}" بنجاح`, 'success');
      } else {
        // Create campaign without source (will be available to add to sources later)
        await trackingApi.createCampaign(campaignForm);
        showToast('تم إضافة الحملة بنجاح', 'success');
      }
      
      setCampaignModal(false);
      // Reset form
      setCampaignForm({ name: '' });
      // Refresh the parent component to get updated data
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      showToast(error.response?.data?.name?.[0] || error.response?.data?.error || 'حدث خطأ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (campaignId, campaignName, sourceId = null) => {
    if (!window.confirm(`هل أنت متأكد من ${sourceId ? 'إزالة' : 'حذف'} الحملة "${campaignName}"؟`)) return;
    
    try {
      setLoading(true);
      
      if (sourceId) {
        // Remove from source only
        await trackingApi.removeCampaignFromSource(sourceId, campaignId);
        showToast('تم إزالة الحملة من المصدر', 'success');
      } else {
        // Delete campaign completely
        await trackingApi.deleteCampaign(campaignId);
        showToast('تم حذف الحملة بنجاح', 'success');
      }
      
      // Refresh the parent component to get updated data
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      showToast(error.response?.data?.error || 'حدث خطأ', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Link Modal
  const openLinkModal = (source, campaign = null) => {
    setSelectedSource(source);
    setSelectedCampaign(campaign);
    setLinkForm({ base_url: '' });
    setLinkModal(true);
  };

  const generatedUrl = linkForm.base_url && selectedSource && selectedCampaign
    ? generateUtmUrl(linkForm.base_url, selectedSource.name, selectedCampaign.name)
    : '';

  // Export to Excel
  const exportToExcel = () => {
    const exportData = sources.flatMap(source => 
      (source.campaign || source.campaigns || []).map(campaign => ({
        'المصدر': source.name,
        'الحملة': campaign.name,
        'عدد الحملات': source.campaign?.length || source.campaigns?.length || 0
      }))
    );
    
    if (exportData.length === 0) {
      showToast('لا توجد بيانات للتصدير', 'warning');
      return;
    }
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المصادر والحملات');
    XLSX.writeFile(wb, `تقرير_الحملات_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('تم التصدير بنجاح', 'success');
  };

  // Filter sources (handle both 'campaign' and 'campaigns' field names)
  const filteredSources = sources.filter(source => {
    const campaigns = source.campaign || source.campaigns || [];
    return source.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaigns.some(camp => camp.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="ss-wrap">
      {/* Header */}
      <div className="ss-header">
        <div className="ss-header-left">
          <div className="ss-icon">
            <TrendingUp size={18} />
          </div>
          <div>
            <h1 className="ss-title">إدارة الحملات التسويقية</h1>
            <p className="ss-subtitle">إدارة المصادر والحملات وإنشاء روابط UTM للتتبع</p>
          </div>
        </div>
        <div className="ss-header-buttons">
          <button className="ss-btn-secondary" onClick={exportToExcel}>
            <Download size={15} />
            <span>تصدير</span>
          </button>
    
          <button className="ss-btn-primary" onClick={() => openSourceModal()}>
            <Plus size={15} />
            <span>مصدر جديد</span>
          </button>
        </div>
      </div>

      {/* Stat Bar */}
      <div className="ss-stat-bar">
        <span className="ss-stat-value">{sources.length}</span>
        <span className="ss-stat-label">مصدر</span>
        <span className="ss-stat-sep">·</span>
        <span className="ss-stat-value">
          {sources.reduce((acc, s) => {
            const campaigns = s.campaign || s.campaigns || [];
            return acc + campaigns.length;
          }, 0)}
        </span>
        <span className="ss-stat-label">حملة</span>
      </div>

      {/* Search Toolbar */}
      <div className="ss-toolbar">
        <div className="ss-search">
          <input
            type="text"
            placeholder="البحث في المصادر أو الحملات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="ss-clear" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Sources List */}
      {filteredSources.length === 0 ? (
        <div className="ss-empty">
          <Users size={48} />
          <p>لا توجد مصادر أو حملات</p>
          <button className="ss-btn-primary" onClick={() => openSourceModal()}>
            <Plus size={15} /> إضافة مصدر جديد
          </button>
        </div>
      ) : (
        <div className="td-sources-list">
          {filteredSources.map((source) => {
            const campaigns = source.campaign || source.campaigns || [];
            return (
              <div key={source.id} className="td-source-card">
                {/* Source Header */}
                <div className="td-source-header">
                  <button className="td-source-toggle" onClick={() => toggleSource(source.id)}>
                    <div className="td-source-left">
                      <div className="ss-card-icon">
                        <Users size={16} />
                      </div>
                      <div>
                        <span className="td-source-name">{source.name}</span>
                        <span className="td-source-meta">
                          {campaigns.length} حملة
                        </span>
                      </div>
                    </div>
                    {expandedSources[source.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <div className="td-source-actions">
                    <button 
                      className="ss-action-edit" 
                      onClick={() => openLinkModal(source)}
                      title="إنشاء رابط"
                    >
                      <Link size={14} />
                    </button>
                    <button 
                      className="ss-action-edit" 
                      onClick={() => openSourceModal(source)}
                      title="تعديل المصدر"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="ss-action-delete" 
                      onClick={() => deleteSource(source.id, source.name)}
                      title="حذف المصدر"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Campaigns List */}
                {expandedSources[source.id] && (
                  <div className="td-campaigns-list">
                    {campaigns.length > 0 ? (
                      campaigns.map((campaign) => (
                        <div key={campaign.id} className="td-campaign-row">
                          <div className="td-campaign-left">
                            <div className="td-camp-dot" />
                            <Tag size={13} className="td-camp-icon" />
                            <span className="td-camp-name">{campaign.name}</span>
                          </div>
                          <div className="td-camp-actions">
                            <button
                              className="ss-action-edit td-camp-btn"
                              onClick={() => openLinkModal(source, campaign)}
                              title="إنشاء رابط لهذه الحملة"
                            >
                              <Link size={13} />
                            </button>
                            <button
                              className="ss-action-edit td-camp-btn"
                              onClick={() => openCampaignModal(source, campaign)}
                              title="تعديل"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="ss-action-delete td-camp-btn"
                              onClick={() => deleteCampaign(campaign.id, campaign.name, source.id)}
                              title="إزالة من المصدر"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="td-no-campaigns">لا توجد حملات — أضف حملة لهذا المصدر</p>
                    )}
                    <button
                      className="td-add-campaign-btn"
                      onClick={() => openCampaignModal(source)}
                    >
                      <Plus size={13} /> إضافة حملة
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Source Modal */}
      <Modal
        isOpen={sourceModal}
        onClose={() => !loading && setSourceModal(false)}
        title={editingSource ? 'تعديل مصدر' : 'إضافة مصدر جديد'}
        size="md"
      >
        <div className="ss-modal-body">
          <div className="ss-form-group">
            <label>اسم المصدر <span className="ss-required">*</span></label>
            <input
              type="text"
              value={sourceForm.name}
              onChange={(e) => setSourceForm({ name: e.target.value })}
              placeholder="مثال: Facebook, Google, Instagram"
              disabled={loading}
            />
            <small className="ss-form-hint">يُستخدم في روابط utm_source</small>
          </div>
        </div>
        <div className="ss-modal-footer">
          <button className="ss-btn-secondary" onClick={() => setSourceModal(false)} disabled={loading}>
            إلغاء
          </button>
          <button className="ss-btn-primary" onClick={saveSource} disabled={loading}>
            {loading ? <span className="ss-spinner" /> : <><Check size={14} /> حفظ</>}
          </button>
        </div>
      </Modal>

      {/* Campaign Modal */}
      <Modal
        isOpen={campaignModal}
        onClose={() => !loading && setCampaignModal(false)}
        title={editingCampaign ? 'تعديل حملة' : (selectedSource ? `إضافة حملة لـ ${selectedSource.name}` : 'إضافة حملة جديدة')}
        size="md"
      >
        <div className="ss-modal-body">
          <div className="ss-form-group">
            <label>اسم الحملة <span className="ss-required">*</span></label>
            <input
              type="text"
              value={campaignForm.name}
              onChange={(e) => setCampaignForm({ name: e.target.value })}
              placeholder="مثال: summer_sale, black_friday"
              disabled={loading}
            />
            <small className="ss-form-hint">
              {selectedSource 
                ? `سيتم ربط هذه الحملة تلقائياً بالمصدر "${selectedSource.name}"` 
                : 'يُستخدم في روابط utm_campaign'}
            </small>
          </div>
          
          {/* Show selected source info when adding campaign to a specific source */}
          {selectedSource && !editingCampaign && (
            <div className="td-selected-info" style={{ marginTop: '12px' }}>
              <div className="td-info-badge">
                <Users size={14} />
                <span>سيتم الربط مع المصدر: <strong>{selectedSource.name}</strong></span>
              </div>
            </div>
          )}
        </div>
        <div className="ss-modal-footer">
          <button className="ss-btn-secondary" onClick={() => setCampaignModal(false)} disabled={loading}>
            إلغاء
          </button>
          <button className="ss-btn-primary" onClick={saveCampaign} disabled={loading}>
            {loading ? <span className="ss-spinner" /> : <><Check size={14} /> حفظ</>}
          </button>
        </div>
      </Modal>

      {/* Link Generator Modal */}
      <Modal
        isOpen={linkModal}
        onClose={() => !loading && setLinkModal(false)}
        title="إنشاء رابط متتبع"
        size="lg"
      >
        <div className="ss-modal-body">
          {/* Selected Source Info */}
          {selectedSource && (
            <div className="td-selected-info">
              <div className="td-info-badge">
                <Users size={14} />
                <span>المصدر: <strong>{selectedSource.name}</strong></span>
              </div>
              {selectedCampaign && (
                <div className="td-info-badge">
                  <Tag size={14} />
                  <span>الحملة: <strong>{selectedCampaign.name}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Campaign Selection (if not already selected) */}
          {!selectedCampaign && selectedSource && (
            <div className="ss-form-group">
              <label>اختر الحملة <span className="ss-required">*</span></label>
              <select
                value={selectedCampaign?.id || ''}
                onChange={(e) => {
                  const campaigns = selectedSource.campaign || selectedSource.campaigns || [];
                  const campaign = campaigns.find(c => c.id === parseInt(e.target.value));
                  setSelectedCampaign(campaign);
                }}
                disabled={loading}
              >
                <option value="">اختر الحملة</option>
                {(selectedSource.campaign || selectedSource.campaigns || []).map(camp => (
                  <option key={camp.id} value={camp.id}>{camp.name}</option>
                ))}
              </select>
                {(!selectedSource.campaign || selectedSource.campaign.length === 0) && 
                 (!selectedSource.campaigns || selectedSource.campaigns.length === 0) && (
                  <small className="ss-form-hint" style={{ color: '#c9a227' }}>
                    لا توجد حملات — أضف حملة أولاً من زر "إضافة حملة"
                  </small>
                )}
            </div>
          )}

          {/* Base URL Input */}
          {selectedCampaign && (
            <>
              <div className="ss-form-group">
                <label>الرابط الأساسي <span className="ss-required">*</span></label>
                <input
                  type="url"
                  value={linkForm.base_url}
                  onChange={(e) => setLinkForm({ base_url: e.target.value })}
                  placeholder="https://example.com/your-page"
                  disabled={loading}
                />
                <small className="ss-form-hint">أدخل رابط الصفحة التي تريد تتبعها</small>
              </div>

              {/* Generated URL */}
              {generatedUrl && (
                <div className="td-generated-url">
                  <label>الرابط المُنشأ (للنسخ)</label>
                  <div className="td-url-wrapper">
                    <input
                      type="text"
                      value={generatedUrl}
                      readOnly
                      className="td-url-input"
                    />
                    <button
                      className="td-copy-btn"
                      onClick={() => copyToClipboard(generatedUrl, 'link-modal')}
                    >
                      {copiedLink === 'link-modal' ? <Check size={16} /> : <Copy size={16} />}
                      <span>{copiedLink === 'link-modal' ? 'تم النسخ' : 'نسخ'}</span>
                    </button>
                  </div>
                  <div className="td-url-example">
                    <small>
                      <strong>مثال للرابط:</strong> {generatedUrl.substring(0, 80)}...
                    </small>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="ss-modal-footer">
          <button className="ss-btn-secondary" onClick={() => setLinkModal(false)}>
            إغلاق
          </button>
          {generatedUrl && (
            <button 
              className="ss-btn-primary" 
              onClick={() => copyToClipboard(generatedUrl, 'link-modal')}
            >
              <Copy size={14} /> نسخ الرابط
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TrackingDashboard;