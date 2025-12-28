import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Input,
  PasswordInput,
  Paper,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useState } from "react";
import { axiosPrivateInstance } from "../../api";
import {
  updateCoverPic,
  updatePasswordApi,
  updatePhoto,
  updateUserInfoApi,
} from "../../api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const BaseDemo = () => {
  interface FormData {
    profilePhoto: File | null;
    coverPhoto: File | null;
  }

  const [formData, setFormData] = useState<FormData>({
    profilePhoto: null,
    coverPhoto: null,
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleFile = (files: File[], type: "profile" | "cover") => {
    const file = files[0];
    if (type === "profile") {
      setFormData((prev) => ({ ...prev, profilePhoto: file }));
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, coverPhoto: file }));
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const uploadRestaurantPhoto = async () => {
    if (!formData.profilePhoto) {
      throw new Error("No profile photo selected");
    }
    const photo = new FormData();
    photo.append("photo", formData.profilePhoto);
    const response = await axiosPrivateInstance.patch(updatePhoto, photo, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const uploadCoverPhoto = async () => {
    if (!formData.coverPhoto) {
      throw new Error("No cover photo selected");
    }
    const photo = new FormData();
    photo.append("photo", formData.coverPhoto);
    const response = await axiosPrivateInstance.patch(updateCoverPic, photo, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const queryClient = useQueryClient();

  const { mutate: updateProfilePhoto, isPending: isProfilePending } =
    useMutation({
      mutationKey: ["update-profile-photo"],
      mutationFn: uploadRestaurantPhoto,
      onSuccess: () => {
        toast.success("Profile photo updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["userinfo"],
          refetchType: "active",
        });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update profile photo");
      },
    });

  const { mutate: updateCoverPhoto, isPending: isCoverPending } = useMutation({
    mutationKey: ["update-cover-photo"],
    mutationFn: uploadCoverPhoto,
    onSuccess: () => {
      toast.success("Cover photo updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["userinfo"],
        refetchType: "active",
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update cover photo");
    },
  });

  return (
    <Box>
      <Paper radius="md" bg="#EDF2F6">
        <Flex gap={50}>
          <Dropzone
            p={10}
            onDrop={(files) => handleFile(files, "profile")}
            maxSize={5 * 1024 ** 2}
            accept={["image/*"]}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "1px dashed #878787",
            }}
          >
            <Group justify="center" h={120}>
              <Flex direction="column" align="center">
                {profilePreview ? (
                  <Image
                    src={profilePreview}
                    alt="Profile Preview"
                    height={100}
                    width={100}
                  />
                ) : (
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Upload your Profile photo
                  </Text>
                )}
              </Flex>
            </Group>
          </Dropzone>

          <Dropzone
            p={10}
            onDrop={(files) => handleFile(files, "cover")}
            maxSize={5 * 1024 ** 2}
            accept={["image/*"]}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "1px dashed #878787",
            }}
          >
            <Group justify="center" h={120}>
              <Flex direction="column" align="center">
                {coverPreview ? (
                  <Image
                    src={coverPreview}
                    alt="Cover Preview"
                    height={100}
                    width={100}
                  />
                ) : (
                  <Text size="sm" c="dimmed" inline mt={7}>
                    Upload your Cover photo
                  </Text>
                )}
              </Flex>
            </Group>
          </Dropzone>
        </Flex>
      </Paper>
      <Flex gap={50} mt={20}>
        <Button loading={isProfilePending} onClick={() => updateProfilePhoto()}>
          Update Profile Photo
        </Button>
        <Button loading={isCoverPending} onClick={() => updateCoverPhoto()}>
          Update Cover Photo
        </Button>
      </Flex>
    </Box>
  );
};

