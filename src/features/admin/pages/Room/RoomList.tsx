import React, { useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Tooltip,
  Modal,
  message,
  Input,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  deleteRoom,
  fetchBranches,
  fetchRooms,
  fetchRoomsByBranch,
  type IRoomDto,
} from "../../../../store/admin/roomSlide";
import type { ColumnProps } from "antd/es/table";

const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const dispatch = useAppDispatch();
  const { fetch: fetchLoading } = useAppSelector(
    (state) => state.admin.room.loadings
  );
  const branches = useAppSelector((state) => state.admin.room.branches);
  const rooms = useAppSelector((state) => state.admin.room.data);

  useEffect(() => {
    if (!branchId) {
      dispatch(fetchRooms());
    } else {
      dispatch(fetchRoomsByBranch(Number(branchId)));
    }
    if (!branches) {
      dispatch(fetchBranches());
    }
  }, [dispatch, branchId]);

  const handleEdit = (record: IRoomDto) => {
    console.log(record);
    navigate(`/admin/rooms/edit/${record.id}`, {
      state: { from: location.pathname + location.search },
    });
  };

  const handleDelete = (record: IRoomDto) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete room "${record.name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        return dispatch(deleteRoom(record.id))
          .unwrap()
          .then(() => message.success("Room deleted successfully!"))
          .catch(() => message.error("Failed to delete room!"));
      },
    });
  };
  const changeBranch = (value: number) => {
    value === 0
      ? navigate("/admin/rooms")
      : navigate(`/admin/rooms/branches/${value}`);
  };

  const columns: ColumnProps<IRoomDto>[] = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: 70,
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Branch",
      dataIndex: ["branch", "name"],
      key: "branch",
      render: (_: any, record: IRoomDto) => (
        <Tag color="blue">{record.branch?.name}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (record: IRoomDto) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<FaEdit size={20} />}
              onClick={() => handleEdit(record)}
              className="!text-blue-600 hover:!bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<MdDeleteOutline size={20} />}
              onClick={() => handleDelete(record)}
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredRooms = rooms || [];

  return (
    <div className="space-y-6 flex flex-col">
      <div className="shadow-sm sticky top-2 z-50 bg-white p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 m-0">
              Room Management
            </h2>
            <p className="text-gray-500 mt-1">Manage all rooms in branches</p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              size="large"
              placeholder="Select a branch"
              value={Number(branchId) || 0}
              style={{ width: 300 }}
              onChange={(value: number) => changeBranch(value)}
            >
              <Select.Option value={0}>All Branches</Select.Option>
              {branches &&
                branches.map((branch) => (
                  <Select.Option key={branch.id} value={branch.id}>
                    {branch.name}
                  </Select.Option>
                ))}
            </Select>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate("/admin/rooms/create", {
                  state: { from: location.pathname + location.search },
                })
              }
              size="large"
            >
              Add New Room
            </Button>
          </div>
        </div>
      </div>
      <div className="shadow-sm bg-white p-6 rounded-md">
        <Table
          columns={columns}
          dataSource={filteredRooms}
          rowKey="code"
          // loading={fetchLoading}
          pagination={{
            total: filteredRooms.length,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} rooms`,
          }}
          className="ant-table-striped"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-gray-100" : "bg-white"
          }
        />
      </div>
    </div>
  );
};

export default RoomList;
