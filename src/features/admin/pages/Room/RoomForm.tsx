
import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import Loading from "../../../../components/common/Loading";
import { createRoom, fetchBranches, fetchRoomById, updateRoom } from "../../../../store/admin/roomSlide";
import type { IBranchDto } from "../../../../store/admin/branchSlide";
import { FaSave } from "react-icons/fa";


const RoomForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const isEditing = !!id;
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { create: createError, update: updateError, fetchById: fetchByIdError } = useAppSelector((state) => state.admin.room.error);
    const selectedRoom = useAppSelector((state) => state.admin.room.selectedRoom);
  const { create: createLoading , update: updateLoading , fetchById: fetchByIdLoading , fetchBranches: fetchBranchesLoading } = useAppSelector((state) => state.admin.room.loadings);
const branches = useAppSelector((state) => state.admin.room.branches);
  useEffect(() => {
    if (isEditing) {
      dispatch(fetchRoomById(Number(id))); 
    }
    if(!branches) {
      dispatch(fetchBranches());
    }
  }, [isEditing, dispatch]);
  useEffect(() => {
    if(selectedRoom && isEditing && selectedRoom.id === Number(id)) {
      form.setFieldsValue(selectedRoom);
      form.setFieldValue("branchId", selectedRoom.branch.id);
    }
  }, [selectedRoom, isEditing, form]);

  const onFinish = async (values: any) => {
    if (isEditing) {
      await dispatch(updateRoom({ id: Number(id), roomData: values })).unwrap();

    } else {
        await dispatch(createRoom(values)).unwrap();
    }
    navigate(location.state?.from || "/admin/rooms");
    message.success(isEditing ? "Room updated successfully!" : "New room created successfully!");
  };

  const handleCancel = () => {
    navigate(location.state?.from || "/admin/rooms");
  };
if (isEditing && fetchByIdLoading) {
    return <Loading />;
  }
  return (
    <div className="h-screen container max-w-[43rem] mx-auto space-y-6">
      <div>
        <Button icon={<IoChevronBack />} onClick={handleCancel} className="hover:bg-gray-100 mb-4">
          Back
        </Button>
      </div>
      <div className="w-full p-6 bg-white rounded-md shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900 m-0">
              {isEditing ? "Edit Room" : "Add New Room"}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEditing
                ? "Update room information"
                : "Fill in the information to create a new room"}
            </p>
          </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
          name="roomForm"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="code"
            label="Room Code"
            required
            rules={[
              { required: true, message: "Please enter the room code!" },
              { min: 1, message: "Room code must be at least 1 character!" },
              { max: 10, message: "Room code cannot exceed 10 characters!" },
            ]}
          >
            <Input placeholder="e.g. A1, B2..." size="large" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Room Name"
            required
            rules={[
              { required: true, message: "Please enter the room name!" },
              { min: 3, message: "Room name must be at least 3 characters!" },
              { max: 100, message: "Room name cannot exceed 100 characters!" },
            ]}
          >
            <Input placeholder="e.g. Room A1" size="large" />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Capacity"
            required
            rules={[
              { required: true, message: "Please enter the capacity!" },
              { type: 'number', min: 1, max: 100, message: "Capacity must be between 1 and 100!" },
            ]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="e.g. 30" size="large" />
          </Form.Item>
          <Form.Item
            name="branchId"
            label="Branch"
            required
            
            rules={[{ required: true, message: "Please select a branch!" }]}
          >
            <Select disabled={fetchBranchesLoading} placeholder="Select branch" size="large">
                {branches && branches.map((branch: IBranchDto) => (
                    <Select.Option key={branch.id} value={branch.id}>
                        {branch.name}
                    </Select.Option>
                ))}
            </Select>
          </Form.Item>
            {createError || updateError  ? (
                <p className="text-red-500 text-sm mt-2">
                {isEditing ? updateError  : createError}
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
              className="bg-blue-600 hover:bg-blue-700 min-w-32"
              icon={<FaSave />}
              loading={createLoading || updateLoading}
            >
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RoomForm;
