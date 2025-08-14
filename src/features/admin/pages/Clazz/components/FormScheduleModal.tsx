import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  TimePicker,
  type DatePickerProps,
  type TimePickerProps,
} from "antd";
import React, { useEffect } from "react";
import type { IClassSchedule } from "../../../../../store/admin/classManagement";
import moment from "moment";
import { useForm } from "antd/es/form/Form";
import {
  createClassSchedule,
  EDayOfWeek,
  updateClassSchedule,
  type ClassScheduleReq,
} from "../../../../../store/admin/classDetails";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
// export interface CreateClassScheduleReq {
//   classId: number;
//   dayOfWeek: EDayOfWeek;
//   startTime: string; // dùng string ở dạng "HH:mm:ss" hoặc ISO time
//   endTime: string;   // dùng string ở dạng "HH:mm:ss" hoặc ISO time

// }

// // union type tương ứng với java.time.DayOfWeek
// export type EDayOfWeek =
//   | "MONDAY"
//   | "TUESDAY"
//   | "WEDNESDAY"
//   | "THURSDAY"
//   | "FRIDAY"
//   | "SATURDAY"
//   | "SUNDAY";
interface FormScheduleModelProps {
  // Define any props if needed
  isOpen?: boolean;
  onClose?: () => void;
  selectedSchedule?: IClassSchedule;
}
const { RangePicker } = DatePicker;
const FormScheduleModal: React.FC<FormScheduleModelProps> = ({
  isOpen,
  onClose,
  selectedSchedule,
}) => {
  const isEdit = !!selectedSchedule;
  const [form] = useForm<ClassScheduleReq>(); // Ensure this instance is passed to the Form component
  const actionLoading = false;
  const { createSchedule: createLoading, updateSchedule: updateLoading } =
    useAppSelector((state) => state.admin.classDetails.loadings);
  const { createSchedule: createError, updateSchedule: updateError } =
    useAppSelector((state) => state.admin.classDetails.errors);
  const isLoading = isEdit ? updateLoading : createLoading;
  const currentError = isEdit ? updateError : createError;
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  const handleSubmit = async (values: ClassScheduleReq) => {
    const payload = {
      ...values,
      startTime: values.startTime?.format("HH:mm:ss"),
      endTime: values.endTime?.format("HH:mm:ss"),
    };
    console.log("Form values:", payload);
    if (isEdit && selectedSchedule) {
      // Dispatch update action
      await dispatch(updateClassSchedule({ id: selectedSchedule.id, data: payload })).unwrap();
    } else {
      // Dispatch create action
      await dispatch(createClassSchedule({ ...payload, classId: clazz?.id })).unwrap();
    }
    message.success("Schedule saved successfully");
    onClose && onClose();
    form.resetFields(); // Reset the form fields after submission
  };
  useEffect(() => {
    if (isEdit && selectedSchedule) {
      
      form.setFieldsValue({
        startTime: dayjs(selectedSchedule.startTime, "HH:mm:ss"),
      endTime: dayjs(selectedSchedule.endTime, "HH:mm:ss"),
        dayOfWeek: selectedSchedule.dayOfWeek as EDayOfWeek,
      });
    }else if(isOpen){
      form.resetFields();
    }
  }, [selectedSchedule, isEdit]);
  return (
    <Modal
      title={<h1 className="text-xl font-semibold">{isEdit ? "Edit Schedule" : "Create Schedule"}</h1>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <div>
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
            label="Day of Week"
            name="dayOfWeek"
            rules={[
              { required: true, message: "Please select a day of the week" },
            ]}
          >
            <Select placeholder="Select a day">
              <Select.Option value={EDayOfWeek.MONDAY}>Monday</Select.Option>
              <Select.Option value={EDayOfWeek.TUESDAY}>Tuesday</Select.Option>
              <Select.Option value={EDayOfWeek.WEDNESDAY}>
                Wednesday
              </Select.Option>
              <Select.Option value={EDayOfWeek.THURSDAY}>
                Thursday
              </Select.Option>
              <Select.Option value={EDayOfWeek.FRIDAY}>Friday</Select.Option>
              <Select.Option value={EDayOfWeek.SATURDAY}>
                Saturday
              </Select.Option>
              <Select.Option value={EDayOfWeek.SUNDAY}>Sunday</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="startTime"
            rules={[
              { required: true, message: "Please select start time" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const endTime = getFieldValue("endTime");
                  if (!value || !endTime || value.isBefore(endTime)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Start time must be before end time")
                  );
                },
              }),
            ]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="endTime"
            rules={[
              { required: true, message: "Please select end time" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startTime = getFieldValue("startTime");
                  if (!value || !startTime || value.isAfter(startTime)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("End time must be after start time")
                  );
                },
              }),
            ]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Form>
        {
          currentError && (<div className="error">{currentError}</div>)
        }
        <div className="flex justify-end mt-4">
          <Button
            className=""
            size="large"
            type="primary"
            loading={isLoading}
            onClick={() => form.submit()}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FormScheduleModal;
