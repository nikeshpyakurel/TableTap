import { RouterProvider } from "react-router-dom";
import router from "./route";
import { ToastContainer } from "react-toastify";

const App = () => {
  // const isMobile = useMediaQuery("(max-width: 400px)");
  return (
    <>
      <ToastContainer />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
