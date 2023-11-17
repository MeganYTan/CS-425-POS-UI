import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@material-ui/core';
import OrdersModal from './OrdersModal';

function Order() {
    const url = 'http://localhost:5000/orders';
    const [rows, setRows] = useState([
    ]);

    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalSource, setModalSource] = React.useState("");
    const [modalData, setModalData] = React.useState({});
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false); 
    const columns = [
        { field: 'order_id', headerName: 'ID', width: 100, editable: false },
        { field: 'customer_id', headerName: 'Customer', width: 150, editable: false },
        { field: 'discount_id', headerName: 'Discount', width: 150, editable: false },
        { field: 'employee_id', headerName: 'Employee ID', width: 170, editable: false },
        { field: 'date_time', headerName: 'Date and Time', width: 250, editable: false },
        { field: 'order_products', headerName: 'Products: Quantity', width: 250, editable: false },
        // { field: 'order_total', headerName: 'Order Amount', width: 170, editable: false, },
        { field: 'payment_amount', headerName: 'Payment Amount', width: 190, editable: false, },
        { field: 'payment_method', headerName: 'Payment Method', width: 180, editable: false, },
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
                            onClick={() => handleEditRow(params.row)}
                        >
                            Edit
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => deleteOrderAPI(params.row.order_id)}
                        >
                            Delete
                        </Button>
                    </>
                );
            },
        }
    ];
    // get orders
    useEffect(() => {
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

    function handleAddRow(row) {
        openModal();
        setModalSource("ADD");
    }

    function handleEditRow(row) {
        console.log("should start spinning");
        openModal();
        setModalSource("EDIT");
        setModalData(row);
        console.log("should stop spinning'");
    }

    const handleSaveOrder = async (orderData) => {
        console.log(orderData)
        const newDate = new Date(orderData.date);
        const time = new Date(orderData.time);
        newDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
        // massage data
        const apiObject = {
            employee_id: orderData.employeeId,
            date_time: newDate.toISOString().slice(0, 19).replace('T', ' '),
            customer_id: orderData.customerId ? orderData.customerId : null,
            discount_id: orderData.discountId ? orderData.discountId : null,
            payment_method: orderData.paymentMethod,
            payment_amount: orderData.paymentAmount,
            order_products: orderData.rows,
        }
        if (modalSource === "ADD") {
            // add
            addOrderAPI(apiObject);
        } else {
            // edit
            apiObject.order_id = orderData.orderId;
            editOrderAPI(orderData.orderId, apiObject);
        }

        setIsModalOpen(false);
    };


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
                    const orderFromDb = data.order;
                    setBanner({ active: true, message: 'Order added successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    // update the id
                    const updatedRows = [...rows, orderFromDb];
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to add the order: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    // remove the employee from the row
                    setRows(rows.filter(employee => employee.employee_id !== ""));
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to add the order: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            });
    }


    function editOrderAPI(order_id, field) {
        fetch(`${url}/edit/${order_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(field),
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setBanner({ active: true, message: 'Order edited successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    const updatedRows = rows.map(item => {
                        if (item.order_id === order_id) {
                            item = data.order; // order data returned from the DB
                            console.log(item);
                        }
                        return item;
                    });
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to edit the order: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to edit the order: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            });

    }

    function deleteOrderAPI(orderId) {
        fetch(`${url}/delete/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setRows(rows.filter(order => order.order_id !== orderId));
                    setBanner({ active: true, message: 'Order deleted successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                } else {
                    setBanner({ active: true, message: 'Failed to delete the order: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to edit the order: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            });

    }


    return (
        <>
            <h1>Order</h1>
            {banner.active && <Banner message={banner.message} type={banner.type} />}
            <div>
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <Button variant="contained" color="primary" onClick={handleAddRow}>
                        Add +
                    </Button>
                </div>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    getRowId={(row) => row.order_id}
                    editMode="row"
                    autoHeight
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                />
                {isModalOpen && <OrdersModal open={isModalOpen} onClose={closeModal} onSave={handleSaveOrder}
                    source={modalSource}
                    orderData={modalData} />}
            </div>
        </>
    );
}

export default Order;
