import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Table, Typography, Row, Col, Select, Modal, TablePaginationConfig } from 'antd';
import { SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../api/auth';
import axios from 'axios';
import AddRecordForm from './AddRecordForm';

const { Title } = Typography;

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
    const [total, setTotal] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}media`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                params: {
                    title: searchText || undefined,
                    limit: pagination.pageSize,
                    offset: (pagination.current - 1) * pagination.pageSize,
                },
            });
            setData([...response.data.data]);
            setFilteredData([...response.data.data]);
            setTotal(response.data.total); 
            setPagination({ ...pagination});
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize, searchText]);
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleTableChange = (pagination: {current: number, pageSize: number}) => {
        setPagination({
            ...pagination,
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: false,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            sorter: false,
        },
        {
            title: 'Url',
            dataIndex: 'url',
            sorter: false,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: false,
        },
    ];
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
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
                            placeholder="Search by title, description"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col span={4}>
                    <Button type="primary" onClick={showModal}>
                        Add Record
                    </Button>
                </Col>
                </Row>
            </Card>
            <Modal
                title="Add New Record"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null} // No default footer buttons
            >
                <AddRecordForm
                    onRecordAdded={() => {
                        fetchData(); // Refresh data after adding a record
                        setIsModalVisible(false); // Close the modal
                    }}
                />
            </Modal>

            <Card title="Media Management">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: total,
                        onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                    }}
                />
            </Card>
        </div>
    );
};

export default DashboardScreen;