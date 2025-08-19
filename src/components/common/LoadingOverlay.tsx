import { Spin } from "antd";
import React from "react";

const LoadingOverlay = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 0,
        width: "100%",
        height: "calc(100% - 50px)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="flex flex-col gap-5"
    >
      <Spin size="large" />
      <h1 className="text-lg font-semibold text-gray-500">Loading...</h1>
    </div>
  );
};

export default LoadingOverlay;
