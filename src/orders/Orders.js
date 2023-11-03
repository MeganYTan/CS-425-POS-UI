import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@material-ui/data-grid';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@material-ui/core';
import OrdersModal from './OrdersModal';

function Order() {
    const url = 'http://localhost:5000/orders';
    const [rows, setRows] = useState([
        {
            order_id: 1,
            customer_id: 1,
            discount_id: 1,
            employee_id: 1,
            date_time: "",
            order_products: "1:1",
            order_total: 1,
            payment_amount: 1,
            payment_method: "DEFAULT"
        },
    ]);
    const emptyOrder = JSON.parse(JSON.stringify({
        order_id: "",
        customer_id: "",
        discount_id: "",
        employee_id: "",
        date_time: "",
        order_products: "",
        order_total: "",
        payment_amount: "",
        payment_method: "DEFAULT"
    }));
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });
    const [newOrder, setNewOrder] = React.useState(emptyOrder);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const columns = [
        { field: 'order_id', headerName: 'ID', width: 100, editable: false },
        { field: 'customer_id', headerName: 'Customer', width: 150, editable: true },
        { field: 'discount_id', headerName: 'Discount', width: 150, editable: true },
        { field: 'employee_id', headerName: 'Employee ID', width: 170, editable: true },
        { field: 'date_time', headerName: 'Date and Time', width: 250, editable: true },
        { field: 'order_products', headerName: 'Products: Quantity', width: 250, editable: true },
        { field: 'order_total', headerName: 'Order Amount', width: 170, editable: true, },
        { field: 'payment_amount', headerName: 'Payment Amount', width: 190, editable: true, },
        { field: 'payment_method', headerName: 'Payment Method', width: 190, editable: true, },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleSaveRow(params.row)}
                        >
                            Save
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => deleteOrderAPI(params.row.employee_id)}
                        >
                            Delete
                        </Button>
                    </>
                );
            },
        }
    ];


    function handleSaveRow(row) {
        editOrderAPI(row.employee_id, row);
    }

    const handleChange = (e) => {
        setNewOrder({
            ...newOrder,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveOrder = async () => {
        addOrderAPI(newOrder);
        // Reset the form and close the modal
        setNewOrder(emptyOrder);
        setIsModalOpen(false);
    };

    useEffect(() => {
        // get orders
        async function fetchData() {
            try {
                const response = await fetch(url, { mode: 'cors' });
                const data = await response.json();
                setRows(data);
            } catch (error) {
                setBanner({ active: true, message: 'There was an error fetching the orders data.', type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            }
        }
        fetchData();
    }, []);
    function addOrderAPI(newOrder) {
        fetch(`${url}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder),
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const employeeFromDb = data.employee;
                    newOrder = employeeFromDb;
                    setBanner({ active: true, message: 'Order added successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    // update the id
                    const updatedRows = [...rows, newOrder];
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to add the employee.', type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    // remove the employee from the row
                    setRows(rows.filter(employee => employee.employee_id != ""));
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to add the employee. Error:' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            });
    }
    const deleteOrderAPI = async (orderId) => {
        try {
            const response = await fetch(`${url}/delete/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors'
            });
            if (response.ok) {
                setRows(rows.filter(order => order.order_id !== orderId));
                setBanner({ active: true, message: 'Order deleted successfully!', type: 'success' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            } else {
                setBanner({ active: true, message: 'Failed to delete the order.', type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            }
        } catch (error) {
            console.error('There was an error deleting the order.', error);
        }
    };

    function editOrderAPI(employee_id, field, value) {
        console.log(field);
        fetch(`${url}/edit/${employee_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(field),
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    setBanner({ active: true, message: 'Order edited successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    const updatedRows = rows.map(item => {
                        if (item.employee_id === employee_id) {
                            item = data.employee;
                            console.log(item);
                        }
                        return item;
                    })
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to edit the employee.', type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to edit the employee.', type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            });

    }


    return (
        <>
            <h2>Order -- to do</h2>
            {banner.active && <Banner message={banner.message} type={banner.type} />}
            <div style={{ height: '80vh', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <Button variant="contained" color="primary" onClick= {openModal}>

                        Add +
                    </Button>
                </div>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={100}
                    getRowId={(row) => row.order_id}
                    editMode="row"
                    onCellEditCommit={(params, event) => {
                        console.log(params);
                        if (params.field == "employee_password") {
                            const updatedRows = rows.map(row => {
                                if (row.employee_id === params.id) {
                                    row.hasPasswordBeenEdited = true;
                                    row.employee_password = params.value;
                                }
                                return row;
                            });
                            setRows(updatedRows);
                        }
                    }}
                />
                {isModalOpen && <OrdersModal open={isModalOpen} closePopup={closeModal} />}
            </div>
        </>
    );
}

export default Order;
