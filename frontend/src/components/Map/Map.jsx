import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import styles from './Map.module.css';

// إصلاح مشكلة أيقونات Leaflet في React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// إنشاء أيقونة مخصصة بلون ذهبي
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Map = ({ latitude, longitude, address, working_hours, site_name }) => {
  const [mapType, setMapType] = useState('satellite'); // 'satellite' أو 'street'
  
  // تحويل الإحداثيات من نص إلى أرقام
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  
  // التحقق من صحة الإحداثيات
  const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90 && lat !== 0;
  const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180 && lng !== 0;
  
  // إحداثيات افتراضية (وسط مدينة دبي)
  const defaultLat = 25.2048;
  const defaultLng = 55.2708;
  
  const finalLat = isValidLat ? lat : defaultLat;
  const finalLng = isValidLng ? lng : defaultLng;
  
  const position = [finalLat, finalLng];
  
  // تحديد نوع الخريطة
  const getTileLayer = () => {
    if (mapType === 'satellite') {
      // قمر صناعي من Mapbox (مجاني للاستخدام المحدود)
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      };
    } else {
      // خريطة الشارع من OpenStreetMap
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      };
    }
  };
  
  const currentTile = getTileLayer();

  return (
    <div className={styles.mapWrapper}>
      {/* أزرار تبديل نوع الخريطة */}
      <div className={styles.mapTypeButtons}>
        <button 
          className={`${styles.mapTypeBtn} ${mapType === 'satellite' ? styles.active : ''}`}
          onClick={() => setMapType('satellite')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M2 2h20v20H2z" />
            <circle cx="12" cy="12" r="4" />
            <path d="M22 2L15 9M2 2l7 7M2 22l7-7M22 22l-7-7" />
          </svg>
          قمر صناعي
        </button>
        <button 
          className={`${styles.mapTypeBtn} ${mapType === 'street' ? styles.active : ''}`}
          onClick={() => setMapType('street')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <path d="M2 12h20" />
          </svg>
          خريطة شارع
        </button>
      </div>

      <div className={styles.mapContainer}>
        <MapContainer 
          center={position} 
          zoom={18} 
          className={styles.map}
          zoomControl={true}
          scrollWheelZoom={true}
          attributionControl={false}
        >
          <TileLayer
            url={currentTile.url}
            attribution={currentTile.attribution}
          />
          <Marker position={position} icon={goldIcon}>
            <Popup>
              <div className={styles.popupContent}>
                <h4>{site_name || 'عيادتنا'}</h4>
                <p>📍 {address || 'العنوان غير متوفر'}</p>
                {working_hours && <p>🕐 {working_hours}</p>}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      {/* بطاقة المعلومات - في الموبايل تكون تحت الخريطة */}
      <div className={styles.infoCard}>
        <div className={styles.infoHeader}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <h3>موقع العيادة</h3>
        </div>
        
        {/* العنوان */}
        <div className={styles.infoRow}>
          <div className={styles.infoIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className={styles.infoText}>
            <span className={styles.infoLabel}>العنوان</span>
            <p className={styles.infoValue}>{address || 'العنوان غير متوفر'}</p>
          </div>
        </div>
        
        {/* ساعات العمل */}
        {working_hours && (
          <div className={styles.infoRow}>
            <div className={styles.infoIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className={styles.infoText}>
              <span className={styles.infoLabel}>ساعات العمل</span>
              <p className={styles.infoValue}>{working_hours}</p>
            </div>
          </div>
        )}
        
        {/* زر الحصول على الاتجاهات */}
        <button 
          className={styles.directionsBtn}
          onClick={() => {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${finalLat},${finalLng}`, '_blank');
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10-8-10-8-10-8 4-8 10 8 10 8 10z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          احصل على الاتجاهات
        </button>
      </div>
    </div>
  );
};

export default Map;