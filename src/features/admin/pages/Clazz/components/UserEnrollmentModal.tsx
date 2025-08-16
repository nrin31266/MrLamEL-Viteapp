import { Form, Input, Modal, Spin, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import type { IUser } from "../../../../../store/authSlide";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import { checkStudentBeforeAddingToClass, addStudentToClass, type ICheckStudentDto } from "../../../../../store/admin/enrollStudentToClass";

interface UserEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const UserEnrollmentModal: React.FC<UserEnrollmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { addStudent: addStudentError, checkStudent: checkStudentError } = useAppSelector((state) => state.admin.enrollStudent.errors);
  const { addStudent: addStudentLoading, checkStudent: checkStudentLoading } = useAppSelector((state) => state.admin.enrollStudent.loadings);
  const [checkStudentDto, setCheckStudentDto] = useState<ICheckStudentDto | undefined>();
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const isAddStudentButtonEnabled = checkStudentDto ? 
  (checkStudentDto.exists && checkStudentDto.canEnroll ? true :
  checkStudentDto.canEnroll && true)
  : false;

  useEffect(() => {
    const search = async () => {
      if (!clazz) return;
      setCheckStudentDto(undefined);
      if (!isValidEmail(searchTerm)) return;
      dispatch(checkStudentBeforeAddingToClass({ studentEmail: searchTerm, classId: clazz.id }))
        .unwrap()
        .then((data) => {
          setCheckStudentDto(data);
        });
    };
    const delayDebounceFn = setTimeout(() => {
      search();
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleAddStudent = async () => {
    if (!clazz) return;
    if (checkStudentDto?.exists && checkStudentDto?.canEnroll) {
      await dispatch(addStudentToClass({ userId: checkStudentDto.user.id, classId: clazz.id , email: searchTerm }))
        .unwrap();
        
    } else if (!checkStudentDto?.exists && checkStudentDto?.canEnroll) {
      try {
        const values = await form.validateFields();
        await dispatch(addStudentToClass({ ...values, classId: clazz.id, email: searchTerm }))
          .unwrap()
        console.log(values);
      } catch (error) {
        return;
      }
    }
    setSearchTerm("");
    setCheckStudentDto(undefined);
    message.success("Student added successfully!");
    onClose();
  };

  return (
    <Modal
      title={<h1 className="text-2xl text-gray-800">User Enrollment</h1>}
      open={isOpen}
      onCancel={onClose}
      footer={
        <div className="flex justify-end gap-4">
          <Button onClick={onClose} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            loading={addStudentLoading}
            disabled={!isAddStudentButtonEnabled}
            onClick={handleAddStudent}
          >
            {!checkStudentDto ? "Add Student To Class" : checkStudentDto.exists ? "Add Student To Class" : "Create and Add Student To Class"}
          </Button>
        </div>
      }
    >
      <div>
        <div>
          <h1 className="text-gray-600 ml-1">Email</h1>
          <Input
            type="email"
            placeholder="Enter email"
            size="large"
            className="!w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </div>
        <div className="mt-4">
          {checkStudentLoading ? (
            <div className="flex justify-center p-4">
              <Spin />
            </div>
          ) : checkStudentDto ? (
            <div>
              {checkStudentDto.exists && checkStudentDto.canEnroll ? (
                <div className="p-4 border border-gray-300 rounded-md bg-green-50 shadow-sm">
                  <h2 className="text-lg font-semibold text-green-700">Student Information</h2>
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-700"><strong>Name:</strong> {checkStudentDto.user.fullName}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {checkStudentDto.user.email}</p>
                  </div>
                </div>
              ) : !checkStudentDto.canEnroll ? (
                <div className="p-4 border border-red-300 rounded-md bg-red-50 shadow-sm">
                  <h2 className="text-lg font-semibold text-red-700">Enrollment Error</h2>
                  <p className="text-red-600">{checkStudentDto.reason || "No reason provided"}</p>
                </div>
              ) : (
                <div className="p-4 border border-gray-300 rounded-md bg-gray-50 shadow-sm">
                  <h1 className="text-lg text-gray-700 font-semibold">New Student Information</h1>
                  <Form
                    layout="vertical"
                    form={form}
                    name="add-student-form"
                    disabled={addStudentLoading}
                  >
                    <Form.Item
                      name="fullName"
                      label="Full Name"
                      rules={[
                        { required: true, message: "Full Name is required" },
                        { min: 5, message: "Full Name must be at least 5 characters" },
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder="Enter full name"
                        size="large"
                        className="!w-full"
                        allowClear
                      />
                    </Form.Item>
                  </Form>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Enter a valid email to search for a student.</p>
          )}
        </div>
        <div className="mt-4">
          {addStudentError || checkStudentError ? (
            <div className="px-4 py-2 border border-red-500 rounded-md bg-red-50 shadow-sm">
              <h2 className="text-lg text-red-700 font-semibold">Error</h2>
              <p className="text-red-600">{addStudentError || checkStudentError}</p>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default UserEnrollmentModal;
