import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
  Upload,
  type UploadFile,
  type UploadProps,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  createCourse,
  updateCourse,
  fetchCourseById,
  type ICourseDto,
} from "../../../../store/admin/courseSlide";
import Loading from "../../../../components/common/Loading";
import { uploadAntDImage } from "../../../firebase/uploadImage";
import { IoChevronBack } from "react-icons/io5";
const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const isEditing = !!id;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const props: UploadProps = {
    beforeUpload: (file) => {
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          originFileObj: file,
          thumbUrl: URL.createObjectURL(file), // 👈 quan trọng
        },
      ]);
      return false; // để không upload tự động
    },
    // fileList,
    fileList: fileList,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },

    accept: ".png, .jpg, .jpeg",
    maxCount: 1,
    listType: "picture-card",
  };
  const {
    fetchById: fetchByIdLoading,
    create: createLoading,
    update: updateLoading,
  } = useAppSelector((state) => state.admin.course.loadings);
  const {
    fetchById: fetchByIdError,
    create: createError,
    update: updateError,
  } = useAppSelector((state) => state.admin.course.error);
  const selectedCourse = useAppSelector(
    (state) => state.admin.course.selectedCourse
  );

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchCourseById(Number(id)));
    }
  }, [id, dispatch, isEditing]);

  useEffect(() => {
    if (isEditing && selectedCourse) {
      form.setFieldsValue(selectedCourse);
      if (selectedCourse.logoUrl) {
        setFileList([
          {
            uid: selectedCourse.logoUrl,
            name: "logo.png",
            status: "done",
            url: selectedCourse.logoUrl,
          },
        ]);
      }
    } else {
      form.resetFields();
    }
  }, [selectedCourse, isEditing, form]);

  const onFinish = async (values: Partial<ICourseDto>) => {
    try {
      setIsUploading(true);
      const logoUrl = await uploadAntDImage(fileList[0]);
      values.logoUrl = logoUrl;
      setFileList((pre) => [
        {
          ...pre[0],
          url: logoUrl,
        },
      ]);
    } catch (error) {
      message.error("Failed to upload course logo!");
      return;
    } finally {
      setIsUploading(false);
    }
    if (isEditing) {
      await dispatch(
        updateCourse({ id: Number(id), courseData: values })
      ).unwrap();
      message.success("Course updated successfully!");
    } else {
      await dispatch(createCourse(values)).unwrap();
      message.success("New course added successfully!");
    }
    navigate("/admin/courses");
  };

  const handleCancel = () => {
    navigate("/admin/courses");
  };

  if (isEditing && fetchByIdLoading) {
    return <Loading />;
  }
  const loading = updateLoading || createLoading || isUploading;

  return (
    <div className="min-h-screen container max-w-[43rem] mx-auto space-y-6">
      <div>
        <Button icon={<IoChevronBack />} onClick={handleCancel} className="hover:bg-gray-100 mb-4">
          Back
        </Button>
      </div>
      <div className="w-full p-6 bg-white rounded-md shadow-md">
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 m-0">
            {isEditing ? "Edit Course" : "Add New Course"}
          </h2>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update course information"
              : "Fill in the information to create a new course"}
          </p>
        </div>
        <Form
          name="courseForm"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="on"
          size="large"
        >
          <Form.Item
            label="Course Code"
            name="code"
            rules={[{ required: true, message: "Please enter course code!" }]}
          >
            <Input placeholder="e.g. EN101" />
          </Form.Item>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[{ required: true, message: "Please enter course name!" }]}
          >
            <Input placeholder="e.g. English for Beginners" />
          </Form.Item>
          <Form.Item
            label="Total Sessions"
            name="totalSessions"
            rules={[
              { required: true, message: "Please enter total sessions!" },
            ]}
          >
            <InputNumber
              min={1}
              max={100}
              style={{ width: "100%" }}
              placeholder="e.g. 20"
            />
          </Form.Item>
          <Form.Item
            label="Fee"
            name="fee"
            rules={[{ required: true, message: "Please enter course fee!" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="e.g. 2000000"
            />
          </Form.Item>
          <Form.Item label="MRP Fee" name="mrpFee">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="e.g. 2500000"
            />
          </Form.Item>
          <Form.Item
            label="Course Logo"
            name="logo"
            rules={[
              {
                validator: (_, value) =>
                  fileList.length > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Please upload a course logo!")),
              },
            ]}
          >
            <Upload {...props}>
              <span className="text-gray-500">
                {fileList.length > 0 ? "Change Logo" : "Upload Course Logo"}
              </span>
            </Upload>
          </Form.Item>
          {createError || updateError ? (
            <p className="error">{isEditing ? updateError : createError}</p>
          ) : null}
          <div className="flex justify-end space-x-3 pt-6 gap-4 border-gray-200">
            <Button size="large" onClick={handleCancel} className="min-w-24">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 min-w-32"
              loading={loading}
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update"
                : "Save"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CourseForm;
