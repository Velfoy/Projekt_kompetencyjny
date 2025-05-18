import { createBrowserRouter,RouterProvider } from 'react-router-dom';
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
const AppRouter =()=>{
    return (
        <RouterProvider router={router}></RouterProvider>
    );
}
export default AppRouter;