import { 
  Route, 
  createBrowserRouter, 
  createRoutesFromElements, 
  RouterProvider,
  Outlet 
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import LogInPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import Chat from './pages/Chat';
import ChatList from './pages/ChatList';
import NotFound from './pages/NotFound';

const MainLayout = () => {
  console.log('MainLayout is rendering');
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="explore" element={<Explore />} />
      <Route path="profile" element={<Profile />} />
      <Route path="profile/:id" element={<Profile />} />
      <Route path="edit-profile" element={<EditProfile />} />
      <Route path="chats" element={<ChatList />} />
      <Route path="chat" element={<Chat />} />
      <Route path="login" element={<LogInPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const App = () => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </AuthProvider>
  );
};

export default App;