import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Radio,
  Steps,
  message,
  Checkbox,
} from "antd";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { setMyInfo, updateProfile } from "../../../../store/authSlide";
import { useNavigate } from "react-router-dom";

const { Step } = Steps;

const UpdateProfile: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loadings.updateProfile);
  const error = useAppSelector((state) => state.auth.errors.updateProfile);
  const dispatch = useAppDispatch();
  // Watch form values for real-time updates
  const fullName = Form.useWatch("fullName", form);
  const dob = Form.useWatch("dob", form);
  const gender = Form.useWatch("gender", form);
  const phoneNumber = Form.useWatch("phoneNumber", form);
  const address = Form.useWatch("address", form);
  
  const navigate = useNavigate();
  if (!user) return null;

  const next = async () => {
    try {
      await form.validateFields(stepFields[currentStep]);
      setCurrentStep(currentStep + 1);
    } catch (err) {
      console.log("Validation failed", err);
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const onFinish = (values: { fullName: string; dob: any; gender: "MALE" | "FEMALE" | "OTHER"; phoneNumber: string; address: string }) => {
    // Format date for Spring Boot
    const formattedValues = {
      ...values,
      dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
    };
    console.log("Submit values:", formattedValues);
    dispatch(updateProfile(formattedValues))
      .unwrap()
      .then(() => {
        message.success("Profile updated successfully!");
        dispatch(setMyInfo({...user, ...formattedValues, profileComplete: true})); // Update user info in store
        navigate(`/`); // Redirect to home page
      });
  };

  const stepFields: Record<number, string[]> = {
    0: ["fullName", "dob", "gender"],
    1: ["phoneNumber", "address"],
    2: [], // no validation
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-8 md:rounded-sm md:shadow-md w-full md:w-[600px] mx-auto">
      <h2 className="text-xl font-semibold mb-4">Update Personal Profile</h2>
      <Steps current={currentStep} className="!w-full !mb-4">
        <Step title="Basic Information" />
        <Step title="Contact" />
        <Step title="Confirmation" />
      </Steps>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fullName: user.fullName,
          dob: user.dob ? dayjs(user.dob) : null,
          gender: user.gender,
          phoneNumber: user.phoneNumber,
          address: user.address,
        }}
        onFinish={onFinish}
        size="large"
        className="w-full"
        disabled={loading}
      >
        <div style={{ display: currentStep === 0 ? "block" : "none" }}>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full"
              // showToday={false}}
              picker="date"
              placeholder="Select date or type (DD/MM/YYYY)"
            />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select your gender" }]}
          >
            <Radio.Group>
              <Radio value="MALE">Male</Radio>
              <Radio value="FEMALE">Female</Radio>
              <Radio value="OTHER">Other</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div style={{ display: currentStep === 1 ? "block" : "none" }}>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input placeholder="Enter your address" />
          </Form.Item>
        </div>

        <div style={{ display: currentStep === 2 ? "block" : "none" }}>
          <div className="text-center text-sm text-gray-500 mb-6">
            Please review your information before updating.
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">Review Your Information:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Full Name:</strong> {fullName || "Not entered"}
              </div>
              <div>
                <strong>Date of Birth:</strong>{" "}
                {dob ? dob.format("DD/MM/YYYY") : "Not selected"}
              </div>
              <div>
                <strong>Gender:</strong>{" "}
                {gender === "MALE"
                  ? "Male"
                  : gender === "FEMALE"
                  ? "Female"
                  : gender === "OTHER"
                  ? "Other"
                  : "Not selected"}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Phone Number:</strong> {phoneNumber || "Not entered"}
              </div>
              <div>
                <strong>Address:</strong> {address || "Not entered"}
              </div>
              <div>
                <strong>Role:</strong> {user.role}
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 mb-4">
            By checking the box below, you confirm that all the information
            provided is accurate.
          </div>

          <Form.Item
            name="confirm"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("You must confirm the information")
                      ),
              },
            ]}
          >
            <Checkbox>
              I confirm that the information provided is correct
            </Checkbox>
          </Form.Item>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="flex justify-between mt-6">
          {currentStep > 0 && <Button onClick={prev}>Back</Button>}
          <div className={currentStep === 0 ? "ml-auto" : ""}>
            {currentStep < 2 && (
              <Button type="primary" onClick={next}>
                Next
              </Button>
            )}
            {currentStep === 2 && (
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Profile
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UpdateProfile;
