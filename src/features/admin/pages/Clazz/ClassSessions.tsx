import { Button, Dropdown, Tag, type MenuProps } from "antd";
import type { ColumnProps } from "antd/es/table";
import Table from "antd/es/table";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  fetchClassSessionsByClassId,
  setClazzId,
} from "../../../../store/admin/classSessions";
import type { IUser } from "../../../../store/authSlide";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { type IClassSession } from "./../../../../store/admin/classDetails";
import { setAssignTeacherModal } from "../../../../store/admin/assignTeacher";
import { FaChalkboardTeacher, FaDoorOpen } from "react-icons/fa";
import { setAssignRoomModal } from "../../../../store/admin/assignRoom";
import { DownOutlined } from "@ant-design/icons";
const checkClassStatus = (date: string, start: string, end: string) => {
  // date: "YYYY-MM-DD", start/end: "HH:mm"
  const now = dayjs();

  // Kết hợp ngày + giờ, parse rõ ràng
  const classStart = dayjs(`${date}T${start}:00`); // ISO 8601
  const classEnd = dayjs(`${date}T${end}:00`);

  if (now.isBefore(classStart)) {
    return "Upcoming"; // Sắp diễn ra
  }

  if (now.isAfter(classEnd)) {
    return "Completed"; // Đã kết thúc
  }

  return "Ongoing"; // Đang diễn ra
};
const ClassSessions = () => {
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(
    (state) => state.admin.classSessions.classSessions
  );
  const isLoading = useAppSelector(
    (state) => state.admin.classSessions.loadings.fetchClassSessions
  );
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  const notShow = clazz?.status === "DRAFT" || !clazz;
  const { clazzId } = useAppSelector((state) => state.admin.classSessions);

  const itemsTeacher: MenuProps["items"] = [
    {
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setAssignTeacherModal({
                open: true,
                mode: "by-clazz",
                clazzId: clazz?.id,
              })
            );
          }}
        >
          All Sessions
        </a>
      ),
      key: "0",
    },
    {
      label: <span>Classified by schedule</span>,
      key: "1",
      children: clazz?.schedules?.map((schedule) => ({
        label: (
          <a
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                setAssignTeacherModal({
                  open: true,
                  mode: "by-schedule",
                  scheduleId: schedule.id,
                })
              );
            }}
          >
            {schedule.dayOfWeek} {schedule.startTime} - {schedule.endTime}
          </a>
        ),
        key: schedule.id,
      })),
    },
  ];
  const itemsRoom: MenuProps["items"] = [
    {
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setAssignRoomModal({
                open: true,
                mode: "by-clazz",
                clazzId: clazz?.id,
              })
            );
          }}
        >
          All Sessions
        </a>
      ),
      key: "0",
    },
    {
      label: <span>Classified by schedule</span>,
      key: "1",
      children: clazz?.schedules?.map((schedule) => ({
        label: (
          <a
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                setAssignRoomModal({
                  open: true,
                  mode: "by-schedule",
                  scheduleId: schedule.id,
                })
              );
            }}
          >
            {schedule.dayOfWeek} {schedule.startTime} - {schedule.endTime}
          </a>
        ),
        key: schedule.id,
      })),
    },
  ];
  const isAllowAssign =
    clazz?.status !== "DRAFT" && clazz?.status !== "CANCELLED";

  useEffect(() => {
    if (
      clazz &&
      clazz.status !== "DRAFT" &&
      clazz.schedules.length > 0 &&
      clazzId !== clazz.id
    ) {
      dispatch(fetchClassSessionsByClassId(clazz.id));
      dispatch(setClazzId(clazz.id));
    }
  }, [dispatch, clazzId, clazz?.id]);

  const columns: ColumnProps<IClassSession>[] = [
    {
      title: "Index",
      dataIndex: "",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: "Session ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      // Thứ 2 03/02/2025
      render: (date) => (date ? dayjs(date).format("dddd DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Time",
      key: "time",
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      dataIndex: "teacher",
      key: "teacher",
      title: "Teacher",
      render: (teacher: IUser) => (teacher ? teacher.fullName : "Unassigned"),
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      render: (room) => (room ? room.name : "Unassigned"),
    },
    {
      title: "Conduct",
      dataIndex: "conduct",
      key: "conduct",
      render: (conduct, record) => {
        const status = checkClassStatus(
          record.date,
          record.startTime,
          record.endTime
        );
        return (
          <Tag
            color={
              status === "Upcoming"
                ? "blue"
                : status === "Ongoing"
                ? "green"
                : "red"
            }
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag>{status}</Tag>,
    },
  ];
  return (
    <div className=" bg-white rounded-lg shadow-md h-full">
      <div className="p-4 bg-gray-200 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold ">Class Sessions</h1>
          <div>

            <p>Total: {sessions.length} / {clazz?.totalSessions}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Dropdown
            placement="bottomRight"
            menu={{ items: itemsTeacher }}
            trigger={["click"]}
          >
            <Button
              icon={<FaChalkboardTeacher />}
              disabled={!isAllowAssign}
              type="default"
              
              onClick={(e) => e.preventDefault()}
            >
              Assign Teacher
            </Button>
          </Dropdown>
          <Dropdown
            placement="bottomRight"
            menu={{ items: itemsRoom }}
            trigger={["click"]}
          >
            <Button
              icon={<FaDoorOpen />}
              disabled={!isAllowAssign}
              type="default"
             
              onClick={(e) => e.preventDefault()}
            >
              Assign Room
            </Button>
          </Dropdown>
        </div>
      </div>
      {notShow ? (
        <p className="text-gray-500 p-4">No sessions available</p>
      ) : (
        <Table
          columns={columns}
          dataSource={sessions}
          rowKey="id"
          pagination={false}
          loading={isLoading}
        />
      )}
    </div>
  );
};

export default ClassSessions;
