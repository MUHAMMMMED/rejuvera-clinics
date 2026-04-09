 
export const generateSlug = (text) => {
    if (!text) return '';
    
    // استبدال الحروف العربية بأخرى قريبة (اختياري - للقراءة)
    const arabicToLatin = {
      'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'g', 'ح': 'h',
      'خ': 'kh', 'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's',
      'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
      'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
      'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'h', 'ى': 'a'
    };
    
    let slug = text
      .trim()
      .toLowerCase()
      // تحويل الأحرف العربية إلى لاتينية (لجعل الرابط مقروء)
      .split('')
      .map(char => arabicToLatin[char] || char)
      .join('')
      // استبدال المسافات والعلامات بشرطات
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      // إزالة الشرطات المتكررة
      .replace(/-+/g, '-')
      // إزالة الشرطات من البداية والنهاية
      .replace(/^-+|-+$/g, '');
    
    return slug;
  };
  
  // دالة لتوليد Slug يدعم اللغة العربية (يحتفظ بالأحرف العربية)
  export const generateArabicSlug = (text) => {
    if (!text) return '';
    
    return text
      .trim()
      .toLowerCase()
      // استبدال المسافات بشرطات
      .replace(/\s+/g, '-')
      // إزالة الأحرف الخاصة (يترك الأحرف العربية والإنجليزية والأرقام)
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9-]/g, '')
      // إزالة الشرطات المتكررة
      .replace(/-+/g, '-')
      // إزالة الشرطات من البداية والنهاية
      .replace(/^-+|-+$/g, '');
  };
  
  // دالة متكاملة تعطي أفضل النتائج
  export const createServiceSlug = (id, name, useLatin = false) => {
    const slug = useLatin ? generateSlug(name) : generateArabicSlug(name);
    return `${id}-${slug}`;
  };