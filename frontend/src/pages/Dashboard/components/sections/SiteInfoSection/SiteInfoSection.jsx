import {
  Building2, Check, CheckCircle2, Clock, Copy, Edit2,
  ExternalLink, Facebook, Globe, Instagram, Mail,
  MapPin, MapPinned, MessageCircle, Phone, Youtube
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

 
import { siteInfoApi } from '../../../api';
import Modal from '../../common/Modal/Modal';
import './SiteInfoSection.css';

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
    }
  }, [initialInfo]);

  const isValidUrl = (url) =>
    !!url && !url.includes('/api/admin/') && url !== 'http://127.0.0.1:8000/api/admin/home/siteinfo/add/';

  const handleEdit = () => {
    setFormData(fromInfo(siteInfo));
    setIsModalOpen(true);
  };

  const handleSave = async () => {
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
        latitude: formData.latitude || '0',
        longitude: formData.longitude || '0'
      };
      if (siteInfo?.id) {
        await siteInfoApi.update(siteInfo.id, submitData);
        showToast('تم تحديث معلومات الموقع بنجاح', 'success');
      }
      setIsModalOpen(false);
      onRefresh?.();
    } catch {
      showToast('حدث خطأ في حفظ البيانات', 'error');
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

  if (!siteInfo) {
    return (
      <div className="si-wrap">
        <div className="si-loading">
          <span className="si-spinner-lg" />
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const hasLocation = siteInfo.latitude && siteInfo.longitude;

  // Build quick social links
  const socialLinks = [
    { id: 'phone', icon: Phone, label: 'اتصال', url: siteInfo.phone ? `tel:${siteInfo.phone}` : null, cls: 'phone' },
    { id: 'whatsapp', icon: MessageCircle, label: 'واتساب', url: siteInfo.whatsapp ? `https://wa.me/${siteInfo.whatsapp.replace(/[^0-9]/g, '')}` : null, cls: 'whatsapp' },
    { id: 'email', icon: Mail, label: 'بريد', url: siteInfo.email ? `mailto:${siteInfo.email}` : null, cls: 'email' },
    { id: 'instagram', icon: Instagram, label: 'انستقرام', url: isValidUrl(siteInfo.instagram) ? siteInfo.instagram : null, cls: 'insta' },
    { id: 'facebook', icon: Facebook, label: 'فيسبوك', url: isValidUrl(siteInfo.facebook) ? siteInfo.facebook : null, cls: 'facebook' },
    { id: 'youtube', icon: Youtube, label: 'يوتيوب', url: isValidUrl(siteInfo.youtube) ? siteInfo.youtube : null, cls: 'youtube' },
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
        {/* Site name */}
        <InfoRow icon={Building2} label="اسم الموقع" value={f(siteInfo.site_name)}
          onCopy={() => handleCopy(siteInfo.site_name, 'site_name')} copied={copiedField === 'site_name'} />

        {/* Phone */}
        <InfoRow icon={Phone} label="الهاتف" value={f(siteInfo.phone)}
          link={siteInfo.phone ? `tel:${siteInfo.phone}` : null} linkLabel="اتصال"
          onCopy={() => handleCopy(siteInfo.phone, 'phone')} copied={copiedField === 'phone'} />

        {/* WhatsApp */}
        <InfoRow icon={MessageCircle} label="WhatsApp" value={f(siteInfo.whatsapp)}
          link={siteInfo.whatsapp ? `https://wa.me/${siteInfo.whatsapp.replace(/[^0-9]/g, '')}` : null} linkLabel="مراسلة"
          onCopy={() => handleCopy(siteInfo.whatsapp, 'whatsapp')} copied={copiedField === 'whatsapp'} />

        {/* Email */}
        <InfoRow icon={Mail} label="البريد الإلكتروني" value={f(siteInfo.email)}
          link={siteInfo.email ? `mailto:${siteInfo.email}` : null} linkLabel="إرسال"
          onCopy={() => handleCopy(siteInfo.email, 'email')} copied={copiedField === 'email'} />

        {/* Address — full width */}
        <InfoRow icon={MapPin} label="العنوان" value={f(siteInfo.address)} fullWidth
          onCopy={() => handleCopy(siteInfo.address, 'address')} copied={copiedField === 'address'} />

        {/* Working hours — full width */}
        <InfoRow icon={Clock} label="مواعيد العمل" value={f(siteInfo.working_hours)} fullWidth multiline />

        {/* Social */}
        {[
          { key: 'instagram', icon: Instagram, label: 'Instagram' },
          { key: 'facebook', icon: Facebook, label: 'Facebook' },
          { key: 'youtube', icon: Youtube, label: 'YouTube' },
        ].map(({ key, icon, label }) => {
          const val = siteInfo[key];
          const valid = isValidUrl(val);
          return (
            <InfoRow key={key} icon={icon} label={label} value={f(val)}
              isLink={valid} onCopy={valid ? () => handleCopy(val, key) : null}
              copied={copiedField === key} />
          );
        })}

        {/* TikTok */}
        {siteInfo.tiktok && (
          <InfoRow icon={Globe} label="TikTok" value={f(siteInfo.tiktok)}
            isLink={isValidUrl(siteInfo.tiktok)}
            onCopy={isValidUrl(siteInfo.tiktok) ? () => handleCopy(siteInfo.tiktok, 'tiktok') : null}
            copied={copiedField === 'tiktok'} />
        )}

        {/* Location */}
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

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => !isLoading && setIsModalOpen(false)}
        title="تعديل معلومات الموقع" size="lg">
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
            <FormField label="Instagram" icon={Instagram}>
              <input type="url" value={formData.instagram} onChange={set('instagram')}
                placeholder="https://instagram.com/..." disabled={isLoading} />
            </FormField>
            <FormField label="Facebook" icon={Facebook}>
              <input type="url" value={formData.facebook} onChange={set('facebook')}
                placeholder="https://facebook.com/..." disabled={isLoading} />
            </FormField>
          </div>

          <div className="si-form-row">
            <FormField label="YouTube" icon={Youtube}>
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
              <input type="text" value={formData.latitude} onChange={set('latitude')}
                placeholder="23.000000" disabled={isLoading} />
            </FormField>
            <FormField label="خط الطول (Longitude)" icon={MapPinned}>
              <input type="text" value={formData.longitude} onChange={set('longitude')}
                placeholder="22.999998" disabled={isLoading} />
            </FormField>
          </div>
        </div>

        <div className="si-modal-footer">
          <button className="si-btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isLoading}>إلغاء</button>
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