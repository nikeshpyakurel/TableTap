import {
    Accordion,
    AccordionItem,
    AccordionControl,
    AccordionPanel,
    Center,
    Group,
    Text,
  } from "@mantine/core";
  import { CiSearch } from "react-icons/ci";
  import { useQuery } from "@tanstack/react-query";
  import { axiosPrivateInstance } from "../../api";
  import { getFaq } from "../../api/website";
  
  const FAQ = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["faq"],
      queryFn: async () => {
        const response = await axiosPrivateInstance.get(getFaq);
        return response.data;
      },
    });
  
    return (
      <div style={{ maxWidth: 800, margin: "auto", padding: "40px 20px" }}>
        <Text
          c="#262338"
          size="37px"
          lts="2.89px"
          fw={600}
          lh="100%"
          ta="center"
          mb={30}
        >
          Got Questions? We've Got Answers!
        </Text>
  
        <Center>
          <Text
            size="13px"
            lh="22px"
            lts="0.25px"
            fw={600}
            c="#4E4B66"
            ta="center"
            mb={50}
            maw={550}
          >
            Explore our FAQs to get the clarity you need on how iTrady works and
            how you can make the most of our platform.
          </Text>
        </Center>
  
        {isLoading ? (
          <Text ta="center">Loading FAQs...</Text>
        ) : error ? (
          <Text ta="center" c="red">
            Failed to load FAQs.
          </Text>
        ) : (
          <Accordion variant="separated">
            {data?.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                style={{
                  background: "none",
                  border: "1px solid #E6E8EC",
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <AccordionControl>
                  <Group>
                    <CiSearch size={20} />
                    <Text fw={600} lh="22px" lts="0.25px" c="#4E4B66">
                      {faq.question}
                    </Text>
                  </Group>
                </AccordionControl>
                <AccordionPanel>
                  <Text size="13px" lh="22px" lts="0.25px" c="#6E7191">
                    {faq.answer}
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    );
  };
  
  export default FAQ;
  