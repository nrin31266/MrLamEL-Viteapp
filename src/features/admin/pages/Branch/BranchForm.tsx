import { Button, Form, Input, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  fetchBranchById,
  createBranch,
  updateBranch,
} from "../../../../store/admin/branchSlide";
import Loading from "../../../../components/common/Loading";

const BranchForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const {
    fetchById: fetchByIdLoading,
    create: createLoading,
    update: updateLoading,
  } = useAppSelector((state) => state.admin.branch.loadings);
  const {
    fetchById: fetchByIdError,
    create: createError,
    update: updateError,
  } = useAppSelector((state) => state.admin.branch.error);
  const selectedBranch = useAppSelector(
    (state) => state.admin.branch.selectedBranch
  );
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchBranchById(Number(id)));
    }
  }, [id, dispatch, isEditing]);

  useEffect(() => {
    if (selectedBranch && isEditing) {
      form.setFieldsValue(selectedBranch);
    }
  }, [selectedBranch, form, isEditing]);

  const onFinish = async (values: {
    name: string;
    address: string;
    phone: string;
  }) => {
    if (isEditing && id) {
      await dispatch(
        updateBranch({ id: Number(id), branchData: values })
      ).unwrap();
      message.success("Branch updated successfully!");
    } else {
      await dispatch(createBranch(values)).unwrap();
      message.success("New branch added successfully!");
    }
    navigate("/admin/branches");
  };

  const handleCancel = () => {
    navigate("/admin/branches");
  };

  if (isEditing && fetchByIdLoading) {
    return <Loading />;
  }

  const loading = isEditing ? updateLoading : createLoading;

  return (
    <div className="h-screen container max-w-[43rem] mx-auto space-y-6">
      {/* Header */}
      <div>
        <Button
          icon={<IoChevronBack />}
          onClick={handleCancel}
          className="hover:bg-gray-100"
        >
          Back
        </Button>
      </div>

      {/* Form */}
      <div className="w-full p-6 bg-white rounded-md shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900 m-0">
              {isEditing ? "Edit Branch" : "Add New Branch"}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEditing
                ? "Update branch information"
                : "Fill in the information to create a new branch"}
            </p>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Branch Name"
            required
            rules={[
              { required: true, message: "Please enter branch name!" },
              { min: 3, message: "Branch name must be at least 3 characters!" },
              {
                max: 100,
                message: "Branch name cannot exceed 100 characters!",
              },
            ]}
          >
            <Input placeholder="e.g: District 1 Branch" size="large" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[
              { required: true, message: "Please enter address!" },
              { min: 10, message: "Address must be at least 10 characters!" },
            ]}
          >
            <Input placeholder="Enter full branch address..." />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            required
            rules={[
              { required: true, message: "Please enter phone number!" },
              {
                pattern: /^[0-9\-\s\+\(\)]+$/,
                message: "Invalid phone number format!",
              },
            ]}
          >
            <Input placeholder="e.g: 028-1234-5678" size="large" />
          </Form.Item>
          {createError || updateError ? (
            <p className="text-red-500 text-sm mt-2">
              {isEditing ? updateError : createError}
            </p>
          ) : null}
          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 gap-4 border-gray-200">
            <Button size="large" onClick={handleCancel} className="min-w-24">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700 min-w-32"
              icon={<FaSave />}
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update"
                : "Save"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default BranchForm;
