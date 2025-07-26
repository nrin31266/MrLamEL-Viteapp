import React, { useState } from "react";
import { Button, Form, Input, Steps, message } from "antd";
import { MdAlternateEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { requestPasswordReset, resetPassword, sendEmailVerification } from "../../../../store/authSlide";
import { useNavigate } from "react-router-dom";

const { Step } = Steps;

const ResetPassword = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const { loadings, errors } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate  = useNavigate();
  const next = async () => {
    try {
      await form.validateFields(stepFields[currentStep]);
      if (currentStep === 0) {
        const emailValue = form.getFieldValue("email");
        setEmail(emailValue);
        // Dispatch action to send reset token
        await dispatch(requestPasswordReset(emailValue)).unwrap().then(() => {
          setCurrentStep(currentStep + 1);
          message.success("Reset token has been sent to your email!");
        });
      }
      
    } catch (err) {
      console.log("Validation failed", err);
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const onFinish = (values: any) => {
    console.log("Reset password values:", values);
    
    // Here you would call API to reset password
    dispatch(resetPassword({ email, ...values })).unwrap().then(() => {
      navigate("/auth/login"); // Redirect to login after successful reset
      message.success("Password has been reset successfully!");
    })
  };

  const stepFields: Record<number, string[]> = {
    0: ["email"],
    1: ["token", "newPassword", "confirmPassword"],
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-8 md:rounded-sm md:shadow-md w-full md:w-[500px] mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <Steps current={currentStep} className="!w-full !mb-6">
        <Step title="Send Token" />
        <Step title="Reset Password" />
      </Steps>

      <Form
        disabled={loadings.resetPassword || loadings.requestPasswordReset}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        size="large"
        className="w-full"
        validateTrigger="onBlur"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (currentStep < 1) {
              next();
            } else {
              form.submit();
            }
          }
        }}
      >
        <div style={{ display: currentStep === 0 ? "block" : "none" }}>
          <div className="text-center text-gray-500 mb-6">
            Enter your email address and we'll send you a reset token.
          </div>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              type="email"
              prefix={<MdAlternateEmail />}
              placeholder="Enter your email address"
            />
          </Form.Item>
        </div>

        <div style={{ display: currentStep === 1 ? "block" : "none" }}>
          <div className="text-center text-gray-500 mb-6">
            Enter the reset token sent to <strong>{email}</strong> and your new
            password.
          </div>
          <Form.Item
            label="Reset Token"
            name="token"
            rules={[
              { required: true, message: "Please enter the reset token" },
            ]}
          >
            <Input
              placeholder="Enter the 6-digit token from your email"
              maxLength={6}
            />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 3, message: "Password must be at least 3 characters" },
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password
              prefix={<FaKey />}
              placeholder="Enter your new password"
            />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password
              prefix={<FaKey />}
              placeholder="Confirm your new password"
            />
          </Form.Item>
        </div>
        {errors.passwordReset && (
          <p className="text-red-500">{errors.passwordReset}</p>
        )}
        <div className="flex justify-between mt-6">
          {currentStep > 0 && <Button onClick={prev}>Back</Button>}
          <div className={currentStep === 0 ? "ml-auto" : ""}>
            {currentStep < 1 && (
              <Button
                type="primary"
                loading={loadings.requestPasswordReset}
                onClick={next}
              >
                Send Token
              </Button>
            )}
            {currentStep === 1 && (
              <Button
                type="primary"
                loading={loadings.resetPassword}
                htmlType="submit"
              >
                Reset Password
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ResetPassword;
