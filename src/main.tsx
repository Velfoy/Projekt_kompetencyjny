import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
//layouts
import {MainLayout} from '@layouts/index'
//pages
import Home from '@pages/Home';
import UserPage from '@pages/UserPage';


const router=createBrowserRouter([{
  path:"/",
  element:<MainLayout />,
  children:[
    {
      index:true,
      element:<Home/>,
    },
    {
      path:"userpage",
      element:<UserPage></UserPage>
    },
  ],
}])
createRoot(document.getElementById('root')!).render(<RouterProvider router={router}></RouterProvider>);
