import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { RequireAuth } from './components/RequireAuth';
import { FeedPage } from './pages/FeedPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { VenueProfilePage } from './pages/VenueProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyVenuesPage } from './pages/MyVenuesPage';
import { VenueFormPage } from './pages/VenueFormPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { MyProfilePage } from './pages/MyProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/venues/:id" element={<VenueProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/venues/mine"
            element={
              <RequireAuth>
                <MyVenuesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/venues/new"
            element={
              <RequireAuth>
                <VenueFormPage />
              </RequireAuth>
            }
          />
          <Route
            path="/venues/:id/edit"
            element={
              <RequireAuth>
                <VenueFormPage />
              </RequireAuth>
            }
          />
          <Route
            path="/posts/new"
            element={
              <RequireAuth>
                <CreatePostPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <MyProfilePage />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
