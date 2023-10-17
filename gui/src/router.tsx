import {createHashRouter, useNavigate} from "react-router-dom";
import MainSearch from './pages/MainSearch';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ParkingInfo from "./pages/ParkingInfo";
import CheckoutSummary from "./pages/CheckoutSummary";
import ErrorPage from "./pages/ErrorPage";
import CreateParking from "./pages/CreateParking";
import SearchResult, {loader as searchLoader} from './pages/SearchResult';
import {useEffect} from "react";

const authorize = ({params}) => {
  const userId = window.localStorage.getItem('currentUser');
  if (parseInt(userId) <= 0) {
    return Promise.reject(Error("Unathorized"))
  }
  return Promise.resolve(null);
};

const Redirect = ({to}: {to: string}) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return <></>;
};

const router = createHashRouter([
  {
    path: "/",
    element: <MainSearch/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
    loader: authorize,
    errorElement: <Redirect to={'/login'}/>
  },
  {
    path: "/create-parking",
    element: <CreateParking/>,
    loader: authorize
  },
  {
    path: "/create-parking/:id",
    element: <CreateParking/>,
    loader: async ({params}) => {
      const id = parseInt(params.id);
      if (id >= 0) {
        await authorize({params})
        return id;
      }
      throw Error("Invalid id in URL");
    },
  },
  {
    path: "/error",
    element: <ErrorPage/>,
  },
  {
    path: "/search",
    element: <SearchResult/>,
    loader: searchLoader
  },
  {
    path: "/slot/:id",
    loader: ({params}) => {
      const id = parseInt(params.id);
      if (id >= 0) {
        return Promise.resolve(id);
      }
      return Promise.reject(Error("Invalid id in URL"));
    },
    element: <ParkingInfo/>
  },
  {
    path: "/checkout/:id",
    loader: ({params}) => {
      const id = parseInt(params.id);
      if (id >= 0) {
        return Promise.resolve(id);
      }
      return Promise.reject(Error("Invalid id in URL"));
    },
    element: <CheckoutSummary/>
  }
]);

export default router;
