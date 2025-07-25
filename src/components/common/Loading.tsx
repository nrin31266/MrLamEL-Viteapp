import { Alert, Spin } from "antd";
import React from "react";
interface LoadingProps {
    tip?: string;
    size?: "small" | "default" | "large";
}

const Loading = ({ tip, size }: LoadingProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
      <Spin size={size || "large"}>
      </Spin>
    </div>
  );
};

export default Loading;
