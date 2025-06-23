import { 
  Route, 
  createBrowserRouter, 
  createRoutesFromElements, 
  RouterProvider,
  Outlet 
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import LogInPage from './pages/LogInPage';
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="explore" element={<Explore />} />
      <Route path="profile" element={<Profile />} />
      <Route path="profile/:id" element={<Profile />} />
      <Route path="edit-profile" element={<EditProfile />} />
      <Route path="login" element={<LogInPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const App = () => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <RouterProvider router={router}/>
      </ProfileProvider>
    </AuthProvider>
  );
};

export default App;