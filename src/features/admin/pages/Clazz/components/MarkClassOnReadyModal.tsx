import { Button, DatePicker, Form, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import { setPreviewData } from "../../../../../store/admin/preViewSessions";
import Loading from "../../../../../components/common/Loading";
import { getSolarHolidays } from "../../../../../store/common/holidaysSlide";
import dayjs from "dayjs";
import {
  fetchClassSessionsByClassId,
  markClassOnReady,
} from "../../../../../store/admin/classDetails";
import { useNavigate } from "react-router-dom";

interface Props {
  // Define any props if needed
  isOpen: boolean;
  onClose: () => void;
}
const MarkClassOnReadyModal = ({ isOpen, onClose }: Props) => {
  const [form] = useForm();
  const fetchHolidaysLoading = useAppSelector(
    (state) => state.common.holidays.loadings.getSolarHolidays
  );
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  const isLoading = useAppSelector(
    (state) => state.admin.classDetails.loadings.markClassOnReady
  );
  const previewSession = useAppSelector(
    (state) => state.admin.preViewSessions.previewData
  );
  const [collapsePreviewSession, setCollapsePreviewSession] = useState(false);
  const navigate = useNavigate();
  const startDate = Form.useWatch("startDate", form);

  const dispatch = useAppDispatch();
  const handleSubmit = async (values: any) => {
    // Handle form submission
    if (!clazz) return;
    await dispatch(
      markClassOnReady({
        clazzId: clazz?.id,
        data: {
          unavailableDates: [],
          startDate: values.startDate.format("YYYY-MM-DD"),
        },
      })
    )
      .unwrap()
      .then(() => {
        onClose();
        message.success("Class marked as ready successfully");
        navigate(`/admin/classes/details/${clazz.id}/sessions`);
        dispatch(fetchClassSessionsByClassId(clazz.id));
      });
  };

  useEffect(() => {
    if (!startDate || !clazz) return;

    // ước lượng endDate (giống backend)
    const totalSessions = clazz.totalSessions || 0;
    const schedulesCount = clazz.schedules?.length || 1;
    const estimatedEndDate = dayjs(startDate).add(
      Math.ceil(totalSessions / schedulesCount) + 1,
      "week"
    );

    // Tạo list năm cần lấy: từ start -> end + 1
    const yearsToFetch: number[] = [];
    for (
      let y = dayjs(startDate).year();
      y <= estimatedEndDate.year() + 1;
      y++
    ) {
      yearsToFetch.push(y);
    }

    // Lấy holidays từ backend
    dispatch(getSolarHolidays(yearsToFetch))
      .unwrap()
      .then((holidaysData) => {
        dispatch(
          setPreviewData({
            clazz,
            holidays: holidaysData || [],
            startDate: dayjs(startDate).format("YYYY-MM-DD"),
          })
        );
        
      })
      .catch((err) => {
        console.error("Failed to load holidays:", err);
      });
      setCollapsePreviewSession(true);
  }, [startDate, clazz?.id, dispatch, clazz?.schedules]);

  return (
    <Modal
      className="max-h-[80vh] overflow-y-auto"
      title={<h1 className="text-2xl font-semibold">Mark Class as Ready</h1>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form
        form={form} // Pass the form instance here
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          remember: true,
          status: "OK", // Set initial value for status here
        }}
        name="scheduleForm"
        size="large"
      >
        <Form.Item
          name={"startDate"}
          label="Start Date"
          rules={[
            {
              required: true,
              message: "Please select a start date",
            },
            {
              validator: (rule, value) => {
                const now = new Date();
                const today = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate()
                );
                if (value && value < today) {
                  return Promise.reject("Start date cannot be in the past");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker format={"MM/DD/YYYY"} />
        </Form.Item>
      </Form>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Class Schedule</h1>
        {clazz?.schedules.map((schedule) => (
          <div className="border p-2 rounded border-gray-200" key={schedule.id}>
            <p className="!mb-0">
              <span className="font-semibold">{schedule.dayOfWeek}</span>{" "}
              <span>
                {schedule.startTime} - {schedule.endTime}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className=" flex justify-between items-center mt-4">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold ">Preview Session</h1>{" "}
          <Button
            className="!mb-2"
            type="link"
            onClick={() => setCollapsePreviewSession(!collapsePreviewSession)}
          >
            {collapsePreviewSession ? "Collapse" : "Expand"}
          </Button>
        </div>
        <div>
          <p>
            <span>
              Total: {previewSession.length}/ {clazz?.totalSessions}
            </span>
{
          previewSession.length && startDate && (
              <span className="ml-2">
                Start: {dayjs(previewSession[0].date).format("DD/MM/YYYY")}
                {" | End: " + dayjs(previewSession[previewSession.length - 1].date).add(1, "days").format("DD/MM/YYYY")}
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="">
        {!startDate ? (
          <p className="border-gray-200 border rounded-xl p-4">
            Please select a start date to see the preview.
          </p>
        ) : previewSession && previewSession.length > 0 ? (
          <div className="border-gray-200 border rounded-xl p-4">
            {!collapsePreviewSession ? (
              <p>Preview is collapsed.</p>
            ) : (
              fetchHolidaysLoading ? (
                <Loading/>
              ) : (
                previewSession.map((session) => (
                  <div
                    key={session.date + session.startTime}
                    className="not-last:border-b border-gray-200 py-2"
                  >
                  <p>
                    <span className="font-semibold">
                      {dayjs(session.date).format("dddd, DD/MM, YYYY") + " |"}
                    </span>
                    <span>{" Starting from " + session.startTime}</span>
                    <span>{" to " + session.endTime}</span>
                  </p>
                </div>
              ))
            ))}
          </div>
        ) : (
          <p>No preview available.</p>
        )}
      </div>

      <div className="flex justify-end mt-4 gap-4">
        <Button disabled={isLoading} size="large" onClick={onClose}>
          Cancel
        </Button>
        <Button
          loading={isLoading}
          size="large"
          onClick={form.submit}
          type="primary"
          className="ml-2"
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default MarkClassOnReadyModal;
