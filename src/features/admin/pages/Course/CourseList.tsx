import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  fetchCourses,
  deleteCourse,
  type ICourseDto,
} from "../../../../store/admin/courseSlide";
import { CurrencyUtils } from "../../../../utils/CurrencyUtils";

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState("");
  const { fetch: fetchLoading, delete: deleteLoading } = useAppSelector(
    (state) => state.admin.course.loadings || {}
  );
  const courses = useAppSelector((state) => state.admin.course.data) || [];

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleEdit = (record: any) => {
    navigate(`/admin/courses/edit/${record.id}`);
  };

const handleDelete = (record: ICourseDto) => {
  Modal.confirm({
    title: "Confirm Delete",
    content: `Are you sure you want to delete course "${record.name}"?`,
    okText: "Delete",
    okType: "danger",
    cancelText: "Cancel",
    async onOk() {
      try {
        await dispatch(deleteCourse(record.id)).unwrap();
        // Không cần return message.success(), chỉ resolve thôi
        message.success("Course deleted successfully!");
      } catch {
        message.error("Failed to delete course!");
        // Throw để Modal biết là onOk fail => không đóng
        throw new Error("Delete failed");
        
      }
    },
  });
};


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Logo",
      dataIndex: "logoUrl",
      key: "logoUrl",
      width: 80,
      render: (url: string) =>
        url ? (
          <Image src={url} width={42} height={42} alt="logo" />
        ) : (
          <span>No image</span>
        ),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 160,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Sessions",
      dataIndex: "totalSessions",
      key: "totalSessions",
      render: (num: number) => (
        <Tag className="!text-sm" color="blue">
          {num} sessions
        </Tag>
      ),
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      render: (fee: number) => <span>{CurrencyUtils.formatVND(fee)}</span>,
    },
    {
      title: "MRP Fee",
      dataIndex: "mrpFee",
      key: "mrpFee",
      render: (fee: number) =>
        fee && <span>{CurrencyUtils.formatVND(fee)}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (record: any) => (
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

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchText.toLowerCase()) ||
      course.code.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col">
      {/* Header */}
      <div className="shadow-sm bg-white p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 m-0">
              Course Management
            </h2>
            <p className="text-gray-500 mt-1">Manage all courses</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/courses/create")}
            size="large"
          >
            Add New Course
          </Button>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-4">
            <Input
              size="large"
              placeholder="Search by name or code..."
              allowClear
              style={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Total: <span className="font-medium">{filteredCourses.length}</span>{" "}
            courses
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="shadow-sm bg-white p-6 rounded-md">
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          loading={fetchLoading}
          pagination={{
            total: filteredCourses.length,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
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

export default CourseList;
