import { Drawer } from "@mantine/core";
import { Sidebar } from "./Sidebar";

export const CategoryDrawer = ({
  drawer,
  closeDrawer,
  data,
  styles,
  setSelectedCategory,
  isLoading,
  isMobile,
}) => (
  <Drawer opened={drawer} onClose={closeDrawer} title="Categories">
    <Sidebar
      closeDrawer={closeDrawer}
      data={data}
      styles={styles}
      setSelectedCategory={setSelectedCategory}
      isLoading={isLoading}
      isMobile={isMobile}
    />
  </Drawer>
);
