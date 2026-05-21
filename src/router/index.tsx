import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import DetailPage from "../pages/DetailPage";

export const router = createBrowserRouter([
   {
      path: '/',
      element: <HomePage />
   },
   {
      path: '/detail/:id',
      element: <DetailPage />
   }
])