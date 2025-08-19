import React, { useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import {
  Table,
  Tag,
  Dropdown,
  Space,
  Menu,
  message,
  Card,
  Divider,
  Spin,
} from "antd";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  ATTENDANCE_STATUS,
  fetchAttendanceBySession,
  markAttendanceStatus,
} from "../../../../store/teacher/AttendanceSlide";

const Attendance = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const dispatch = useAppDispatch();
  const { attendance, loadings } = useAppSelector(
    (state) => state.teacher.attendance
  );

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchAttendanceBySession({ sessionId: Number(sessionId) }));
    }
  }, [sessionId]);

  const handleMarkStatus = async (attendanceId: number, status: string) => {
    try {
      await dispatch(markAttendanceStatus({ attendanceId, status })).unwrap();
      message.success(
        `Attendance status updated to ${getStatusLabel(status)}!`
      );
    } catch (error) {
      message.error("Failed to update attendance status.");
    }
  };

  const getStatusLabel = (status: string): string => {
    const labelMap: Record<string, string> = {
      PRESENT: "Present",
      ABSENT: "Absent",
      LATE: "Late",
      EXCUSED: "Excused",
      NOT_JOINED_YET: "Not Joined Yet",
    };
    return labelMap[status] || "Unknown";
  };

  const columns = [
    {
      title: "Student ID",
      dataIndex: ["attendanceEnrollment", "attendee", "id"],
      key: "id",
    },
    {
      title: "Name & Email",
      key: "nameEmail",
      render: (_: any, record: any) => {
        const attendee = record.attendanceEnrollment.attendee;
        return (
          <div>
            <span>{attendee.fullName}</span>
            <br />
            <span className="text-gray-500">({attendee.email})</span>
          </div>
        );
      },
      sorter: (a: any, b: any) => {
        const nameA = a.attendanceEnrollment.attendee.fullName.split(" ").pop();
        const nameB = b.attendanceEnrollment.attendee.fullName.split(" ").pop();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        const colorMap: Record<string, string> = {
          PRESENT: "green",
          ABSENT: "red",
          LATE: "orange",
          EXCUSED: "blue",
          NOT_JOINED_YET: "gray",
        };

        const menuItems = Object.keys(ATTENDANCE_STATUS).map((status) => ({
          label: (
            <a
              onClick={(e) => {
                e.preventDefault();
                handleMarkStatus(record.id, status);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: colorMap[status],
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: colorMap[status],
                }}
              ></span>
              {getStatusLabel(status)}
            </a>
          ),
          key: status,
        }));

        const menu = { items: menuItems };

        let absenceColor = "green";
        if (record.absenceCount > 0 && record.absenceCount <= 2) {
          absenceColor = "orange";
        } else if (record.absenceCount > 2) {
          absenceColor = "red";
        }

        return (
          <div>
            <Dropdown menu={menu} trigger={["click"]}>
              <a
                onClick={(e) => e.preventDefault()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: loadings.markAttendanceStatus[record.id] ? 0.5 : 1, // Adjust opacity during loading
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: colorMap[record.status],
                  }}
                ></span>
                <span style={{ color: colorMap[record.status] }}>
                  {getStatusLabel(record.status)}
                </span>
                <DownOutlined />
              </a>
            </Dropdown>
           
          </div>
        );
      },
    },
    {
      title: "Absence Count",
      dataIndex: "absenceCount",
      key: "absenceCount",
      render: (absenceCount: number) => {
        let color = "green";
        if (absenceCount > 0 && absenceCount <= 2) {
          color = "orange";
        } else if (absenceCount > 2) {
          color = "red";
        }
        return <Tag color={color}>Absence: {absenceCount}</Tag>;
      },
    },
  ];

  return (
    <div className="p-4 !space-y-6">
     

      {attendance && (
        <Card className="shadow-md p-6 rounded-lg border border-gray-300">
          <h2 className="text-2xl font-semibold mb-2">Session Information</h2>
          <Divider />
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-lg">
                <strong>Class:</strong> {attendance.clazz.name}
              </p>
              <p className="text-lg">
                <strong>Course:</strong> {attendance.clazz.course.name}
              </p>
              <p className="text-lg">
                <strong>Teacher:</strong> {attendance.session.teacher.fullName}
              </p>
              <p className="text-lg">
                <strong>Room:</strong> {attendance.session.room.name} (
                {attendance.session.room.branch.name})
              </p>
            </div>
            <div>
              <p className="text-lg">
                <strong>Date:</strong> {attendance.session.date}
              </p>
              <p className="text-lg">
                <strong>Time:</strong> {attendance.session.startTime} -{" "}
                {attendance.session.endTime}
              </p>
              <p className="text-lg">
                <strong>Status:</strong>{" "}
                <Tag color="gold" className="text-lg">
                  {attendance.session.status}
                </Tag>
              </p>
              <p className="text-lg">
                <strong>Note:</strong>{" "}
                {attendance.session.note || "No notes available"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {loadings.fetchAttendanceBySession ? (
        <Card className="shadow-md flex justify-center items-center h-64">
          <Spin size="large" />
        </Card>
      ) : attendance ? (
        <Table
          dataSource={attendance.attendances}
          columns={columns}
          rowKey="id"
          pagination={false}
          className="rounded-lg overflow-x-auto border border-gray-200"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-gray-100" : "bg-white"
          } // Alternating row colors
        />
      ) : (
        <Card className="shadow-md text-center text-gray-500">
          No attendance data available.
        </Card>
      )}

      <Card className="shadow-md mt-4">
        <h2 className="text-2xl font-semibold mb-2">Attendance Summary</h2>
        <Divider />
        <div className="!space-y-2 mt-4">
          {Object.keys(ATTENDANCE_STATUS).map((status) => {
            const colorMap: Record<string, string> = {
              PRESENT: "green",
              ABSENT: "red",
              LATE: "orange",
              EXCUSED: "blue",
              NOT_JOINED_YET: "gray",
            };
            const count =
              attendance?.attendances?.filter(
                (attendee) => attendee.status === status
              ).length || 0;
            return (
              <div key={status} className="flex items-center gap-4">
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: colorMap[status],
                  }}
                ></span>
                <span>{getStatusLabel(status)}:</span>
                <Tag color={colorMap[status]}>{count}</Tag>
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <strong>Total Students:</strong>{" "}
          {attendance?.attendances?.length || 0}
        </div>
      </Card>
    </div>
  );
};

export default Attendance;
