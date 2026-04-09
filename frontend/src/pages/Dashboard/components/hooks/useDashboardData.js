 
import { useCallback, useEffect, useState } from 'react';
import { dashboardApi } from '../../api';
  
const useDashboardData = () => {
  const [data, setData] = useState({
    info: null,
    categories: [],
    doctors: [],
    faqs: [],
    packages: [],
    gallery: [],
    appointments: [],
    source: [],
    reports: [],
    devices: [],
    blogs: []


  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardApi.getDashboardData();
      
      // Ensure all fields have default values
      setData({
        info: response.data.info || null,
        categories: response.data.categories || [],
        doctors: response.data.doctors || [],
        faqs: response.data.faqs || [],
        packages: response.data.packages || [],
        gallery: response.data.gallery || [],
        appointments: response.data.appointment || [],
        source: response.data.source || [],
        reports: response.data.reports || [],
        devices: response.data.devices || [],
        blogs: response.data.blogs || [],
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'حدث خطأ في جلب البيانات');
      // Keep default data structure on error
      setData({
        info: null,
        categories: [],
        doctors: [],
        faqs: [],
        packages: [],
        gallery: [],
        appointments: [],
        source: [],
        reports: [],
        devices:[],
        blogs:[],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useDashboardData;