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
  Form,
  Input,
  Button,
} from "antd";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  ATTENDANCE_STATUS,
  fetchAttendanceBySession,
  learnSession,
  markAttendanceStatus,
} from "../../../../store/teacher/attendanceSlide";

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

  const handleSubmitContent = (values: any) => {
    console.log("Session content submitted:", values);
    // Dispatch an action to update the session content
    // dispatch(updateSessionContent({ sessionId: attendance.session.id, content: values.content }));
    if(!attendance) return;
    dispatch(learnSession({ classSessionId: attendance.session.id, content: values.content }))
      .unwrap()
      .then(() => {
        dispatch(fetchAttendanceBySession({ sessionId: Number(sessionId) }));
      })
      .catch((error) => {
        message.error(`Failed to update session content: ${error}`);
      });
  };

  const columns = [
    {
      title: "Index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    // {
    //   title: "Student ID",
    //   dataIndex: ["attendanceEnrollment", "attendee", "id"],
    //   key: "id",
    // },
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
        const getLastName = (fullName?: string) => {
          if (!fullName) return "";
          const parts = fullName.trim().split(" ").filter(Boolean); // loại bỏ chuỗi rỗng
          return parts.length > 0 ? parts[parts.length - 1].toLowerCase() : "";
        };

        const nameA = getLastName(a.attendanceEnrollment.attendee.fullName);
        const nameB = getLastName(b.attendanceEnrollment.attendee.fullName);

        console.log("Sorting:", { nameA, nameB });
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
    <div className="!space-y-6">
      {attendance && (
        <div className="shadow-md rounded-lg border border-gray-300">
          <div className="bg-sky-950 px-4 py-2 rounded-t-lg">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Session Information
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 p-4">
            <div className="flex flex-col gap-2">
              <span className="text-lg">
                <strong>Class:</strong> {attendance.clazz.name}
              </span>
              <span className="text-lg">
                <strong>Course:</strong> {attendance.clazz.course.name}
              </span>
              <div className="text-lg flex gap-2">
                <strong>Teacher:</strong>
                {attendance.session.teacher ? (
                  <span className="text-lg">
                    {attendance.session.teacher.fullName}
                  </span>
                ) : (
                  <span>No teacher assigned</span>
                )}
              </div>
              <div className="text-lg flex gap-2">
                <strong>Room:</strong>{" "}
                {attendance.session.room ? (
                  <span className="text-lg">
                    {attendance.session.room.name} (
                    {attendance.session.room.branch.name})
                  </span>
                ) : (
                  <span>No room assigned</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-lg">
                <strong>Date:</strong> {attendance.session.date}
              </span>
              <span className="text-lg">
                <strong>Time:</strong> {attendance.session.startTime} -{" "}
                {attendance.session.endTime}
              </span>
              <span className="text-lg">
                <strong>Status:</strong>{" "}
                <Tag color="gold" className="text-lg">
                  {attendance.session.status}
                </Tag>
              </span>
              <span className="text-lg">
                <strong>Note:</strong>{" "}
                {attendance.session.note || "No notes available"}
              </span>
            </div>
          </div>
        </div>
      )}

      {attendance?.session.status === "NOT_YET" ? (
        <div className="shadow-md rounded-lg border border-gray-300">
          <div className="bg-slate-950 px-4 py-2 rounded-t-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Enter Session Content
            </h2>
          </div>
          <Form
            layout="horizontal"
            onFinish={handleSubmitContent}
            className="!space-y-2 !p-4"
            name="sessionContentForm"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: "Please enter content!" }]}
            >
              <Input placeholder="Enter session content" />
            </Form.Item>
            <div className="flex justify-end">
              <Button
                loading={loadings.learnSession}
                type="primary"
                htmlType="submit"
              >
                Learn
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        attendance?.session.status === "DONE" && (
          <div className="shadow-md rounded-lg border border-gray-300">
            <div className="bg-stone-950 px-4 py-2 rounded-t-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Session Content
              </h2>
            </div>

            <p className="text-lg !mt-4 px-4">
              {attendance.session.content ||
                "No content available for this session."}
            </p>
          </div>
        )
      )}

      {loadings.fetchAttendanceBySession ? (
        <div className="shadow-md flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : attendance && attendance.session.status === "DONE" ? (
        <>
          <div className=" border border-gray-200 rounded-lg">
            <div className="bg-sky-950 px-4 py-2 rounded-t-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Attendance List
              </h2>
            </div>
            <Table
              dataSource={attendance.attendances}
              columns={columns}
              rowKey="id"
              pagination={false}
              className=" overflow-x-auto"
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } // Alternating row colors
            />
            <div className="p-4  w-max mt-2 rounded-bl-lg  bg-sky-100">
              <h1 className="text-xl font-bold">Summary</h1>
              <div className="">
                <span className="font-semibold text-gray-800">
                  Total Students:
                </span>{" "}
                <span className="font-bold text-xl">
                  {attendance?.attendances?.length || 0}
                </span>
              </div>
              <div className=" mt-4 grid gap-2 md:grid-cols-2 grid-cols-1">
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
            </div>
          </div>
        </>
      ) : (
        <Card className="shadow-md text-center text-gray-500">
          {!attendance ? (
            <p>No attendance data available.</p>
          ) : (
            <p>Start the class to take attendance.</p>
          )}
        </Card>
      )}
    </div>
  );
};

export default Attendance;
