import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import { axiosInstance } from './lib/axios'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import LoadingIcons from 'react-loading-icons'
import toast, { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore'


const App=()=>{
  
   const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore()
   const {theme}=useThemeStore()
   console.log({onlineUsers});
   useEffect(()=>{
    checkAuth()
   },[checkAuth])
   console.log({authUser});

   if(isCheckingAuth && !authUser)
    return (
<div className='flex items-center justify-center h-screen'>
<LoadingIcons.TailSpin stroke="#98ff98" strokeOpacity={1} speed={.75} />

<p>Loading...</p>
</div>
    )
   
  
   
  return (
    <div data-theme={theme}>
      
      
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/>: <Navigate to="/login"/>}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/>: <Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/>: <Navigate to="/"/>}/>
        <Route path='/settings' element={<SettingPage/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
      </Routes>
      <Toaster />
    </div>
  )
}
export default App