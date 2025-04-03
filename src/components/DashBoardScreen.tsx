import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Table, Space, Typography, Row, Col, Select } from 'antd';
import { SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../api/auth';

const { Title } = Typography;
const { Option } = Select;

interface DataItem {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

const DashboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<DataItem[]>([]);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<string | null>(null);

    useEffect(() => {
        // Mock data fetch
        const mockData: DataItem[] = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Editor' : 'Viewer',
            status: i % 4 === 0 ? 'Active' : 'Inactive',
        }));
        setData(mockData);
        setFilteredData(mockData);
    }, []);

    useEffect(() => {
        let result = [...data];

        // Search filter
        if (searchText) {
            result = result.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(searchText.toLowerCase())
                )
            );
        }

        // Sorting
        if (sortField && sortOrder) {
            result.sort((a, b) => {
                const aValue = a[sortField as keyof DataItem];
                const bValue = b[sortField as keyof DataItem];

                if (aValue < bValue) return sortOrder === 'ascend' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'ascend' ? 1 : -1;
                return 0;
            });
        }

        setFilteredData(result);
        setPagination(prev => ({ ...prev, current: 1 }));
    }, [searchText, sortField, sortOrder, data]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            sorter: true,
            filters: [
                { text: 'Admin', value: 'Admin' },
                { text: 'Editor', value: 'Editor' },
                { text: 'Viewer', value: 'Viewer' },
            ],
            onFilter: (value: any, record: DataItem) => record.role === String(value as string | number | boolean),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Inactive', value: 'Inactive' },
            ],
            onFilter: (value: any, record: DataItem) => record.status === String(value as string | number | boolean),
        },
    ];

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setPagination(pagination);
        setSortField(sorter.field);
        setSortOrder(sorter.order);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={2}>Dashboard</Title>
                </Col>
                <Col>
                    <Button type="primary" danger onClick={handleLogout} icon={<LogoutOutlined />}>
                        Logout
                    </Button>
                </Col>
            </Row>

            <Card style={{ marginBottom: 24 }}>
                <Row gutter={16} align="middle">
                    <Col span={8}>
                        <Input
                            placeholder="Search..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col span={8}>
                        <Select
                            placeholder="Filter by role"
                            style={{ width: '100%' }}
                            allowClear
                            onChange={(value) => {
                                if (value) {
                                    setFilteredData(data.filter(item => item.role === value));
                                } else {
                                    setFilteredData(data);
                                }
                            }}
                        >
                            <Option value="Admin">Admin</Option>
                            <Option value="Editor">Editor</Option>
                            <Option value="Viewer">Viewer</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            <Card title="User Management">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    pagination={pagination}
                    onChange={handleTableChange}
                />
            </Card>

            <Row gutter={16} style={{ marginTop: 24 }}>
                {[1, 2, 3].map(item => (
                    <Col span={8} key={item}>
                        <Card title={`Card ${item}`}>
                            <p>Some quick information here</p>
                            <p>Card content can be customized</p>
                            <Button type="link">View Details</Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DashboardScreen;