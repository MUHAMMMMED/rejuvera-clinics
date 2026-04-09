import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Login from './components/Authentication/Login/Login';
import NotFound from './components/NotFound/NotFound';
import AboutPage from './pages/About/About';
import BlogList from './pages/Blog/Blogs';
import BlogDashboard from './pages/BlogDashboard/BlogDashboard';
import BlogDetails from './pages/BlogDetails/BlogDetails';
import CategoriesPage from './pages/Categories/Categories';
import Dashboard from "./pages/Dashboard/Dashboard";
import DeviceDashboard from './pages/DeviceDashboard/DeviceDashboard';
import DeviceDetails from './pages/DeviceDetails/DeviceDetails';
import DevicesList from './pages/Devices/DevicesList';
import DoctorsPage from './pages/Doctors/Doctors';
import FaqsPage from './pages/Faq/Faq';
import GalleryPage from './pages/Gallery/Gallery';
import Home from "./pages/home/Home";
import LandingPage from "./pages/LandingPage/LandingPage";
import LandingPageEditor from './pages/LandingPageEditor/LandingPageEditor';
import PackagesPage from './pages/Packages/Packages';
import ServicesPage from './pages/Services/Services';
import ServicesByCategory from './pages/ServicesByCategory/ServicesByCategory';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/services" element={<ServicesPage/>} />
        <Route path="/service/:id/:slug/" element={<LandingPage />} />
        <Route path="/service/:id/edit/" element={<LandingPageEditor />} />

        <Route path="/category/:id/" element={<ServicesByCategory />} />
        <Route path="/categories" element={<CategoriesPage/>} />

        <Route path="/about" element={<AboutPage/>} />
        <Route path="/packages" element={<PackagesPage/>} />
        <Route path="/gallery" element={<GalleryPage/>} />
        <Route path="/doctors" element={<DoctorsPage/>} />
        <Route path="/faq" element={<FaqsPage/>} />

        <Route path="/blog" element={<BlogList/>} /> 
        <Route path="/blog/:id/" element={<BlogDetails />} />
        <Route path="/blog/:id/edit" element={<BlogDashboard/>} />

        <Route path="/devices" element={<DevicesList />} />
        <Route path="/device/:id" element={<DeviceDetails/>} />
        <Route path="/device/:id/edit" element={<DeviceDashboard/>} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* 404 Page - Must be the last route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;