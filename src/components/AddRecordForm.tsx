import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const AddRecordForm = ({ onRecordAdded }: { onRecordAdded: () => void }) => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { url: string; title: string; description: string }) => {
        setLoading(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}media`,
                {
                    url: values.url,
                    title: values.title,
                    description: values.description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                }
            );
            message.success('Record added successfully!');
            onRecordAdded(); 
        } catch (error) {
            console.error('Error adding record:', error);
            message.error('Failed to add record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 400, margin: '0 auto', marginBottom: 24 }}
        >
            <Form.Item
                label="URL"
                name="url"
                rules={[{ required: true, message: 'Please enter the URL' }]}
            >
                <Input placeholder="Enter URL" />
            </Form.Item>
            <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please enter the title' }]}
            >
                <Input placeholder="Enter title" />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter the description' }]}
            >
                <Input.TextArea placeholder="Enter description" rows={4} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Add Record
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddRecordForm;