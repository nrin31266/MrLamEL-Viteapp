import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  message,
  type UploadFile,
  DatePicker,
  Upload,
  type UploadProps,
} from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getRole } from "./UserManagement";
import { uploadAntDImage } from "../../../firebase/uploadImage";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { createUser, fetchUserById, updateUser } from "../../../../store/admin/userManagement";
import Loading from "../../../../components/common/Loading";
import dayjs from "dayjs";

const AddUser: React.FC = () => {
  const { role, id } = useParams<{ role: string; id: string }>();

  const isEditing = !!id;
  const mappedRole = getRole(role);
  if (!mappedRole) {
    return null;
  }
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const {
    create: createLoading,
    update: updateLoading,
    fetchById: fetchByIdLoading,
  } = useAppSelector((state) => state.admin.userManagement.loadings);
  const {
    create: createError,
    update: updateError,
    fetchById: fetchByIdError,
  } = useAppSelector((state) => state.admin.userManagement.errors);
  const dispatch = useAppDispatch();
  const loading = updateLoading || createLoading || isUploading;
  const location = useLocation();
  const selectedUser = useAppSelector(
    (state) => state.admin.userManagement.selectedUser
  );
  useEffect(() => {
    if (selectedUser && isEditing && selectedUser.id === Number(id)) {
        // dob 2005-09-15, need to convert to 15/09/2005
      form.setFieldsValue({
        ...selectedUser,
        dob: selectedUser.dob ? dayjs(selectedUser.dob, "YYYY-MM-DD") : null,
      });
      if (selectedUser.avatarUrl) {
        setFileList([
          {
            uid: selectedUser.avatarUrl,
            url: selectedUser.avatarUrl,
            name: selectedUser.avatarUrl,
            status: "done",
            thumbUrl: selectedUser.avatarUrl,
          },
        ]);
      }
    }
  }, [selectedUser]);
   useEffect(() => {
    form.setFieldsValue({ role: mappedRole.role });
  }, [mappedRole]);
  useEffect(() => {
    if (isEditing) {
      dispatch(fetchUserById(Number(id)))
        .unwrap()
    }
  }, [dispatch]);
  const uploadProps: UploadProps = {
    beforeUpload: (file: any) => {
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          originFileObj: file,
          thumbUrl: URL.createObjectURL(file),
        },
      ]);
      return false;
    },
    fileList,
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    accept: ".png, .jpg, .jpeg",
    maxCount: 1,
    listType: "picture-card",
  };

  const onFinish = async (values: any) => {
    try {
      if (mappedRole.role === "TEACHER" && fileList.length === 0) {
        message.error("Please upload an avatar!");
        return;
      }
      if (fileList.length !== 0) {
        setIsUploading(true);
        const avatarUrl = await uploadAntDImage(fileList[0]);
        values.avatarUrl = avatarUrl;
        setFileList((prev) => [
          {
            ...prev[0],
            url: avatarUrl,
          },
        ]);
      }
    } catch (error) {
      message.error("Failed to upload avatar!");
      return;
    } finally {
      setIsUploading(false);
    }
    console.log("Form Values:", { ...values, role: mappedRole });
    if (isEditing) {
      await dispatch(
        updateUser({
          id: Number(id),
          userData: { ...values },
        })
      ).unwrap();
    } else {
      await dispatch(createUser({ ...values })).unwrap();
    }
    message.success(
      isEditing
        ? "User updated successfully!"
        : "New user created successfully!"
    );
    navigate(
      !isEditing
        ? `/admin/users/${role}`
        : location.state?.from || `/admin/users/${role}`
    );
  };

 
  if (fetchByIdLoading) return <Loading />;
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? "Edit" : "Add"} {mappedRole.label}
      </h2>
      <Form
        size="large"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
        initialValues={{
          remember: true,
          status: "OK", // Set initial value for status here
        }}
        requiredMark={false}
        name="userForm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter the full name!" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter the phone number!" },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full"
              picker="date"
              placeholder="Select date or type (DD/MM/YYYY)"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1  gap-4">
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter the address!" }]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="OK">OK</Select.Option>
              <Select.Option value="BANNED">BANNED</Select.Option>
              <Select.Option value="EXPIRED">EXPIRED</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Role is required!" }]}
          >
            <Select disabled>
              <Select.Option value={mappedRole.role}>
                {mappedRole.label}
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select the gender!" }]}
          >
            <Select placeholder="Select gender">
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
              <Select.Option value="OTHER">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Active"
            name="active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </div>

        <Form.Item
          label="Avatar"
          name="avatarUrl"
          rules={[
            {
              validator: (_, value) =>
                mappedRole.role === "TEACHER" && fileList.length === 0
                  ? Promise.reject(new Error("Please upload an avatar!"))
                  : Promise.resolve(),
            },
          ]}
        >
          <Upload {...uploadProps}>
            <span className="text-gray-500">
              {fileList.length > 0 ? "Change Avatar" : "Upload Avatar"}
            </span>
          </Upload>
        </Form.Item>
        {createError || updateError || fetchByIdError ? (
          <p className="error">
            {isEditing ? updateError : createError || fetchByIdError}
          </p>
        ) : null}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            {isEditing ? "Update User" : "Add User"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddUser;
