import React, { useEffect } from 'react';
import {Routes, Route, Navigate} from "react-router-dom";
import {Toaster} from "react-hot-toast";

import HomePage from './page/HomePage.jsx';
import { LoginPage } from './page/LoginPage.jsx';
import { SignUpPage } from './page/SignUpPage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { Loader } from 'lucide-react';
import Profile from './page/Profile.jsx'
import Layout from './layout/Layout.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AddProblem from './page/AddProblem.jsx';
import ProblemPage from './page/ProblemPage.jsx';

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <div className='flex flex-col items-center justify-center'>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route
          index
          element={authUser ? <HomePage/> : <Navigate to={"/login"}/>}
          />
        </Route>

        <Route
        path='/login'
        element={!authUser ? <LoginPage/> : <Navigate to={"/"}/>}
        />

        <Route
        path='/signUp'
        element={!authUser ? <SignUpPage/> : <Navigate to={"/"}/>}
        />

        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" replace />}
        />

        <Route
        path='/problem/:id'
        element={authUser ? <ProblemPage/> : <Navigate to="/"/>}
        />

        <Route element={<AdminRoute/>}>
          <Route
            path='/add-problem'
            element={authUser ? <AddProblem/> : <Navigate to="/"/>}
          />
        </Route>

      </Routes>
    </div>
  )
}

export default App;