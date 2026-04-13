import {
  Building2, Check, CheckCircle2, Clock, Copy, Edit2,
  ExternalLink, Globe, Mail, MapPin, MapPinned,
  MessageCircle, Phone, Plus
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { siteInfoApi } from '../../../api';
import Modal from '../../common/Modal/Modal';
import './SiteInfoSection.css';

// Custom Instagram icon component
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Custom Facebook icon component
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

// Custom YouTube icon component
const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const SiteInfoSection = ({ info: initialInfo, showToast, onRefresh }) => {
  const [siteInfo, setSiteInfo] = useState(initialInfo || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [formData, setFormData] = useState({
    site_name: '', phone: '', whatsapp: '', email: '',
    address: '', working_hours: '', instagram: '',
    facebook: '', youtube: '', tiktok: '', latitude: '', longitude: ''
  });

  const fromInfo = (info) => ({
    site_name: info?.site_name || '',
    phone: info?.phone || '',
    whatsapp: info?.whatsapp || '',
    email: info?.email || '',
    address: info?.address || '',
    working_hours: info?.working_hours || '',
    instagram: info?.instagram || '',
    facebook: info?.facebook || '',
    youtube: info?.youtube || '',
    tiktok: info?.tiktok || '',
    latitude: info?.latitude || '',
    longitude: info?.longitude || ''
  });

  useEffect(() => {
    if (initialInfo) {
      setSiteInfo(initialInfo);
      setFormData(fromInfo(initialInfo));
    } else {
      // إذا لم توجد بيانات، تأكد من أن siteInfo = null
      setSiteInfo(null);
    }
  }, [initialInfo]);

  const isValidUrl = (url) =>
    !!url &&
    !url.includes('/api/admin/');

  const handleEdit = () => {
    setFormData(fromInfo(siteInfo));
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    console.log("Create button clicked"); // للتأكد أن الزر يعمل
    setFormData({
      site_name: '', phone: '', whatsapp: '', email: '',
      address: '', working_hours: '', instagram: '',
      facebook: '', youtube: '', tiktok: '', latitude: '', longitude: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    console.log("Save button clicked, siteInfo:", siteInfo); // للتأكد
    console.log("Form data:", formData); // للتأكد من البيانات
    
    if (!formData.site_name?.trim() || !formData.phone?.trim() || !formData.email?.trim()) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      const submitData = {
        site_name: formData.site_name.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp?.trim() || '',
        email: formData.email.trim(),
        address: formData.address?.trim() || '',
        working_hours: formData.working_hours?.trim() || '',
        instagram: formData.instagram?.trim() || '',
        facebook: formData.facebook?.trim() || '',
        youtube: formData.youtube?.trim() || '',
        tiktok: formData.tiktok?.trim() || '',
        latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
        longitude: formData.longitude ? parseFloat(formData.longitude) : 0
      };
      
      let response;
      if (siteInfo?.id) {
        // تحديث
        console.log("Updating existing record with ID:", siteInfo.id);
        response = await siteInfoApi.update(siteInfo.id, submitData);
        showToast('تم تحديث معلومات الموقع بنجاح', 'success');
        setSiteInfo(response.data);
      } else {
        // إنشاء جديد
        console.log("Creating new record");
        response = await siteInfoApi.create(submitData);
        console.log("Create response:", response);
        showToast('تم إنشاء معلومات الموقع بنجاح', 'success');
        setSiteInfo(response.data);
      }
      
      setIsModalOpen(false);
      
      // تحديث البيانات في الـ Parent Component
      if (onRefresh) {
        await onRefresh();
      }
      
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail || 
                          Object.values(error.response?.data || {}).flat()[0] ||
                          'حدث خطأ في حفظ البيانات';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, field) => {
    if (!text || text === 'غير محدد') return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast('تم النسخ', 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const f = (v) => v || 'غير محدد';

  const set = (key) => (e) => setFormData(fd => ({ ...fd, [key]: e.target.value }));

  const getModalTitle = () => {
    return siteInfo?.id ? 'تعديل معلومات الموقع' : 'إنشاء معلومات الموقع';
  };

  // Show empty state if no data exists
  if (!siteInfo) {
    return (
      <div className="si-wrap">
        <div className="si-empty-state">
          <div className="si-empty-icon">
            <Building2 size={48} strokeWidth={1.5} />
          </div>
          <h3>لا توجد بيانات</h3>
          <p>لم يتم إعداد معلومات الموقع بعد</p>
          <button 
            className="si-btn-primary" 
            onClick={handleCreate}
            style={{ cursor: 'pointer' }}
          >
            <Plus size={16} />
            <span>إنشاء معلومات الموقع</span>
          </button>
        </div>
        
        {/* Modal - needs to be outside the condition or rendered conditionally */}
        <Modal isOpen={isModalOpen} onClose={() => !isLoading && setIsModalOpen(false)}
          title={getModalTitle()} size="lg">
          <div className="si-modal-body">
            <FormField label="اسم الموقع" required icon={Building2}>
              <input type="text" value={formData.site_name} onChange={set('site_name')}
                placeholder="اسم العيادة" disabled={isLoading} />
            </FormField>

            <div className="si-form-row">
              <FormField label="الهاتف" required icon={Phone}>
                <input type="tel" value={formData.phone} onChange={set('phone')}
                  placeholder="05xxxxxxxx" disabled={isLoading} />
              </FormField>
              <FormField label="WhatsApp" icon={MessageCircle}>
                <input type="text" value={formData.whatsapp} onChange={set('whatsapp')}
                  placeholder="05xxxxxxxx" disabled={isLoading} />
              </FormField>
            </div>

            <FormField label="البريد الإلكتروني" required icon={Mail}>
              <input type="email" value={formData.email} onChange={set('email')}
                placeholder="example@clinic.com" disabled={isLoading} />
            </FormField>

            <FormField label="العنوان" icon={MapPin}>
              <input type="text" value={formData.address} onChange={set('address')}
                placeholder="عنوان العيادة الكامل" disabled={isLoading} />
            </FormField>

            <FormField label="مواعيد العمل" icon={Clock}>
              <textarea value={formData.working_hours} onChange={set('working_hours')} rows="3"
                placeholder={'السبت - الخميس: 9:00 ص - 9:00 م\nالجمعة: مغلق'} disabled={isLoading} />
            </FormField>

            <div className="si-form-row">
              <FormField label="Instagram" icon={InstagramIcon}>
                <input type="url" value={formData.instagram} onChange={set('instagram')}
                  placeholder="https://instagram.com/..." disabled={isLoading} />
              </FormField>
              <FormField label="Facebook" icon={FacebookIcon}>
                <input type="url" value={formData.facebook} onChange={set('facebook')}
                  placeholder="https://facebook.com/..." disabled={isLoading} />
              </FormField>
            </div>

            <div className="si-form-row">
              <FormField label="YouTube" icon={YoutubeIcon}>
                <input type="url" value={formData.youtube} onChange={set('youtube')}
                  placeholder="https://youtube.com/..." disabled={isLoading} />
              </FormField>
              <FormField label="TikTok" icon={Globe}>
                <input type="url" value={formData.tiktok} onChange={set('tiktok')}
                  placeholder="https://tiktok.com/@..." disabled={isLoading} />
              </FormField>
            </div>

            <div className="si-form-row">
              <FormField label="خط العرض (Latitude)" icon={MapPinned}>
                <input type="number" step="any" value={formData.latitude} onChange={set('latitude')}
                  placeholder="23.000000" disabled={isLoading} />
              </FormField>
              <FormField label="خط الطول (Longitude)" icon={MapPinned}>
                <input type="number" step="any" value={formData.longitude} onChange={set('longitude')}
                  placeholder="22.999998" disabled={isLoading} />
              </FormField>
            </div>
          </div>

          <div className="si-modal-footer">
            <button className="si-btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
              إلغاء
            </button>
            <button className="si-btn-primary" onClick={handleSave} disabled={isLoading}>
              {isLoading ? <span className="si-spinner" /> : <><Check size={15} /><span>حفظ التغييرات</span></>}
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  const hasLocation = siteInfo.latitude && siteInfo.longitude;

  // Build quick social links
  const socialLinks = [
    { id: 'phone', icon: Phone, label: 'اتصال', url: siteInfo.phone ? `tel:${siteInfo.phone}` : null, cls: 'phone' },
    { id: 'whatsapp', icon: MessageCircle, label: 'واتساب', url: siteInfo.whatsapp ? `https://wa.me/${siteInfo.whatsapp.replace(/[^0-9]/g, '')}` : null, cls: 'whatsapp' },
    { id: 'email', icon: Mail, label: 'بريد', url: siteInfo.email ? `mailto:${siteInfo.email}` : null, cls: 'email' },
    { id: 'instagram', icon: InstagramIcon, label: 'انستقرام', url: isValidUrl(siteInfo.instagram) ? siteInfo.instagram : null, cls: 'insta' },
    { id: 'facebook', icon: FacebookIcon, label: 'فيسبوك', url: isValidUrl(siteInfo.facebook) ? siteInfo.facebook : null, cls: 'facebook' },
    { id: 'youtube', icon: YoutubeIcon, label: 'يوتيوب', url: isValidUrl(siteInfo.youtube) ? siteInfo.youtube : null, cls: 'youtube' },
  ].filter(l => l.url);

  return (
    <div className="si-wrap">
      {/* Header */}
      <div className="si-header">
        <div className="si-header-left">
          <div className="si-icon"><Globe size={18} /></div>
          <div>
            <h1 className="si-title">معلومات الموقع</h1>
            <p className="si-subtitle">بيانات العيادة ووسائل التواصل</p>
          </div>
        </div>
        <button className="si-btn-primary" onClick={handleEdit} disabled={isLoading}>
          <Edit2 size={15} /><span>تعديل</span>
        </button>
      </div>

      {/* Info Grid */}
      <div className="si-grid">
        <InfoRow icon={Building2} label="اسم الموقع" value={f(siteInfo.site_name)}
          onCopy={() => handleCopy(siteInfo.site_name, 'site_name')} copied={copiedField === 'site_name'} />

        <InfoRow icon={Phone} label="الهاتف" value={f(siteInfo.phone)}
          link={siteInfo.phone ? `tel:${siteInfo.phone}` : null} linkLabel="اتصال"
          onCopy={() => handleCopy(siteInfo.phone, 'phone')} copied={copiedField === 'phone'} />

        <InfoRow icon={MessageCircle} label="WhatsApp" value={f(siteInfo.whatsapp)}
          link={siteInfo.whatsapp ? `https://wa.me/${siteInfo.whatsapp.replace(/[^0-9]/g, '')}` : null} linkLabel="مراسلة"
          onCopy={() => handleCopy(siteInfo.whatsapp, 'whatsapp')} copied={copiedField === 'whatsapp'} />

        <InfoRow icon={Mail} label="البريد الإلكتروني" value={f(siteInfo.email)}
          link={siteInfo.email ? `mailto:${siteInfo.email}` : null} linkLabel="إرسال"
          onCopy={() => handleCopy(siteInfo.email, 'email')} copied={copiedField === 'email'} />

        <InfoRow icon={MapPin} label="العنوان" value={f(siteInfo.address)} fullWidth
          onCopy={() => handleCopy(siteInfo.address, 'address')} copied={copiedField === 'address'} />

        <InfoRow icon={Clock} label="مواعيد العمل" value={f(siteInfo.working_hours)} fullWidth multiline />

        {[
          { key: 'instagram', icon: InstagramIcon, label: 'Instagram' },
          { key: 'facebook', icon: FacebookIcon, label: 'Facebook' },
          { key: 'youtube', icon: YoutubeIcon, label: 'YouTube' },
        ].map(({ key, icon, label }) => {
          const val = siteInfo[key];
          const valid = isValidUrl(val);
          return (
            <InfoRow key={key} icon={icon} label={label} value={f(val)}
              isLink={valid} onCopy={valid ? () => handleCopy(val, key) : null}
              copied={copiedField === key} />
          );
        })}

        {siteInfo.tiktok && (
          <InfoRow icon={Globe} label="TikTok" value={f(siteInfo.tiktok)}
            isLink={isValidUrl(siteInfo.tiktok)}
            onCopy={isValidUrl(siteInfo.tiktok) ? () => handleCopy(siteInfo.tiktok, 'tiktok') : null}
            copied={copiedField === 'tiktok'} />
        )}

        <InfoRow icon={MapPinned} label="الموقع (خريطة)" fullWidth
          value={hasLocation ? `${siteInfo.latitude}, ${siteInfo.longitude}` : 'غير محدد'}
          onCopy={hasLocation ? () => handleCopy(`${siteInfo.latitude}, ${siteInfo.longitude}`, 'location') : null}
          copied={copiedField === 'location'}
          link={hasLocation ? `https://www.google.com/maps?q=${siteInfo.latitude},${siteInfo.longitude}` : null}
          linkLabel="فتح الخريطة" />
      </div>

      {/* Quick Actions */}
      {socialLinks.length > 0 && (
        <div className="si-quick-bar">
          <span className="si-quick-label">روابط سريعة</span>
          <div className="si-quick-links">
            {socialLinks.map(l => (
              <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                className={`si-quick-btn ${l.cls}`}>
                <l.icon size={14} /><span>{l.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Modal for edit */}
      <Modal isOpen={isModalOpen} onClose={() => !isLoading && setIsModalOpen(false)}
        title={getModalTitle()} size="lg">
        <div className="si-modal-body">
          <FormField label="اسم الموقع" required icon={Building2}>
            <input type="text" value={formData.site_name} onChange={set('site_name')}
              placeholder="اسم العيادة" disabled={isLoading} />
          </FormField>

          <div className="si-form-row">
            <FormField label="الهاتف" required icon={Phone}>
              <input type="tel" value={formData.phone} onChange={set('phone')}
                placeholder="05xxxxxxxx" disabled={isLoading} />
            </FormField>
            <FormField label="WhatsApp" icon={MessageCircle}>
              <input type="text" value={formData.whatsapp} onChange={set('whatsapp')}
                placeholder="05xxxxxxxx" disabled={isLoading} />
            </FormField>
          </div>

          <FormField label="البريد الإلكتروني" required icon={Mail}>
            <input type="email" value={formData.email} onChange={set('email')}
              placeholder="example@clinic.com" disabled={isLoading} />
          </FormField>

          <FormField label="العنوان" icon={MapPin}>
            <input type="text" value={formData.address} onChange={set('address')}
              placeholder="عنوان العيادة الكامل" disabled={isLoading} />
          </FormField>

          <FormField label="مواعيد العمل" icon={Clock}>
            <textarea value={formData.working_hours} onChange={set('working_hours')} rows="3"
              placeholder={'السبت - الخميس: 9:00 ص - 9:00 م\nالجمعة: مغلق'} disabled={isLoading} />
          </FormField>

          <div className="si-form-row">
            <FormField label="Instagram" icon={InstagramIcon}>
              <input type="url" value={formData.instagram} onChange={set('instagram')}
                placeholder="https://instagram.com/..." disabled={isLoading} />
            </FormField>
            <FormField label="Facebook" icon={FacebookIcon}>
              <input type="url" value={formData.facebook} onChange={set('facebook')}
                placeholder="https://facebook.com/..." disabled={isLoading} />
            </FormField>
          </div>

          <div className="si-form-row">
            <FormField label="YouTube" icon={YoutubeIcon}>
              <input type="url" value={formData.youtube} onChange={set('youtube')}
                placeholder="https://youtube.com/..." disabled={isLoading} />
            </FormField>
            <FormField label="TikTok" icon={Globe}>
              <input type="url" value={formData.tiktok} onChange={set('tiktok')}
                placeholder="https://tiktok.com/@..." disabled={isLoading} />
            </FormField>
          </div>

          <div className="si-form-row">
            <FormField label="خط العرض (Latitude)" icon={MapPinned}>
              <input type="number" step="any" value={formData.latitude} onChange={set('latitude')}
                placeholder="23.000000" disabled={isLoading} />
            </FormField>
            <FormField label="خط الطول (Longitude)" icon={MapPinned}>
              <input type="number" step="any" value={formData.longitude} onChange={set('longitude')}
                placeholder="22.999998" disabled={isLoading} />
            </FormField>
          </div>
        </div>

        <div className="si-modal-footer">
          <button className="si-btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
            إلغاء
          </button>
          <button className="si-btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? <span className="si-spinner" /> : <><Check size={15} /><span>حفظ التغييرات</span></>}
          </button>
        </div>
      </Modal>
    </div>
  );
};

/* ── Sub-components ───────────────────────────────────── */

const InfoRow = ({ icon: Icon, label, value, fullWidth, multiline, isLink, link, linkLabel, onCopy, copied }) => (
  <div className={`si-row${fullWidth ? ' full' : ''}`}>
    <div className="si-row-icon"><Icon size={15} /></div>
    <div className="si-row-body">
      <div className="si-row-label-wrap">
        <span className="si-row-label">{label}</span>
        <div className="si-row-actions">
          {onCopy && value !== 'غير محدد' && (
            <button className="si-copy-btn" onClick={onCopy} title="نسخ">
              {copied ? <CheckCircle2 size={13} className="si-copied" /> : <Copy size={13} />}
            </button>
          )}
          {link && value !== 'غير محدد' && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="si-link-btn">
              {linkLabel}<ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
      {isLink && value !== 'غير محدد' ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="si-ext-link">
          {value}<ExternalLink size={12} />
        </a>
      ) : multiline ? (
        <pre className="si-row-pre">{value}</pre>
      ) : (
        <span className={`si-row-value${value === 'غير محدد' ? ' muted' : ''}`}>{value}</span>
      )}
    </div>
  </div>
);

const FormField = ({ label, required, icon: Icon, children }) => (
  <div className="si-form-group">
    <label>{label}{required && <span className="si-required"> *</span>}</label>
    <div className="si-input-wrap">
      <Icon size={15} className="si-input-icon" />
      {children}
    </div>
  </div>
);

export default SiteInfoSection;