// hooks/useMenuNavigation.ts
import { useNavigate } from "react-router-dom";
import useMenuInfo from "../context/store";


const useMenuNavigation = () => {
  const navigate = useNavigate();
  const { restaurantId, tableId } = useMenuInfo();

  const goTo = (path: string) => {
    if (!restaurantId || !tableId) {
      console.warn("Missing restaurantId or tableId");
      return;
    }
    navigate(`${path}?restaurant=${restaurantId}&table=${tableId}`);
  };

  return goTo;
};

export default useMenuNavigation;
