import { ParallaxProvider } from "react-scroll-parallax";
import Main from "./Page/Main";

const App = () => {
  return (
    <div>
      <ParallaxProvider>
        <Main />
      </ParallaxProvider>
    </div>
  );
};

export default App;