const Setting = () => {
  const location = useLocation();
  const queryClient = useQueryClient();

  const [updateUserInfo, setUpdateUserInfo] = useState({
    name: location.state?.userInfo?.restaurant?.name || "",
    address: location.state?.userInfo?.restaurant?.address || "",
    phone: location.state?.userInfo?.restaurant?.phone
      ? parseInt(location.state?.userInfo?.restaurant?.phone, 10)
      : "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const uploadUserInfo = async () => {
    const response = await axiosPrivateInstance.patch(updateUserInfoApi, {
      name: updateUserInfo.name,
      address: updateUserInfo.address,
      phone: Number(updateUserInfo.phone),
    });
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-user-info"],
    mutationFn: uploadUserInfo,
    onSuccess: () => {
      toast.success("User info updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["userinfo"],
        refetchType: "active",
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user info");
    },
  });

  const { mutate: updatePasswordMutation, isPending: isPendingPassword } =
    useMutation({
      mutationKey: ["update-password"],
      mutationFn: async () => {
        const response = await axiosPrivateInstance.patch(updatePasswordApi, {
          oldPassword: String(oldPassword),
          newPassword: String(newPassword),
        });
        return response.data;
      },
      onSuccess: () => {
        toast.success("Password updated successfully");
        setPasswordError(""); // Clear any previous error
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update password");
      },
    });

  const handlePasswordUpdate = () => {
    if (newPassword !== newPasswordConfirm) {
      setPasswordError("New password and confirmed password do not match");
      return;
    }
    setPasswordError(""); // Clear the error if validation passes
    updatePasswordMutation();
  };

  return (
    <Box>
      <Title size="h3" c="#ff6347">
        Settings
      </Title>
      <Tabs defaultValue="messages">
        <Tabs.List>
          <Tabs.Tab value="gallery">Profile Setting</Tabs.Tab>
          <Tabs.Tab value="messages">Login Setting</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="gallery">
          <Text my={16} c="dimmed">
            Your Profile Picture
          </Text>
          <BaseDemo />

          <Divider mt={20} />

          <Box mt={30}>
            <Flex direction="column" gap="md">
              <Flex direction="column">
                <Text>Full Name</Text>
                <Input
                  placeholder="Please enter your full name"
                  value={updateUserInfo.name}
                  onChange={(e) =>
                    setUpdateUserInfo({
                      ...updateUserInfo,
                      name: e.target.value,
                    })
                  }
                />
              </Flex>

              <Flex direction="column">
                <Text>Address</Text>
                <Input
                  placeholder="Please enter your address"
                  value={updateUserInfo.address}
                  onChange={(e) =>
                    setUpdateUserInfo({
                      ...updateUserInfo,
                      address: e.target.value,
                    })
                  }
                />
              </Flex>

              <Flex direction="column">
                <Text>Phone Number</Text>
                <Input
                  placeholder="Please enter your phone number"
                  value={updateUserInfo.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!isNaN(Number(value))) {
                      setUpdateUserInfo({
                        ...updateUserInfo,
                        phone: Number(value),
                      });
                    } else {
                      toast.error("Phone number must be numeric");
                    }
                  }}
                />
              </Flex>
            </Flex>
            <Button mt={12} onClick={() => mutate()} loading={isPending}>
              Update Profile
            </Button>
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="messages">
          <Box p={20}>
            <Paper p={10}>
              <Text size="xl" c="#878787" mt={10}>
                Password
              </Text>

              <Box my={20}>
                <Flex direction="column" gap="md">
                  <Text c="#878787">Old password</Text>
                  <PasswordInput
                    placeholder="Please enter your old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />

                  <Text c="#878787">New password</Text>
                  <PasswordInput
                    placeholder="Please enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <Text c="#878787">Confirm new password</Text>
                  <PasswordInput
                    placeholder="Please enter your new password again"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  />
                  {passwordError && (
                    <Text c="red" size="sm">
                      {passwordError}
                    </Text>
                  )}
                </Flex>
                <Button
                  type="submit"
                  mt={20}
                  onClick={handlePasswordUpdate}
                  loading={isPendingPassword}
                >
                  Update
                </Button>
              </Box>
            </Paper>
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};
export default Setting;
