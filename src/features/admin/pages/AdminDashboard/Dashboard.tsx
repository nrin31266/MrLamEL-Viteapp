import React from 'react';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined, HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 m-0">
          Dashboard Overview
        </h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng cơ sở"
              value={3}
              prefix={<HomeOutlined className="text-blue-600" />}
              valueStyle={{ color: '#2563eb' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="Total Users"
              value={1234}
              prefix={<UserOutlined className="text-green-600" />}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="Teachers"
              value={45}
              prefix={<TeamOutlined className="text-purple-600" />}
              valueStyle={{ color: '#9333ea' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="Students"
              value={1189}
              prefix={<BookOutlined className="text-red-600" />}
              valueStyle={{ color: '#dc2626' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="Thao tác nhanh" className="shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            type="default"
            icon={<PlusOutlined />}
            size="large"
            className="h-16 flex flex-col items-center justify-center"
            onClick={() => navigate('/admin/branches/create')}
          >
            <span>Thêm cơ sở mới</span>
          </Button>
          <Button
            type="default"
            icon={<UserOutlined />}
            size="large"
            className="h-16 flex flex-col items-center justify-center"
            onClick={() => navigate('/admin/users')}
          >
            <span>Quản lý người dùng</span>
          </Button>
          <Button
            type="default"
            icon={<HomeOutlined />}
            size="large"
            className="h-16 flex flex-col items-center justify-center"
            onClick={() => navigate('/admin/branches')}
          >
            <span>Xem tất cả cơ sở</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard