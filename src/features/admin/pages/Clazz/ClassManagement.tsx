import { Button, Modal, Table, Tag } from "antd";
import ClassControlPanel from "./components/ClassControlPanel";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchClazzes,
  removeClazz,
  type IClassSchedule,
  type IClazz,
} from "../../../../store/admin/classManagement";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import type { ColumnProps } from "antd/es/table";
import { useEffect } from "react";
import { SiTask } from "react-icons/si";
import { CurrencyUtils } from "../../../../utils/CurrencyUtils";
import type { ICourseDto } from "../../../../store/admin/courseSlide";
import type { IRoomDto } from "../../../../store/admin/roomSlide";

// Trả về giá trị, label, mã màu hex cho đẹp
// "DRAFT" | "READY" | "OPEN" | "ONGOING" | "FINISHED" | "CANCELLED"
export const getClassStatusValue = (status: string) => {
  switch (status) {
    case "DRAFT":
      return { value: "Draft", color: "#FFA500" }; // Orange
    case "READY":
      return { value: "Ready", color: "#32CD32" }; // Lime Green
    case "OPEN":
      return { value: "Open", color: "#007BFF" }; // Bright Blue
    case "ONGOING":
      return { value: "Ongoing", color: "#FFC107" }; // Amber
    case "FINISHED":
      return { value: "Finished", color: "#6C757D" }; // Slate Gray
    case "CANCELLED":
      return { value: "Cancelled", color: "#DC3545" }; // Crimson Red
    default:
      return { value: "Unknown", color: "#495057" }; // Darker Gray
  }
};

const ClassManagement = () => {
  // You can manage searchParams and setSearchParams here if needed
  const [searchParams, setSearchParams] = useSearchParams();
  const page = useAppSelector((state) => state.admin.classManagement.page);
  const loading = useAppSelector(
    (state) => state.admin.classManagement.loadings.fetch
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Fetch classes data when the component mounts or searchParams change
    dispatch(fetchClazzes({ ...Object.fromEntries(searchParams) }));
  }, [searchParams]);
  const navigate = useNavigate();
  const location = useLocation();
  const handleRemoveClass = async (clazz: IClazz) => {
    Modal.confirm({
      title: "Confirm Removal",
      content: `Are you sure you want to remove the class "${clazz.name}"? This action cannot be undone.`,
      onOk: async () => {
        dispatch(removeClazz(clazz.id));
      },
    });
  };
  const columns: ColumnProps<IClazz>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      render: (avatarUrl: string) => (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="border border-gray-300 object-cover"
          style={{ width: 52, height: 52 }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (course: ICourseDto) => (
        <div>
          <span className="font-semibold">{course.code}</span>
          <br />
          <span>{course.name}</span>
          <br />
          <span>{CurrencyUtils.formatVND(course.fee)}</span>
        </div>
      ),
    },
    {
      dataIndex: "schedules",
      key: "schedules",
      title: "Schedules",
      render: (schedules: IClassSchedule[]) => (
        <div>
          {schedules.map((schedule) => (
            <div key={schedule.id}>
              <span className="font-semibold">{schedule.dayOfWeek}</span>{" "}
              <span>
                {schedule.startTime}-{schedule.endTime}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      dataIndex: "",
      title: "Time",
      render: (_, record) => (
        <div>
          <p>
            Start:{" "}
            {record.startDate || <span className="text-gray-500">N/A</span>}
          </p>
          <p>
            End: {record.endDate || <span className="text-gray-500">N/A</span>}
          </p>
        </div>
      ),
    },
    {
      dataIndex: "totalSessions",
      key: "totalSessions",
      title: "Total Sessions",
      width: 60,
      render: (totalSessions: number) => (
        <span className="text-lg font-semibold">{totalSessions}</span>
      ),
    },
    {
      dataIndex: "maxSeats",
      key: "maxSeats",
      title: "Max",
      render: (maxSeats: number) => (
        <span className="text-lg font-semibold">{maxSeats}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const { value, color } = getClassStatusValue(status);
        return (
          <Tag
            className={`status-${status.toLowerCase()} !text-[0.85rem] w-20 !py-1 !text-center`}
            color={color}
          >
            {value}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div className="flex flex-col gap-2">
          <Button
            type="primary"
            size="small"
            onClick={() =>
              navigate(`/admin/classes/details/${record.id}`, {
                state: { from: location.pathname + location.search },
              })
            }
          >
            Manage
          </Button>
          <Button
            type="default"
            danger
            size="small"
            onClick={() => handleRemoveClass(record)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <ClassControlPanel
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <Table<IClazz>
          columns={columns}
          dataSource={page.content}
          loading={loading}
          
          className="ant-table-striped"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-gray-100" : "bg-white"
          }
          rowKey="id"
          pagination={{
            current: page.currentPage + 1 || 1,
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
            pageSizeOptions: ["1", "5", "10", "20"],
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

export default ClassManagement;
