import { Button, Form, Input, Space } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  sendEmailVerification,
  setMyInfo,
  verifyEmail,
} from "../../../../store/authSlide";
import { useNavigate } from "react-router-dom";
const LAST_EMAIL_RESEND_TIME = "last_email_resend_time";
const RESEND_COOLDOWN = 30; // 30 giây
const VerifyEmail = () => {
  const [countdown, setCountdown] = useState<number>(0);
  const { loadings, errors, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const lastResendTime = localStorage.getItem(LAST_EMAIL_RESEND_TIME);
    if (lastResendTime) {
      const elapsed = Math.floor((Date.now() - Number(lastResendTime)) / 1000);
      if (elapsed < RESEND_COOLDOWN) {
        setCountdown(RESEND_COOLDOWN - elapsed);
      }
    }
  }, []);

  // Xử lý đếm ngược
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendEmail = () => {
    if (countdown > 0) return; // Không cho gửi lại nếu đang đếm ngược
    // Gửi yêu cầu gửi lại email xác thực
    dispatch(sendEmailVerification())
      .unwrap()
      .then(() => {
        localStorage.setItem(LAST_EMAIL_RESEND_TIME, String(Date.now()));
        setCountdown(RESEND_COOLDOWN);
      });
  };

  const handleVerifyEmail = (values: { token: string }) => {
    dispatch(verifyEmail(values.token))
      .unwrap()
      .then(() => {
        // Xử lý thành công, có thể điều hướng hoặc thông báo

        dispatch(
          setMyInfo({
            ...user,
            active: true, // Giả sử xác thực thành công sẽ kích hoạt tài khoản
          })
        ); // Cập nhật lại thông tin người dùng
        navigate("/");
      });
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-md w-auto md:w-96">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Verify Email</h1>
        <p className="text-gray-600 mt-2">
          Please check your email for the verification token.
        </p>
      </div>

      <Form
        onFinish={handleVerifyEmail}
        disabled={loadings.sendEmailVerification || loadings.verifyEmail}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="token"
          rules={[
            { required: true, message: "Please enter the verification token!" },
          ]}
        >
          <Input placeholder="Enter verification token" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            size="large"
            loading={loadings.verifyEmail}
            disabled={loadings.sendEmailVerification || loadings.verifyEmail}
          >
            Verify Email
          </Button>
          {errors.emailVerification && (
            <p className="text-red-500">{errors.emailVerification}</p>
          )}
        </Form.Item>
      </Form>

      <div className="text-center flex flex-col text-gray-600">
        <div>
          <span>Didn't receive the token? </span>
          <Button
            disabled={countdown > 0}
            type="link"
            size="large"
            loading={loadings.sendEmailVerification}
            onClick={handleResendEmail}
            className="text-primary font-medium"
          >
            {countdown > 0 ? `Resend Token (${countdown}s)` : "Resend Token"}
          </Button>
        </div>

        <div>
          <span>Or </span>
          <Button
            size="large"
            type="link"
            onClick={() => {}}
            className="text-primary font-medium"
          >
            Use Different Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
