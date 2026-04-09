export const serviceCategories = [
    { id: 'plastic', name: 'جراحة التجميل', icon: '✨', count: 11, description: 'أحدث تقنيات نحت القوام والجراحات التجميلية' },
    { id: 'derma', name: 'الجلدية والتجميل', icon: '💎', count: 4, description: 'علاجات متطورة للبشرة والشباب الدائم' },
    { id: 'women', name: 'التجميل النسائي', icon: '🌸', count: 3, description: 'رعاية متخصصة لصحة وجمال المرأة' },
    { id: 'laser', name: 'ليزر إزالة الشعر', icon: '⚡', count: 2, description: 'تقنيات ليزر متطورة لنتائج دائمة' }
  ];
  
  export const services = {
    'جراحة التجميل': [
      { id: 1, name: 'شد ورفع الأرداف البرازيلي (BBL)', description: 'تقنية تجميلية حديثة تُستخدم لزيادة حجم وتشكيل الأرداف تعتمد على نقل الدهون من مناطق أخرى في الجسم', icon: '✨' },
      { id: 2, name: 'شفط الدهون بالفيزر (VASER)', description: 'إجراء تجميلي طفيف التوغل يستخدم تقنية الموجات فوق الصوتية لإزالة الدهون غير المرغوب فيها بفعالية وأمان', icon: '✨' },
      { id: 3, name: 'نحت الجسم 360', description: 'أسلوب شامل لتحديد شكل الجسم يتضمن علاج مناطق متعددة لتحقيق شكل متناسق وقوام رشيق', icon: '✨' },
      { id: 4, name: 'عمليات شد البطن', description: 'إزالة الدهون والترهلات الزائدة للحصول على بطن مشدود ومنحوت', icon: '✨' },
      { id: 5, name: 'شد الفخذين', description: 'إزالة الجلد الزائد والدهون من الفخذين لإضفاء مظهر أكثر نعومة وتناغمًا', icon: '✨' },
      { id: 6, name: 'شد الذراعين', description: 'إجراء جراحي يتضمن إزالة الجلد الزائد والدهون من أعلى الذراعين', icon: '✨' },
      { id: 7, name: 'شد الوجه والرقبة المتقدم', description: 'تقليل علامات الشيخوخة بجرح مخفي خلف الأذن لندوب غير مرئية تقريبًا', icon: '✨' },
      { id: 8, name: 'شد الجفون', description: 'إزالة الجلد الزائد والدهون لاستعادة نظراتكِ المُشرقة والشابة', icon: '✨' },
      { id: 9, name: 'تجميل الأنف', description: 'تحسين مظهر ووظيفة الأنف لتحقيق تناسق مثالي مع ملامح الوجه', icon: '✨' },
      { id: 10, name: 'جراحات تجميل الثدي', description: 'تشمل التكبير، الشد، والتصغير لاستعادة الثقة وتجميل شكل الجسم', icon: '✨' },
      { id: 11, name: 'علاج التثدي عند الرجال', description: 'التخلص من تضخم أنسجة الثدي عند الرجال باستخدام تقنية الفيزر', icon: '✨' }
    ],
    'الجلدية والتجميل': [
      { id: 12, name: 'حقن البوتكس', description: 'علاج التجاعيد والخطوط الدقيقة للحصول على مظهر شاب ومنتعش', icon: '💉' },
      { id: 13, name: 'حقن الفيلر', description: 'استعادة حجم الوجه وملء التجاعيد العميقة', icon: '💉' },
      { id: 14, name: 'تقنيات الهايفو', description: 'شد الوجه والرقبة بدون جراحة باستخدام الموجات فوق الصوتية', icon: '⚡' },
      { id: 15, name: 'البلازما الغنية بالصفائح', description: 'تحفيز الكولاجين وتجديد البشرة', icon: '🩸' }
    ],
    'التجميل النسائي': [
      { id: 16, name: 'تجميل المهبل', description: 'استعادة الشكل الطبيعي والوظيفي', icon: '🌸' },
      { id: 17, name: 'شد الشفرات', description: 'تحسين المظهر والتخلص من عدم الراحة', icon: '🌸' },
      { id: 18, name: 'علاج سلس البول', description: 'حلول غير جراحية لمشاكل السلس', icon: '🌸' }
    ],
    'ليزر إزالة الشعر': [
      { id: 19, name: 'إزالة الشعر بالليزر', description: 'تقنية متطورة لإزالة الشعر نهائياً', icon: '⚡' },
      { id: 20, name: 'تفتيح البشرة', description: 'علاجات ليزر لتفتيح وتوحيد لون البشرة', icon: '✨' }
    ]
  };
  
  export const packages = [
    {
      id: 1,
      name: 'باقة النحت المثالي',
      price: 'تبدأ من 15,000 ر.س',
      features: [
        'جلسة استشارية مع استشاري التجميل',
        'شفط دهون بالفيزر (منطقتين)',
        'نحت الجسم 360',
        'جلسة متابعة بعد العملية',
        'كريم للعناية بعد العملية'
      ],
      popular: true
    },
    {
      id: 2,
      name: 'باقة الشباب الدائم',
      price: 'تبدأ من 8,000 ر.س',
      features: [
        'جلسة استشارية',
        'حقن البوتكس (منطقتين)',
        'حقن الفيلر (حقنة واحدة)',
        'جلسة هايفو للوجه',
        'جلسة بلازما للبشرة'
      ],
      popular: false
    },
    {
      id: 3,
      name: 'باقة العناية الشاملة',
      price: 'تبدأ من 12,000 ر.س',
      features: [
        'استشارة شاملة',
        '6 جلسات ليزر لإزالة الشعر',
        '4 جلسات تفتيح بشرة',
        'جلسة تقشير كيميائي',
        'منتجات عناية خاصة'
      ],
      popular: false
    },
    {
      id: 4,
      name: 'باقة التجميل النسائي',
      price: 'تبدأ من 10,000 ر.س',
      features: [
        'استشارة مع استشارية النساء',
        'تجميل المهبل بالليزر',
        'شد الشفرات',
        'علاج سلس البول',
        'جلسات متابعة'
      ],
      popular: false
    },
    {
      id: 5,
      name: 'باقة الشباب المتألق',
      price: 'تبدأ من 5,000 ر.س',
      features: [
        'جلسة استشارية',
        '3 جلسات هايفو للوجه',
        'حقن البوتكس (منطقة واحدة)',
        'جلسة ميزوثيرابي',
        'كريم عناية متخصص'
      ],
      popular: false
    },
    {
      id: 6,
      name: 'باقة العروس المتكاملة',
      price: 'تبدأ من 25,000 ر.س',
      features: [
        'استشارة شاملة مع فريق طبي',
        'نحت الجسم بالفيزر',
        'شد البطن',
        '6 جلسات ليزر',
        'حقن فيلر وبوتكس',
        'باقة عناية خاصة للعروس'
      ],
      popular: true
    }
  ];
  
  export const galleryImages = [
    'https://rejuvera-clinics.vercel.app/images/5.png', 'https://rejuvera-clinics.vercel.app/images/6.png', 'https://rejuvera-clinics.vercel.app/images/7.png', 'https://rejuvera-clinics.vercel.app/images/8.png',
    'https://rejuvera-clinics.vercel.app/images/9.png', 'https://rejuvera-clinics.vercel.app/images/10-copy.png', 'https://rejuvera-clinics.vercel.app/images/11.png', 'https://rejuvera-clinics.vercel.app/images/12.png',
    'https://rejuvera-clinics.vercel.app/images/13.png', 'https://rejuvera-clinics.vercel.app/images/14.png', 'https://rejuvera-clinics.vercel.app/images/15.png', 'https://rejuvera-clinics.vercel.app/images/16.png',
    'https://rejuvera-clinics.vercel.app/images/17.png', 'https://rejuvera-clinics.vercel.app/images/18.png', 'https://rejuvera-clinics.vercel.app/images/19.png'
  ];
  
  export const doctors = [
 
 
    { name: 'د. لؤي السالمي', title: 'استشاري جراحة التجميل', instagram: 'dr_loai_alsalmi', image: 'https://rejuvera-clinics.vercel.app/images/Dr.Loai Alsalmi.jpg' },
    { name: 'د. ماهر الأحدب', title: 'استشاري جراحة التجميل و الترميم', instagram: 'maheralahdabmd', image: 'https://rejuvera-clinics.vercel.app/images/maher.jpg' },
    { name: 'د. البراء الجريّان', title: 'استشاري جراحة التجميل و الترميم', instagram: 'draljerian', image: 'https://rejuvera-clinics.vercel.app/images/Dr. Albaraa Aljerian.jpg' },
    { name: 'د. سهام العرفج', title: 'استشارية جراحة التجميل و الترميم', instagram: 'dr.sehamalarfaj', image: 'https://rejuvera-clinics.vercel.app/images/Dr.seham Alarfaj.jpg' },
    { name: 'د. نجوى باطرفي', title: 'استشارية النساء والولادة', instagram: 'dr.najwabatarfi', image: 'https://rejuvera-clinics.vercel.app/images/Dr.Najwa Batarfi.jpg' },
    { name: 'د. نتالي', title: 'اخصائية الجلدية', instagram: 'dr.nathalie', image: 'https://rejuvera-clinics.vercel.app/images/Dr.Nathalie Domloj.jpg' },
    { name: 'د. كريمه جمجوم', title: 'اخصائية النسائية و الولادة و التجميل النسائي', instagram: 'dr.careema.jpg', image: 'https://rejuvera-clinics.vercel.app/images/dr.careema.jpg' },
    { name: 'د. فلوه الجنوبي', title: 'أخصائية التجميل', instagram: 'dr.flwah', image: 'https://rejuvera-clinics.vercel.app/images/Dr.Flwah Aljanoubi.png' }
  ];





  export const faqs = [
    { q: 'ما هي التقنيات المستخدمة في العيادة؟', a: 'نستخدم أحدث الأجهزة العالمية المعتمدة مثل VASER, Emsculpt Neo, Morpheus 8, و GentleMax Pro.' },
    { q: 'هل الاستشارة الأولى مجانية؟', a: 'نعم، الاستشارة الأولى مجانية للتعرف على حالتك ومناقشة الخيارات المناسبة.' },
    { q: 'كيف أستعد لجلسة الليزر؟', a: 'يُنصح بتجنب التعرض للشمس قبل الجلسة بأسبوع، وحلق المنطقة قبل 24 ساعة من الجلسة.' },
    { q: 'كم مدة التعافي بعد الإجراءات الجراحية؟', a: 'تختلف حسب الإجراء، لكن معظم العمليات تحتاج من أسبوع إلى أسبوعين للتعافي الأولي.' }
  ];