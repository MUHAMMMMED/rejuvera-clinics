// src/data/mockData.js

export const MOCK_STATS = {
    totalAppointments: 324,
    todayAppointments: 18,
    totalDoctors: 8,
    totalServices: 24,
    monthlyRevenue: '187,450',
    pendingAppointments: 42,
  };
  
  export const MOCK_CATEGORIES = [
    { id: 1, name: 'جراحة التجميل', description: 'عمليات تجميل متقدمة لنحت وتشكيل الجسم', count: 11 },
    { id: 2, name: 'الجلدية والتجميل', description: 'علاجات الجلد والبشرة باستخدام أحدث التقنيات', count: 4 },
    { id: 3, name: 'التجميل النسائي', description: 'خدمات تجميلية متخصصة للنساء', count: 3 },
    { id: 4, name: 'ليزر إزالة الشعر', description: 'إزالة الشعر نهائياً بأحدث أجهزة الليزر', count: 2 },
  ];
  
  export const MOCK_CAMPAIGNS = [
    { id: 1, name: 'summer_sale_2025', created_at: '2025-03-01' },
    { id: 2, name: 'winter_promo_2025', created_at: '2025-02-15' },
    { id: 3, name: 'new_year_2025', created_at: '2025-01-01' },
    { id: 4, name: 'ramadan_offer', created_at: '2025-04-01' },
  ];
  
  export const MOCK_SOURCES = [
    { id: 1, name: 'google_ads', campaigns: [1, 2] },
    { id: 2, name: 'facebook_ads', campaigns: [1, 3] },
    { id: 3, name: 'instagram', campaigns: [2, 4] },
    { id: 4, name: 'tiktok', campaigns: [3] },
    { id: 5, name: 'direct', campaigns: [1, 2, 3, 4] },
  ];
  
  export const MOCK_TRACKED_LINKS = [
    { id: 1, source_id: 1, campaign_id: 1, base_url: 'https://rejuvera.com/landing/summer', generated_url: 'https://rejuvera.com/landing/summer?utm_source=google_ads&utm_campaign=summer_sale_2025', created_at: '2025-03-01' },
    { id: 2, source_id: 2, campaign_id: 1, base_url: 'https://rejuvera.com/landing/summer', generated_url: 'https://rejuvera.com/landing/summer?utm_source=facebook_ads&utm_campaign=summer_sale_2025', created_at: '2025-03-02' },
    { id: 3, source_id: 3, campaign_id: 2, base_url: 'https://rejuvera.com/landing/winter', generated_url: 'https://rejuvera.com/landing/winter?utm_source=instagram&utm_campaign=winter_promo_2025', created_at: '2025-02-16' },
    { id: 4, source_id: 1, campaign_id: 2, base_url: 'https://rejuvera.com/landing/winter', generated_url: 'https://rejuvera.com/landing/winter?utm_source=google_ads&utm_campaign=winter_promo_2025', created_at: '2025-02-17' },
    { id: 5, source_id: 4, campaign_id: 3, base_url: 'https://rejuvera.com/landing/newyear', generated_url: 'https://rejuvera.com/landing/newyear?utm_source=tiktok&utm_campaign=new_year_2025', created_at: '2025-01-02' },
    { id: 6, source_id: 5, campaign_id: 3, base_url: 'https://rejuvera.com/landing/newyear', generated_url: 'https://rejuvera.com/landing/newyear?utm_source=direct&utm_campaign=new_year_2025', created_at: '2025-01-03' },
    { id: 7, source_id: 2, campaign_id: 4, base_url: 'https://rejuvera.com/landing/ramadan', generated_url: 'https://rejuvera.com/landing/ramadan?utm_source=facebook_ads&utm_campaign=ramadan_offer', created_at: '2025-04-01' },
    { id: 8, source_id: 3, campaign_id: 4, base_url: 'https://rejuvera.com/landing/ramadan', generated_url: 'https://rejuvera.com/landing/ramadan?utm_source=instagram&utm_campaign=ramadan_offer', created_at: '2025-04-01' },
    { id: 9, source_id: 1, campaign_id: 4, base_url: 'https://rejuvera.com/landing/ramadan', generated_url: 'https://rejuvera.com/landing/ramadan?utm_source=google_ads&utm_campaign=ramadan_offer', created_at: '2025-04-02' },
    { id: 10, source_id: 5, campaign_id: 1, base_url: 'https://rejuvera.com/landing/summer', generated_url: 'https://rejuvera.com/landing/summer?utm_source=direct&utm_campaign=summer_sale_2025', created_at: '2025-03-05' },
  ];
  
  export const MOCK_TRACKING_STATS = {
    totalLinks: 10,
    activeCampaigns: 4,
    activeSources: 5,
    clickThroughRate: '24.8%',
  };
  
  export const MOCK_APPOINTMENTS = [
    { id: 1, patientName: 'سارة عبدالعزيز', phone: '0501234567', doctor: 'د. لؤي السالمي', service: 'شد ورفع الأرداف البرازيلي (BBL)', category: 'جراحة التجميل', date: '2025-04-02', time: '11:00 ص', status: 'confirmed', amount: 8000, source: 'google_ads', campaign: 'summer_sale_2025' },
    { id: 2, patientName: 'نورة فهد', phone: '0559876543', doctor: 'د. سهام العرفج', service: 'شد الوجه والرقبة', category: 'جراحة التجميل', date: '2025-04-02', time: '02:00 م', status: 'pending', amount: 12000, source: 'facebook_ads', campaign: 'summer_sale_2025' },
    { id: 3, patientName: 'ريما خالد', phone: '0598877665', doctor: 'د. نتالي', service: 'حقن البوتكس', category: 'الجلدية والتجميل', date: '2025-04-03', time: '10:30 ص', status: 'confirmed', amount: 1200, source: 'instagram', campaign: 'winter_promo_2025' },
    { id: 4, patientName: 'أحمد عمر', phone: '0564433221', doctor: 'د. ماهر الأحدب', service: 'شفط الدهون بالفيزر', category: 'جراحة التجميل', date: '2025-04-03', time: '04:00 م', status: 'confirmed', amount: 5500, source: 'google_ads', campaign: 'ramadan_offer' },
    { id: 5, patientName: 'هند محمد', phone: '0531122334', doctor: 'د. فلوه الجنوبي', service: 'إزالة الشعر بالليزر', category: 'ليزر إزالة الشعر', date: '2025-04-04', time: '12:00 م', status: 'cancelled', amount: 800, source: 'tiktok', campaign: 'new_year_2025' },
    { id: 6, patientName: 'لطيفة حمد', phone: '0583344556', doctor: 'د. نجوى باطرفي', service: 'تجميل المهبل', category: 'التجميل النسائي', date: '2025-04-04', time: '09:00 ص', status: 'pending', amount: 3500, source: 'direct', campaign: 'ramadan_offer' },
    { id: 7, patientName: 'منى الشمري', phone: '0556677889', doctor: 'د. لؤي السالمي', service: 'نحت الجسم 360', category: 'جراحة التجميل', date: '2025-04-05', time: '01:00 م', status: 'confirmed', amount: 15000, source: 'facebook_ads', campaign: 'winter_promo_2025' },
    { id: 8, patientName: 'فاطمة القحطاني', phone: '0599988776', doctor: 'د. نتالي', service: 'حقن الفيلر', category: 'الجلدية والتجميل', date: '2025-04-05', time: '03:30 م', status: 'pending', amount: 1800, source: 'instagram', campaign: 'summer_sale_2025' },
    { id: 9, patientName: 'عبدالله محمد', phone: '0501122334', doctor: 'د. لؤي السالمي', service: 'شد البطن', category: 'جراحة التجميل', date: '2025-04-01', time: '10:00 ص', status: 'confirmed', amount: 12000, source: 'google_ads', campaign: 'summer_sale_2025' },
    { id: 10, patientName: 'نوال أحمد', phone: '0554433221', doctor: 'د. سهام العرفج', service: 'شد الوجه والرقبة', category: 'جراحة التجميل', date: '2025-03-30', time: '01:00 م', status: 'confirmed', amount: 12000, source: 'instagram', campaign: 'winter_promo_2025' },
    { id: 11, patientName: 'خالد يوسف', phone: '0567788990', doctor: 'د. ماهر الأحدب', service: 'شفط الدهون بالفيزر', category: 'جراحة التجميل', date: '2025-03-28', time: '11:00 ص', status: 'confirmed', amount: 5500, source: 'facebook_ads', campaign: 'new_year_2025' },
    { id: 12, patientName: 'سامية رشيد', phone: '0598877665', doctor: 'د. نتالي', service: 'حقن البوتكس', category: 'الجلدية والتجميل', date: '2025-03-25', time: '02:00 م', status: 'confirmed', amount: 1200, source: 'tiktok', campaign: 'new_year_2025' },
  ];
  
  export const MOCK_SERVICES = [
    { id: 1, name: 'شد ورفع الأرداف البرازيلي (BBL)', category: 'جراحة التجميل', description: 'تقنية تجميلية حديثة تُستخدم لزيادة حجم وتشكيل الأرداف', doctors: 2, appointments: 45, price: '8000 - 15000', icon: '✨' },
    { id: 2, name: 'شفط الدهون بالفيزر (VASER)', category: 'جراحة التجميل', description: 'إجراء تجميلي طفيف التوغل يستخدم تقنية الموجات فوق الصوتية', doctors: 3, appointments: 38, price: '5000 - 12000', icon: '✨' },
    { id: 3, name: 'نحت الجسم 360', category: 'جراحة التجميل', description: 'أسلوب شامل لتحديد شكل الجسم يتضمن علاج مناطق متعددة', doctors: 2, appointments: 52, price: '10000 - 20000', icon: '✨' },
    { id: 4, name: 'شد البطن', category: 'جراحة التجميل', description: 'إزالة الدهون والترهلات الزائدة للحصول على بطن مشدود', doctors: 2, appointments: 41, price: '8000 - 18000', icon: '✨' },
    { id: 5, name: 'حقن البوتكس', category: 'الجلدية والتجميل', description: 'علاج التجاعيد والخطوط الدقيقة للحصول على مظهر شاب', doctors: 3, appointments: 67, price: '800 - 1500', icon: '💉' },
    { id: 6, name: 'حقن الفيلر', category: 'الجلدية والتجميل', description: 'استعادة حجم الوجه وملء التجاعيد العميقة', doctors: 2, appointments: 54, price: '1000 - 2500', icon: '💉' },
    { id: 7, name: 'تقنيات الهايفو', category: 'الجلدية والتجميل', description: 'شد الوجه والرقبة بدون جراحة باستخدام الموجات فوق الصوتية', doctors: 2, appointments: 43, price: '2000 - 4000', icon: '⚡' },
    { id: 8, name: 'تجميل المهبل', category: 'التجميل النسائي', description: 'استعادة الشكل الطبيعي والوظيفي', doctors: 2, appointments: 32, price: '3000 - 8000', icon: '🌸' },
    { id: 9, name: 'إزالة الشعر بالليزر', category: 'ليزر إزالة الشعر', description: 'تقنية متطورة لإزالة الشعر نهائياً', doctors: 2, appointments: 89, price: '300 - 1500', icon: '⚡' },
  ];
  
  export const MOCK_DOCTORS = [
    { id: 1, name: 'د. لؤي السالمي', title: 'استشاري جراحة التجميل', category: 'جراحة التجميل', experience: '12 سنة', image: 'https://randomuser.me/api/portraits/men/32.jpg', instagram: '@dr_loai_alsalmi', appointments: 145, rating: 4.9, services: ['جراحة التجميل', 'نحت الجسم'] },
    { id: 2, name: 'د. سهام العرفج', title: 'استشارية جراحة التجميل', category: 'جراحة التجميل', experience: '10 سنوات', image: 'https://randomuser.me/api/portraits/women/68.jpg', instagram: '@dr.sehamalarfaj', appointments: 112, rating: 4.8, services: ['جراحة التجميل', 'شد الوجه'] },
    { id: 3, name: 'د. ماهر الأحدب', title: 'استشاري جراحة التجميل والترميم', category: 'جراحة التجميل', experience: '15 سنة', image: 'https://randomuser.me/api/portraits/men/45.jpg', instagram: '@maheralahdabmd', appointments: 98, rating: 4.9, services: ['جراحة التجميل', 'شفط الدهون'] },
    { id: 4, name: 'د. نجوى باطرفي', title: 'استشارية النساء والولادة', category: 'التجميل النسائي', experience: '8 سنوات', image: 'https://randomuser.me/api/portraits/women/44.jpg', instagram: '@dr.najwabatarfi', appointments: 76, rating: 4.9, services: ['التجميل النسائي'] },
    { id: 5, name: 'د. نتالي دوملوج', title: 'اخصائية الجلدية', category: 'الجلدية والتجميل', experience: '7 سنوات', image: 'https://randomuser.me/api/portraits/women/52.jpg', instagram: '@dr.nathalie', appointments: 89, rating: 4.7, services: ['الجلدية والتجميل', 'البوتكس والفيلر'] },
    { id: 6, name: 'د. فلوه الجنوبي', title: 'أخصائية التجميل', category: 'ليزر إزالة الشعر', experience: '5 سنوات', image: 'https://randomuser.me/api/portraits/women/23.jpg', instagram: '@dr.flwah', appointments: 110, rating: 4.8, services: ['الليزر', 'تفتيح البشرة'] },
    { id: 7, name: 'د. كريمة جمجوم', title: 'اخصائية النسائية والتجميل النسائي', category: 'التجميل النسائي', experience: '9 سنوات', image: 'https://randomuser.me/api/portraits/women/86.jpg', instagram: '@dr.careema', appointments: 68, rating: 4.8, services: ['التجميل النسائي'] },
    { id: 8, name: 'د. البراء الجريّان', title: 'استشاري جراحة التجميل والترميم', category: 'جراحة التجميل', experience: '11 سنة', image: 'https://randomuser.me/api/portraits/men/78.jpg', instagram: '@draljerian', appointments: 92, rating: 4.9, services: ['جراحة التجميل'] },
  ];
  
  export const MOCK_PACKAGES = [
    { id: 1, name: 'الباقة الفضية', price: '3,000 ريال', popular: false, features: ['جلسة ليزر لمنطقة واحدة', 'جلسة هايفو للوجه', 'استشارة مجانية'] },
    { id: 2, name: 'الباقة الذهبية', price: '7,500 ريال', popular: true, features: ['3 جلسات ليزر', 'بوتكس (منطقة واحدة)', 'فيلر (1 حقنة)', 'تقشير كيميائي'] },
    { id: 3, name: 'باقة التحول الكامل', price: '20,000 ريال', popular: false, features: ['عملية نحت الجسم', '5 جلسات ليزر', 'بوتكس وفيلر شامل', 'جلسة بلازما'] },
  ];
  
  export const MOCK_FAQS = [
    { id: 1, question: 'ما هي التقنيات المستخدمة في العيادة؟', answer: 'نستخدم أحدث الأجهزة العالمية المعتمدة مثل VASER, Emsculpt Neo, Morpheus 8.' },
    { id: 2, question: 'هل الاستشارة الأولى مجانية؟', answer: 'نعم، الاستشارة الأولى مجانية للتعرف على حالتك ومناقشة الخيارات المناسبة.' },
    { id: 3, question: 'كيف أستعد لجلسة الليزر؟', answer: 'يُنصح بتجنب التعرض للشمس قبل الجلسة بأسبوع، وحلق المنطقة قبل 24 ساعة.' },
  ];
  
  export const MOCK_GALLERY = [
    { id: 1, url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop', alt: 'نتيجة عملية شد الوجه' },
    { id: 2, url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop', alt: 'نتيجة عملية نحت الجسم' },
    { id: 3, url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop', alt: 'نتيجة حقن البوتكس' },
    { id: 4, url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400&h=300&fit=crop', alt: 'نتيجة إزالة الشعر بالليزر' },
    { id: 5, url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop', alt: 'نتيجة تجميل الأنف' },
    { id: 6, url: 'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?w=400&h=300&fit=crop', alt: 'نتيجة شد البطن' },
  ];
  
  export const MOCK_SITE_INFO = {
    site_name: 'عيادة ريجوفيرا الفاخرة',
    phone: '+966 11 499 9959',
    whatsapp: '966114999959',
    email: 'info@rejuveraclinics.com',
    address: 'الرياض، حي الرحمانية، طريق العروبة',
    instagram: 'https://www.instagram.com/rejuveracenter/',
    working_hours: 'السبت - الخميس: ٢:٠٠ م - ١٠:٠٠ م\nالجمعة: مغلق',
  };



  