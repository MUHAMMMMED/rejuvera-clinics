 
import AxiosInstance from '../../components/Authentication/AxiosInstance';
  
export const dashboardApi = {
  getDashboardData: () => AxiosInstance.get('/home/dashboard/'),
};
 
// Appointments API
export const appointmentsApi = {
  getAll: () => AxiosInstance.get('/home/appointment/'),
  getById: (id) => AxiosInstance.get(`/home/appointment/${id}/`),
  create: (data) => AxiosInstance.post('/home/appointment/', data),
  update: (id, data) => AxiosInstance.put(`/home/appointment/${id}/`, data),
  delete: (id) => AxiosInstance.delete(`/home/appointment/${id}/`),
};

// Categories API
export const categoriesApi = {
  getAll: () => AxiosInstance.get('/services/service-categories'),
  getById: (id) => AxiosInstance.get(`/services/service-categories/${id}/`),
  create: (data) => AxiosInstance.post('/services/service-categories/', data),
  update: (id, data) => AxiosInstance.put(`/services/service-categories/${id}/`, data),
  delete: (id) => AxiosInstance.delete(`/services/service-categories/${id}/`),
};

// Services API
export const servicesApi = {
  getAll: () => AxiosInstance.get('/services/service/'),
  getById: (id) => AxiosInstance.get(`/services/service/${id}/details/'`),
  create: (data) => AxiosInstance.post('/services/service/', data),
  update: (id, data) => AxiosInstance.put(`/services/service/${id}/`, data),
  delete: (id) => AxiosInstance.delete(`/services/service/${id}/`),
};

// Doctors API
 
export const doctorsApi = {
  getAll: () => AxiosInstance.get('/services/doctor/'),
  getById: (id) => AxiosInstance.get(`/services/doctor/${id}/`),
  
  // For create with FormData
  create: (formData) => {
    return AxiosInstance.post('/services/doctor/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // For update with FormData
  update: (id, formData) => {
    return AxiosInstance.put(`/services/doctor/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete: (id) => AxiosInstance.delete(`/services/doctor/${id}/`),
};

// Packages API
export const packagesApi = {
  getAll: () => AxiosInstance.get('/home/package/'),
  getById: (id) => AxiosInstance.get(`/home/package/${id}/`),
  create: (data) => AxiosInstance.post('/home/package/', data),
  update: (id, data) => AxiosInstance.put(`/home/package/${id}/`, data),
  delete: (id) => AxiosInstance.delete(`/home/package/${id}/`),
};
 
export const galleryApi = {
  getAll: () => AxiosInstance.get('/home/gallery/'),
  getById: (id) => AxiosInstance.get(`/home/gallery/${id}/`),
  create: (data) => {
 
    return AxiosInstance.post('/home/gallery/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  update: (id, data) => {
    // لـ PUT، تأكد من إرسال FormData أيضاً
    return AxiosInstance.put(`/home/gallery/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => AxiosInstance.delete(`/home/gallery/${id}/`),
};

// FAQs API
export const faqsApi = {
  getAll: () => AxiosInstance.get('/home/faq/'),
  getById: (id) => AxiosInstance.get(`/home/faq/${id}/`),
  create: (data) => AxiosInstance.post('/home/faq/', data),
  update: (id, data) => AxiosInstance.put(`/home/faq/${id}/`, data),
  delete: (id) => AxiosInstance.delete(`/home/faq/${id}/`),
};



// Site Info API
export const siteInfoApi = {

  getAll: () => AxiosInstance.get('/home/site-info/'),
  getById: (id) =>AxiosInstance.get(`/home/site-info/${id}/`),
  create: (data) => AxiosInstance.post('/home/site-info/', data),
  update: (id, data) => AxiosInstance.put(`/home/site-info/${id}/`, data),
  delete: (id) => AxiosInstance.delete(`/home/site-info/${id}/`),
 
};
 
 


// Tracking API
export const trackingApi = {
    // Sources
    getSources: () => AxiosInstance.get('/home/source/'),
    getSourceById: (id) => AxiosInstance.get(`/home/source/${id}/`),
    createSource: (data) => AxiosInstance.post('/home/source/', data),
    updateSource: (id, data) => AxiosInstance.put(`/home/source/${id}/`, data),
    deleteSource: (id) => AxiosInstance.delete(`/home/source/${id}/`),
    
    // Campaigns
    getCampaigns: () => AxiosInstance.get('/home/campaign/'),
    getCampaignById: (id) => AxiosInstance.get(`/home/campaign/${id}/`),
    createCampaign: (data) => AxiosInstance.post('/home/campaign/', data),
    updateCampaign: (id, data) => AxiosInstance.put(`/home/campaign/${id}/`, data),
    deleteCampaign: (id) => AxiosInstance.delete(`/home/campaign/${id}/`),
  };
// api.js


// في ملف api.js أضف:

export const serviceHeroApi = {
  getAll: () => AxiosInstance.get('/services/service-hero/'),
  getById: (id) => AxiosInstance.get(`/services/service-hero/${id}/`),
  update: (id, data) => AxiosInstance.put(`/services/service-hero/${id}/`, data),
};


// Trust API
export const trustApi = {
  getAll: () => AxiosInstance.get('/services/service-trust/'),
  getById: (id) => AxiosInstance.get(`/services/service-trust/${id}/`),
  update: (id, data) => AxiosInstance.put(`/services/service-trust/${id}/`, data),
};


// Problem Solution API
export const problemSolutionApi = {
  getAll: () => AxiosInstance.get('/services/service-problem-solutions/'),
  getByServiceId: (serviceId) => AxiosInstance.get(`/services/service-problem-solutions/?service=${serviceId}`),
  getById: (id) => AxiosInstance.get(`/services/service-problem-solutions/${id}/`),
  update: (id, data, isFormData = false) => {
    if (isFormData) {
      return AxiosInstance.put(`/services/service-problem-solutions/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return AxiosInstance.put(`/services/service-problem-solutions/${id}/`, data);
  },
};

// Add to your api.js file
export const blogsApi = {
  getAll: () => AxiosInstance.get('/blog/blogs/'),
  get: (id) => AxiosInstance.get(`/blog/blogs//${id}/`),
  create: (data) => AxiosInstance.post('/blog/blogs/', data),
  update: (id, data) => AxiosInstance.put(`/blog/blogs/${id}/`, data),
  delete: (id) => AxiosInstance.delete(`/blog/blogs/${id}/`),
};

// في ملف api.js
export const devicesApi = {
  getAll: () => AxiosInstance.get('/device/devices/'),
  get: (id) => AxiosInstance.get(`/device/devices/${id}/`),
  create: (data) => {
    // إذا كانت البيانات FormData، نرسلها كما هي
    if (data instanceof FormData) {
      return AxiosInstance.post('/device/devices/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return AxiosInstance.post('/device/devices/', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return AxiosInstance.put(`/device/devices/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return AxiosInstance.put(`/device/devices/${id}/`, data);
  },
  delete: (id) => AxiosInstance.delete(`/device/devices/${id}/`),
};