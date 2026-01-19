import {
  Button,
  Center,
  Flex,
  Group,
  Image,
  Input,
  Loader,
  Modal,
  Paper,
  Table,
  Text,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosPrivateInstance } from "../../api";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdQrCode } from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { toast } from "react-toastify";
import ProtectComponent from "../../route/ProtectComponent";
import { PermissionType } from "../../type";

const TablePage = () => {
  const queryClient = useQueryClient();
  const [openTable, { open: openTableModal, close: closeTableModal }] =
    useDisclosure(false);
  const [openEdit, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [openDelete, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [openQR, { open: openQrModal, close: closeQrModal }] =
    useDisclosure(false);
  const [qrImg, setQrImg] = useState("");
  const [name, setName] = useState("");
  const [newTableName, setNewTableName] = useState("");
  const [tableId, setTableId] = useState<string | null>(null);

  async function fetchTable() {
    const res = await axiosPrivateInstance.get("/table");
    return res.data;
  }
  async function createTableapi() {
    if (newTableName === "") {
      throw new Error("Table name cannot be empty");
    }
    const res = await axiosPrivateInstance.post("/table", {
      name: newTableName,
    });
    return res.data;
  }
  async function deleteTableapi() {
    const res = await axiosPrivateInstance.delete(`/table/${tableId}`);
    return res.data;
  }
  async function updateTableapi() {
    const res = await axiosPrivateInstance.patch(`/table/${tableId}`, {
      name: newTableName,
    });
    return res.data;
  }

  const { mutate: deleteMutate, isPending: isPendingDelete } = useMutation({
    mutationFn: () => deleteTableapi(),
    onSuccess: () => {
      toast.success("Table deleted");
      queryClient.invalidateQueries({ queryKey: ["table"] });
      closeDeleteModal();
    },
    mutationKey: ["table"],
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
    },
  });

  const { mutate: editMutate, isPending: isPendingEdit } = useMutation({
    mutationFn: () => updateTableapi(),
    onSuccess: () => {
      toast.success("Table updated");
      queryClient.invalidateQueries({ queryKey: ["table"] });
      closeEditModal();
    },
    mutationKey: ["table"],
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => createTableapi(),
    onSuccess: () => {
      toast.success("Table created");
      queryClient.invalidateQueries({ queryKey: ["table"] });
      setNewTableName(""); // Reset the input after successful creation
      closeTableModal();
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["table"],
    queryFn: fetchTable,
  });

  const handleOpenTableModal = () => {
    setNewTableName(""); // Reset the input field when opening the Add Table modal
    openTableModal();
  };

  const deleteModalOpen = (id: string) => {
    setTableId(id);
    openDeleteModal();
  };

  const editModalOpen = (id: string, tableName: string) => {
    setTableId(id);
    setNewTableName(tableName);
    openEditModal();
  };

  const qrModalOpen = (qr: string, name: string) => {
    setName(name);
    setQrImg(qr);
    openQrModal();
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrImg;
    link.download = `${name}.png`;
    link.click();
  };

  const headers = ["Sn", "Name", "Edit"];

  if (isLoading) {
    return (
      <Center style={{ height: "80vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Flex justify="space-between" mb={20}>
        <Text size="xl">Total Table:</Text>
        <ProtectComponent requiredPermission={PermissionType.CREATE_TABLE}>
          <Button size="md" color="orange" onClick={handleOpenTableModal}>
            Add Table
          </Button>
        </ProtectComponent>
      </Flex>
      <Paper bg="white" p={20} mt={0} shadow="md" radius="md">
        {isLoading ? (
          <Center style={{ height: "80vh" }}>
            <Loader size="xl" />
          </Center>
        ) : (
          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {headers.map((header) => (
                  <Table.Th key={header}>{header}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {data?.length > 0 ? (
                data.map((item: any, index: number) => (
                  <Table.Tr key={index}>
                    <Table.Td>{index + 1}</Table.Td>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>
                      <Group>
                        <ProtectComponent
                          requiredPermission={PermissionType.UPDATE_TABLE}
                        >
                          <FaRegEdit
                            size={25}
                            cursor={"pointer"}
                            onClick={() => editModalOpen(item.id, item.name)}
                            color="blue"
                          />
                        </ProtectComponent>
                        <ProtectComponent
                          requiredPermission={PermissionType.DELETE_TABLE}
                        >
                          <MdDelete
                            size={25}
                            cursor={"pointer"}
                            onClick={() => deleteModalOpen(item.id)}
                            color="red"
                          />
                        </ProtectComponent>
                        <MdQrCode
                          size={25}
                          cursor={"pointer"}
                          onClick={() => qrModalOpen(item.qr, item.name)}
                        />
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={headers.length}>
                    <Text ta="center">No table found</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        )}
      </Paper>

      <Modal opened={openTable} onClose={closeTableModal} title="Add Table">
        <Flex direction="column" gap={20}>
          <Input
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="Table Name"
            size="md"
            width={"100%"}
            leftSection={<MdQrCode size={25} />}
          />
          <Button loading={isPending} onClick={() => mutate()}>
            Create
          </Button>
        </Flex>
      </Modal>

      <Modal opened={openEdit} onClose={closeEditModal} title="Edit Table">
        <Flex direction="column" gap={20}>
          <Input
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="Table Name"
            size="md"
            width={"100%"}
            leftSection={<MdQrCode size={25} />}
          />
          <Button loading={isPendingEdit} onClick={() => editMutate()}>
            Update
          </Button>
        </Flex>
      </Modal>

      <Modal opened={openQR} onClose={closeQrModal} title="View Qr code">
        <Center>
          <Image src={qrImg} width={300} height={300} />
        </Center>
        <Center>
          <Button onClick={downloadQR}>Download</Button> &nbsp;&nbsp;&nbsp;
          <Button onClick={closeQrModal}>Close</Button>
        </Center>
      </Modal>

      <Modal
        opened={openDelete}
        onClose={closeDeleteModal}
        title="Delete Table"
      >
        <Text>Are you sure you want to delete this table?</Text>
        <Text size="xs" c={"#999"}>
          If you delete this table, all the data associated with it like orders
          will be deleted.
        </Text>
        <br />
        <Flex gap={50}>
          <Button
            bg={"red"}
            onClick={() => deleteMutate()}
            loading={isPendingDelete}
          >
            Delete
          </Button>
          <Button onClick={closeDeleteModal}>Cancel</Button>
        </Flex>
      </Modal>
    </>
  );
};

export default TablePage;
