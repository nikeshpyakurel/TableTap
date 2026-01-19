import { Modal, Button, Image } from "@mantine/core";
import { useEffect, useState } from "react";
import useGetAd from "../../../hooks/api/getAd";

interface AdModalProps {
  opened: boolean;
  onClose: () => void;
}

const AdModal = ({ opened, onClose }: AdModalProps) => {
  const [isSkippable, setIsSkippable] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { data } = useGetAd("home");

  useEffect(() => {
    if (opened) {
      setIsSkippable(false);
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newCount = prev <= 1 ? 0 : prev - 1;
          if (newCount === 0) {
            clearInterval(timer);
            setIsSkippable(true);
          }
          return newCount;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [opened]);

  return (
    <Modal
      title="Ad"
      opened={opened}
      onClose={isSkippable ? onClose : () => {}}
      withCloseButton={isSkippable}
      centered
      radius="md"
      closeOnClickOutside={isSkippable}
      closeOnEscape={isSkippable}
      zIndex={1000}
    >
      <a
        href={
          data?.url?.startsWith("http://") || data?.url?.startsWith("https://")
            ? data.url
            : `https://${data?.url}`
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        {" "}
        <Image
          src={data?.image}
          alt="Ad Banner"
          radius="md"
          mb="md"
          height={200}
        />
      </a>
      <Button
        fullWidth
        disabled={!isSkippable}
        onClick={onClose}
        color="orange"
      >
        {isSkippable ? "Close Ad" : `Please wait (${countdown}s)...`}
      </Button>
    </Modal>
  );
};

export default AdModal;
