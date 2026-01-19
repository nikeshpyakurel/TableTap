import { Center, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";

const SmallScreen = () => {

    const isTabletOrSmaller = useMediaQuery("(max-width: 768px)");
    const [isClient, setIsClient] = useState(false); 

    useEffect(() => {
        setIsClient(true);
      }, []);

      if(!isClient){
        return null
      }
  return (
    <div>
        {
            isTabletOrSmaller && (
                <Center mih="100vh">
                <Title size={40} ta="center" c="red">
                  Sorry, This content is visible on small screens
                </Title>
              </Center>
            )
        }
      
    </div>
  )
}

export default SmallScreen
