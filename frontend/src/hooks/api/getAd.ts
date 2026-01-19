import { useQuery } from "@tanstack/react-query";
import { axiosPublicInstance } from "../../api";

export type AdSection = "home" | "cart" | "history";

const fetchAdData = async (section: AdSection) => {
  const response = await axiosPublicInstance.get(
    `/advertisement/find-by-adtype`,
    {
      params: {
        type: section,
      },
    }
  );
  return response.data;
};

const useGetAd = (section: AdSection) => {
  return useQuery({
    queryKey: ["adData", section],
    queryFn: () => fetchAdData(section),
    enabled: !!section,
  });
};

export default useGetAd;
