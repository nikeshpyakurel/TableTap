import { Modal, Button, Text, Group } from "@mantine/core";

interface ConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading: boolean;
}

const ConfirmModal = ({
  opened,
  onClose,
  onConfirm,
  title,
  loading,
}: ConfirmModalProps) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Action" centered>
      <Text>{title}</Text>
      <Group mt="md">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm} loading={loading}>
          Confirm
        </Button>
      </Group>
    </Modal>
  );
};

export default ConfirmModal;
