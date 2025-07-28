import {
    PlusOutlined
} from "@ant-design/icons";
import {
    Button,
    Input,
    Modal,
    Space,
    Table,
    Tag,
    Tooltip,
    message
} from "antd";
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../../store/store";
import { fetchBranches, deleteBranch } from "../../../../store/admin/branchSlide";
import { FaRegEye } from "react-icons/fa";
interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  roomCount?: number;
}

const BranchList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [searchText, setSearchText] = useState("");
  const { fetch: fetchLoading, delete: deleteLoading } = useAppSelector((state) => state.admin.branch.loadings);
//   const { fetch: fetchError, delete: deleteError } = useAppSelector((state) => state.admin.branch.error);
  const branches = useAppSelector((state) => state.admin.branch.data);

 useEffect(() => {
 dispatch(fetchBranches());
}, [dispatch]);

  const handleEdit = (record: Branch) => {
    navigate(`/admin/branches/edit/${record.id}`);
  };

  const handleDelete = (record: Branch) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete branch "${record.name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      
      onOk() {
        return dispatch(deleteBranch(record.id)).unwrap()
          .then(() => {
            message.success("Branch deleted successfully!");
          })
          .catch(() => {
            message.error("Failed to delete branch!");
          });
      },
    });
  };

  const columns = [
    {
        title: "No.",
        dataIndex: "index",
        width: 70,
        key: "index",
        render: (_: any, __: any, index: number) => (
          <span>{index + 1}</span>
        ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Branch Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text: string) => (
        <div className="flex items-start space-x-2">
          <span className="text-gray-600">{text}</span>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => (
        <div className="flex items-center space-x-2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Rooms",
      dataIndex: "roomCount",
      key: "roomCount",
      render: (count: number, record: Branch) => (
        <div onClick={()=>{navigate(`/admin/rooms/branches/${record.id}`)}} className=" cursor-pointer">
          <Tag  color="blue" className="text-center !text-sm">
          {count || 0} rooms
        </Tag>
          
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (record: Branch) => (
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

  const filteredBranches = branches?.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchText.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchText.toLowerCase()) ||
      branch.phone.includes(searchText)
  ) || [];

  return (
    <div className="space-y-6 flex flex-col">
      {/* Header */}

      {/* Filters */}
      <div className="shadow-sm bg-white p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 m-0">
              Branch Management
            </h2>
            <p className="text-gray-500 mt-1">Manage all center branches</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate({ pathname: "/admin/branches/create" , search: `?from=${encodeURIComponent(location.pathname)}`})}
            size="large"
          >
            Add New Branch
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Input
            size="large"
              placeholder="Search by name, address or phone..."
              allowClear
              style={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Total:{" "}
            <span className="font-medium">{filteredBranches.length}</span>{" "}
            branches
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="shadow-sm bg-white p-6 rounded-md">
        <Table
          columns={columns}
          dataSource={filteredBranches}
          rowKey="id"
          loading={fetchLoading}
          pagination={{
            total: filteredBranches.length,
            // pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} branches`,
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

export default BranchList;

