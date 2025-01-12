import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import { isJsonString } from './utils';
import { jwtDecode } from 'jwt-decode';
import * as UserService from "./services/UserService";
import { useDispatch, useSelector } from 'react-redux';
import { resetUser, updateUser } from './redux/slides/userSlide';


function App() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const { decoded, storageData } = handleDecoded();
    if (decoded && storageData) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token');
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    // Do something before request is sent
    const currentTime = new Date().getTime() / 1000;
    const { decoded } = handleDecoded();
    let storageRefreshToken = localStorage.getItem('refresh_token');
    const refreshToken = JSON.parse(storageRefreshToken);
    const decodedRefreshToken = jwtDecode(refreshToken);
    if (decoded?.exp < currentTime) {
      if (decodedRefreshToken?.exp > currentTime) {
        const data = await UserService.refresh_token(refreshToken);
        localStorage.setItem('access_token', JSON.stringify(data?.access_token));
        config.headers['token'] = `Bearer ${data?.access_token}`;
      } else {
        dispatch(resetUser());
      }
    }

    return config;
  }, (err) => {
    return Promise.reject(err);
  });

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token');
    const refreshToken = JSON.parse(storageRefreshToken);
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, refresh_token: refreshToken }));
  }

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            const isCheckAuth = !route.isPrivate || user.isAdmin;
            const Layout = route.isShowHeader ? DefaultComponent : React.Fragment
            return <Route key={index} path={isCheckAuth ? route.path : undefined} element={
              <Layout>
                <route.page />
              </Layout>
            } />
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App;
