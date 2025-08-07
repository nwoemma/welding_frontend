import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Service from './pages/Service';
import MainLayout from './layouts/MainLayout';
import Contact from './pages/Contact_1';
import Feature from './pages/Features';
import Team from './pages/Team';
import Appointment from './pages/Appointment';
import Testimonial from './pages/testimonial';
import NotFound from './pages/NotFound';
import Register from './accounts/Register';
import Login from './accounts/Login'; // Don't forget to import Login
import Dashboard from './accounts/Dashboard'; // Import Dashboard component
import UserDashboard from './accounts/User_dashboard'; // Import UserDashboard component
import PasswordResetRequest from './accounts/password_reset_request'; // Import PasswordReset component
import PasswordResetConfirm from './accounts/password_reset_confirm';
import Chats from './chats/chats'; // Import Chats component
import AdminSignIn from './accounts/admin_sign'; // Import AdminSignIn component
import AdminDashboard from './accounts/Admin_dashboard';
import WeldingChat from './chats/chats';
import Profile from './accounts/profile';
import JobApplication from './jobs/jobs_apply'; // Import JobList component
import JobUpdate from './jobs/job_update';
import JobList from './jobs/job_list';
import JobCreationForm from './jobs/job_creation'
function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Routes WITH navbar and footer */}
        <Route element={<MainLayout showNavbar={true} showFooter={true} />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="service" element={<Service />} />
          <Route path="contact" element={<Contact />} />
          <Route path="features" element={<Feature />} />
          <Route path="team" element={<Team />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="testimonial" element={<Testimonial />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Routes WITHOUT navbar and footer */}
        <Route element={<MainLayout showNavbar={false} showFooter={false} />}>
          <Route path="admin/signin" element={<AdminSignIn />} />
          {/* Add other admin routes here if needed */}
          {/* <Route path="admin/dashboard" element={<AdminDashboard />} /> */}
          
          {/* User authentication routes */}
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          {/* Protected routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin_dashboard" element={<AdminDashboard />} />
          <Route path="user_dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="password_reset_request" element={<PasswordResetRequest />} />
          <Route path='password_reset_confirm' element= {<PasswordResetConfirm/>}/>
          <Route path="chats" element={<WeldingChat />} /> 

          <Route path="job_update/:id" element={<JobUpdate />} />
          <Route path="job_list" element={<JobList />} />
          <Route path="jobs/request" element={<JobApplication />} />
          <Route path='job_create' element= {<JobCreationForm/>}/>
          {/* <Route path='admin' element= {<AdminRoute/>}/> */}
          {/* <Route path="chats" element={<Chats />} /> */}

        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;