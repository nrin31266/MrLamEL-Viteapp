import React from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { useEffect } from "react";
import {
  fetchUsers,
  type IUserDto,
} from "../../../../store/admin/userManagement";
import UserControlPanel from "./components/UserControlPanel";
import type { ColumnProps, ColumnsType } from "antd/es/table";
import Table from "antd/es/table";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

export const getRole = (
  role: string | undefined
): { role: string; label: string } | undefined => {
  switch (role) {
    case "students":
      return { role: "STUDENT", label: "Student" };
    case "teachers":
      return { role: "TEACHER", label: "Teacher" };
    case "admins":
      return { role: "ADMIN", label: "Admin" };
    default:
      return undefined;
  }
};

const UserManagement = () => {
  const { role } = useParams();
  const userRole = getRole(role);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { errors, loadings, page } = useAppSelector(
    (state) => state.admin.userManagement
  );

  if (!userRole) return <Navigate to="/admin" replace />;
  const columns: ColumnsType<IUserDto> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone) =>
        phone || <span className="text-gray-400 italic">N/A</span>,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      render: (dob) =>
        dob ? (
          dayjs(dob).format("DD/MM/YYYY")
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const roleColors: Record<IUserDto["role"], string> = {
          ADMIN: "!bg-red-100 !text-red-600",
          TEACHER: "!bg-blue-100 !text-blue-600",
          STUDENT: "!bg-green-100 !text-green-600",
        };
        return (
          <Tag
            className={`${
              roleColors[role as "ADMIN" | "TEACHER" | "STUDENT"]
            } !border-0`}
          >
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusColor =
          status === "OK"
            ? "!bg-green-100 !text-green-600"
            : "!bg-gray-100 !text-gray-600";
        return <Tag className={`${statusColor} !border-0`}>{status}</Tag>;
      },
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => {
        const genderColors: Record<string, string> = {
          MALE: "!bg-blue-100 !text-blue-600",
          FEMALE: "!bg-pink-100 !text-pink-600",
          OTHER: "!bg-purple-100 !text-purple-600",
        };
        return gender ? (
          <Tag className={`${genderColors[gender]} !border-0`}>{gender}</Tag>
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        );
      },
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active) =>
        active ? (
          <Tag className="!bg-green-100 !text-green-600 !border-0">Active</Tag>
        ) : (
          <Tag className="!bg-red-100 !text-red-600 !border-0">Inactive</Tag>
        ),
    },
    {
      title: "Profile Completed",
      dataIndex: "completedProfile",
      key: "completedProfile",
      render: (completed) =>
        completed ? (
          <Tag className="!bg-green-100 !text-green-600 !border-0">Yes</Tag>
        ) : (
          <Tag className="!bg-yellow-100 !text-yellow-600 !border-0">No</Tag>
        ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      render: (address) =>
        address ? (
          <Tooltip title={address}>
            <span>{address}</span>
          </Tooltip>
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            variant="link"
            color="primary"
            onClick={() =>
              navigate(`/admin/users/${role}/edit/${record.id}`, {
                state: { from: location.pathname + location.search },
              })
            }
          >
            Edit
          </Button>
          {/* <Popconfirm
          title="Are you sure to delete this user?"
          // onConfirm={() => handleDeleteUser(record.id)}
        >
          <a>Delete</a>
        </Popconfirm> */}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    dispatch(
      fetchUsers({ role: userRole.role, ...Object.fromEntries(searchParams) })
    );
  }, [role, searchParams]);
  return (
    <div>
      <UserControlPanel
        role={role!!}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Table<IUserDto>
          columns={columns}
          dataSource={page.content}
          loading={loadings.fetch}
          className="ant-table-striped"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-gray-100" : "bg-white"
          }
          rowKey="id"
          pagination={{
            current: page.currentPage + 1,
            pageSize: page.currentSize,
            total: page.totalElements,
            onChange: (page, pageSize) => {
              setSearchParams({
                ...Object.fromEntries(searchParams),
                page: page.toString(),
                size: pageSize.toString(),
              });
            },
            showLessItems: true,
            showSizeChanger: true,
            pageSizeOptions: ["2", "5", "10", "20"],
          }}
          // scroll={{ x: "max-content" }}
          // locale={{
          //   emptyText: errors.fetch || "No users found",
          // }}
        />
      </div>
    </div>
  );
};

export default UserManagement;
