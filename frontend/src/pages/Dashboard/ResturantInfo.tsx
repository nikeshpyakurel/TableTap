import { SimpleGrid, Text } from "@mantine/core";
import ResturantInfoCard from "./ResturantInfoCard";

import { IoCartOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { MdTableBar } from "react-icons/md";

export default function ResturantInfo({ data }) {
  return (
    <>
      <Text fz={18} fw={"bold"} c={"#3b3b3b"}>
        Restaurant
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt={20}>
        <ResturantInfoCard
          title="Product"
          data={data?.product}
          icon={<IoCartOutline size={40} color="#FF6347" />}
        />
        <ResturantInfoCard
          title="Category"
          data={data?.category}
          icon={<BiCategory size={40} color="#FF6347" />}
        />
        <ResturantInfoCard
          title="Table"
          data={data?.table}
          icon={<MdTableBar size={40} color="#FF6347" />}
        />
      </SimpleGrid>
    </>
  );
}
