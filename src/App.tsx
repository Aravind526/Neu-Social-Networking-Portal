import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { setUser, clearUser } from './redux/actions/userActions';
import { RootState } from './redux/store';
import "semantic-ui-css/semantic.min.css";

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Spinner from './components/UI/Spinner';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [dispatch]);
  
  if (isLoading) {
    return <Spinner message="Loading Application..." />;
  }

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/*" element={currentUser ? <Dashboard /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
