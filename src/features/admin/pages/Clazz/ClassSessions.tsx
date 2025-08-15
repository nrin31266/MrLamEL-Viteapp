import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import Loading from "../../../../components/common/Loading";
import {
  fetchClassSessionsByClassId,
  type IClassSession,
} from "./../../../../store/admin/classDetails";
import type { ColumnProps } from "antd/es/table";
import Table from "antd/es/table";
import dayjs from "dayjs";
import { Tag } from "antd";
import type { IUser } from "../../../../store/authSlide";
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
    (state) => state.admin.classDetails.classSessions
  );
  const isLoading = useAppSelector(
    (state) => state.admin.classDetails.loadings.fetchClassSessions
  );
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  const notShow = clazz?.status === "DRAFT" || !clazz;

  useEffect(() => {
    if (clazz  && clazz.status !== "DRAFT") {
      dispatch(fetchClassSessionsByClassId(clazz.id));
    }
  }, [dispatch, clazz?.id, clazz?.schedules]);
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
      render: (teacher:IUser) => (teacher ? teacher.fullName : "Unassigned"),
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
        const status = checkClassStatus(record.date, record.startTime, record.endTime);
        return <Tag color={status === "Upcoming" ? "blue" : status === "Ongoing" ? "green" : "red"}>{status}</Tag>;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag>{status}</Tag>,
    }
  ];
  if (isLoading) return <Loading />;
  return (
    <div className=" bg-white rounded-lg shadow-md h-full">
      <h2 className="text-xl font-semibold p-4 bg-gray-200 rounded-t-lg">
        Class Sessions
      </h2>
      {notShow ? (
        <p className="text-gray-500 p-4">No sessions available</p>
      ) : (
        <Table
          columns={columns}
          dataSource={sessions}
          rowKey="id"
          pagination={false}
        />
      )}
    </div>
  );
};

export default ClassSessions;
