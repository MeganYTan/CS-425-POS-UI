import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@material-ui/core';

function Customer() {
    const url = 'http://localhost:5000/customer';
    const columns = [
        { field: 'customer_id', headerName: 'ID', width: 130, editable: false },
        { field: 'name_first_name', headerName: 'First Name', width: 200, editable: true },
        { field: 'name_last_name', headerName: 'Last Name', width: 200, editable: true },
        { field: 'email', headerName: 'Email', width: 200, editable: true },
        { field: 'loyalty_points', headerName: 'Loyalty Points', width: 200, editable: true },
        { field: 'phone_number', headerName: 'Phone Number', width: 200, editable: true },
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
                            onClick={() => deleteCustomerAPI(params.row.customer_id)}
                        >
                            Delete
                        </Button>
                    </>
                );
            },
        }
    ];
    const [rows, setRows] = useState([
    ]);
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });
    const [modalOpen, setModalOpen] = React.useState(false);
    const [newCustomer, setNewCustomer] = React.useState({
        name_first_name: '',
        name_last_name: '',
        email: '',
        loyalty_points: '',
        phone_number: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        phone_number: '',
    });
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneNumberPattern = /^\d{10}$/;
    const shouldSaveButtonBeDisabled = () => {
        return Object.values(errors).some(error => error !== '') || Object.values(newCustomer).some(value => value === '');
    };
    function handleSaveRow(row) {
        console.log(row);
        // validate email
        if (!emailPattern.test(row.email)) {
            setBanner({ active: true, message: 'Email is not valid.', type: 'error' });
            setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            return;
        } else if (!phoneNumberPattern.test(row.phone_number)) {
            setBanner({ active: true, message: 'Phone number is not valid', type: 'error' });
            setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            return;
        }
        editCustomerAPI(row.customer_id, row);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newErrors = { ...errors, [name]: '' };
        if (name === "email" && !emailPattern.test(value)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (name === "phone_number" && !phoneNumberPattern.test(value)) {
            newErrors.phone_number = "Phone number must be 10 digits.";
        }

        setErrors(newErrors);
        setNewCustomer({ ...newCustomer, [name]: value });
    };

    const handleSaveCustomer = async () => {
        addCustomerAPI(newCustomer);

        // Reset the form and close the modal
        setNewCustomer({
            name_first_name: '',
            name_last_name: '',
            email: '',
            loyalty_points: '',
            phone_number: ''
        });
        setModalOpen(false);
    };

    useEffect(() => {
        // get customers
        async function fetchData() {
            try {
                const response = await fetch(url, { mode: 'cors' });
                const data = await response.json();
                setRows(data);
            } catch (error) {
                setBanner({ active: true, message: 'There was an error fetching the customers data.', type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            }
        }
        fetchData();
    }, []);

    function deleteCustomerAPI(customerId) {
        fetch(`${url}/delete/${customerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        })
            .then((response) => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    setRows(rows.filter(customer => customer.customer_id !== customerId));
                    setBanner({ active: true, message: 'Customer deleted successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                } else {
                    setBanner({ active: true, message: 'Failed to delete the customer: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to delete the customer: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
            });

    }

    function editCustomerAPI(customer_id, field, value) {
        fetch(`${url}/edit/${customer_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(field),
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setBanner({ active: true, message: 'Customer edited successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    const updatedRows = rows.map(item => {
                        if (item.customer_id === customer_id) {
                            item = field;
                        }
                        return item;
                    })
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to edit the customer: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to delete the customer: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
            });

    }
    function addCustomerAPI(newCustomer) {
        fetch(`${url}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCustomer)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.customer_id) {
                    newCustomer.customer_id = data.customer_id;
                    setBanner({ active: true, message: 'Customer added successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    // update the id
                    const updatedRows = [...rows, newCustomer];
                    console.log(updatedRows);
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to add the customer: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
                    // remove the customer from the row
                    setRows(rows.filter(customer => customer.customer_id != ""));
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to delete the customer: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
            });
    }

    return (
        <>
            <h1>Customer</h1>
            {banner.active && <Banner message={banner.message} type={banner.type} />}
            <div >
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>

                        Add +
                    </Button>

                </div>

                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.customer_id}
                    autoHeight
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                />
                <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogContent>
                        <TextField name="name_first_name" label="First Name" fullWidth value={newCustomer.name_first_name} onChange={handleChange} />
                        <TextField name="name_last_name" label="Last Name" fullWidth value={newCustomer.name_last_name} onChange={handleChange} />
                        <TextField name="loyalty_points" type="number" label="Loyalty Points" fullWidth value={newCustomer.loyalty_points} onChange={handleChange} />
                        <TextField
                            name="email"
                            label="Email"
                            fullWidth
                            value={newCustomer.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            name="phone_number"
                            label="Phone Number"
                            fullWidth
                            value={newCustomer.phone_number}
                            onChange={handleChange}
                            error={!!errors.phone_number}
                            helperText={errors.phone_number}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setModalOpen(false)} color="primary">Cancel</Button>
                        <Button onClick={handleSaveCustomer} color="primary" disabled={shouldSaveButtonBeDisabled()}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>

        </>
    );
}

export default Customer;
