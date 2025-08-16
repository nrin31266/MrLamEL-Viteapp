import React, { useEffect, useState } from "react";
import UserEnrollmentModal from "./components/UserEnrollmentModal";
import { Button, Table } from "antd";
import { FaUserPlus } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  fetchClassEnrollments,
  setClassIdForEnrollments,
  type IClassEnrollment,
} from "../../../../store/admin/enrollStudentToClass";
import type { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
const ClassEnrollment = () => {
  const [openClassEnrollmentModal, setOpenClassEnrollmentModal] =
    useState(false);

  const dispatch = useAppDispatch();

  const loading = useAppSelector(
    (state) => state.admin.enrollStudent.loadings.enrollments
  );
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  const { classId, enrollments } = useAppSelector(
    (state) => state.admin.enrollStudent
  );

  useEffect(() => {
    if (clazz?.id && classId !== clazz.id) {
      dispatch(fetchClassEnrollments(clazz.id));
      dispatch(setClassIdForEnrollments({ clazzId: clazz.id }));
    }
  }, [clazz?.id, classId]);

  const columns: ColumnProps<IClassEnrollment>[] = [
    {
      dataIndex: "",
      title: "Index",
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: "",
      key: "id",
      title: "ID",
      render: (row: IClassEnrollment) => (
        <div>
          <p className="">Class Enrollment Id: {row.id}</p>
          <p className="">Student Id: {row.attendee.id}</p>
        </div>
      ),
    },
    {
      dataIndex: "attendee",
      key: "attendee",
      title: "Attendee",
      render: (attendee) => (
        <div>
          <h4 className="font-semibold">{attendee?.fullName}</h4>
          <p className="text-gray-500">{attendee?.email}</p>
        </div>
      ),
    },
    {
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      title: "Enrolled At",
      render: (enrolledAt) =>
        enrolledAt ? dayjs(enrolledAt).format("ddd DD/MM/YYYY HH:mm") : "N/A",
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md h-full flex flex-col gap-4">
        <div className="bg-gray-200 p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold !mb-0">Class Enrollment</h2>
            <div>
              <p>Total: {enrollments.length} / {clazz?.maxSeats}</p>
            </div>
          </div>
          <div>
            <Button
              icon={<FaUserPlus />}
              type="default"
              onClick={() => setOpenClassEnrollmentModal(true)}
            >
              Add students to the class
            </Button>
          </div>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={enrollments || []}
            rowKey="id"
            pagination={false}
            loading={loading}
          />
        </div>
      </div>
      <UserEnrollmentModal
        isOpen={openClassEnrollmentModal}
        onClose={() => setOpenClassEnrollmentModal(false)}
      />
    </div>
  );
};

export default ClassEnrollment;
