import { Image, Paper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const AdminImage = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  return (
    <Paper mt={mobile ? 20 : 100} >
      <Image w='100%' src="/img/dashboard.webp" />
    </Paper>
  );
};

export default AdminImage;
