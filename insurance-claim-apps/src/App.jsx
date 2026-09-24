import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './User/pages/Home'
import Profile from './User/pages/Profile'
import Contact from './User/pages/Contact'
import Auth from './Pages/Auth'
import Dashboard from './User/pages/Dashboard'
import AdminDashboard from './Admin/pages/AdminDashboard'
import Claims from './User/pages/Claims'
import Policies from './User/pages/Policies'
import Pnf from './Pages/Pnf'
import NewClaim from './User/pages/NewClaim'
import TrackClaim from './User/pages/TrackClaim'
import ProtectedRoute from "./User/components/ProtectedRoute";
import PolicyDetails from "./User/pages/PolicyDetails";
import AdminClaims from "./Admin/pages/AdminClaims";
import AdminClaimReview from "./Admin/pages/AdminClaimReview";
import AdminPolicies from './Admin/pages/AdminPolicies'
import AdminUserPolicyDetails from './Admin/pages/AdminUserPolicyDetails'
import AdminReports from './Admin/pages/AdminReports'
import AdminUserPolicies from './Admin/pages/AdminUserPolicies'

function App() {

  return (
    <>
    <Routes>


      <Route path='/' element={<Home/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/Auth' element={<Auth/>}/>
      {/* <Route path='/Dashboard' element={<Dashboard/>}/> */}
      <Route path='/admin' element={<AdminDashboard/>}/>
      <Route path='/claims' element={<Claims/>}/>
      <Route path='/Policies' element={<Policies/>}/>
      <Route path='/pnf' element={<Pnf/>}/>
      <Route path='/newclaim' element={<NewClaim/>}/>
      <Route path='/trackclaim' element={<TrackClaim/>}/>
      <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>      
      <Route path="/policy-details"element={<PolicyDetails />}/>
      <Route path="/admin-claims" element={<AdminClaims />}/>
      <Route path="/admin-claims/:id" element={<AdminClaimReview />} />
      <Route path="/admin-policies" element={<AdminPolicies/>} />
      <Route path="/admin-user-policies/:id" element={<AdminUserPolicyDetails />}/>
      <Route path="/admin-reports" element={<AdminReports />}/>
      <Route path="/admin-user-policies" element={<AdminUserPolicies />}/>
    
    </Routes>
    </>
  )
}

export default App
