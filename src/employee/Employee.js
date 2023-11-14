import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@material-ui/core';

function Employee() {
    const url = 'http://localhost:5000/employee';
    const columns = [
        { field: 'employee_id', headerName: 'ID', width: 100, editable: false },
        { field: 'name_first_name', headerName: 'First Name', width: 200, editable: true },
        { field: 'name_last_name', headerName: 'Last Name', width: 200, editable: true },
        { field: 'employee_role', headerName: 'Role', width: 200, editable: true },
        { field: 'phone_number', headerName: 'Phone Number', width: 200, editable: true },
        { field: 'employee_email', headerName: 'Email', width: 200, editable: true },
        { field: 'employee_password', headerName: 'Password (Hashed)', width: 300, editable: true, },
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
                            onClick={() => deleteEmployeeAPI(params.row.employee_id)}
                        >
                            Delete
                        </Button>
                    </>
                );
            },
        }
    ];
    const [rows, setRows] = useState([
        {
            employee_id: '1',
            name_first_name: 'DEFAULT',
            name_last_name: 'DEFAULT',
            employee_role: 'DEFAULT',
            phone_number: 'DEFAULT',
            employee_email: 'DEFAULT',
            employee_password: 'DEFAULT',
        },
    ]);
    const emptyEmployee = JSON.parse(JSON.stringify({
        name_first_name: '',
        name_last_name: '',
        employee_role: '',
        phone_number: '',
        employee_email: '',
        employee_password: '',
    }));
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });
    const [modalOpen, setModalOpen] = React.useState(false);
    const [newEmployee, setNewEmployee] = React.useState(emptyEmployee);
    const [errors, setErrors] = useState({
        employee_email: '',
        phone_number: '',
    });

    const shouldSaveButtonBeDisabled = () => {
        return Object.values(errors).some(error => error !== '') || Object.values(newEmployee).some(value => value === '');
    };
    function handleSaveRow(row) {
        editEmployeeAPI(row.employee_id, row);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newErrors = { ...errors, [name]: '' };

        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (name === "employee_email" && !emailPattern.test(value)) {
            newErrors.employee_email = "Please enter a valid email address.";
        }

        // Validate phone number
        const phoneNumberPattern = /^\d{10}$/;
        if (name === "phone_number" && !phoneNumberPattern.test(value)) {
            newErrors.phone_number = "Phone number must be 10 digits.";
        }
        setErrors(newErrors);
        setNewEmployee({ ...newEmployee, [name]: value });
    };

    const handleSaveEmployee = async () => {
        addEmployeeAPI(newEmployee);

        // Reset the form and close the modal
        setNewEmployee(emptyEmployee);
        setModalOpen(false);
    };

    useEffect(() => {
        // get employees
        async function fetchData() {
            try {
                const response = await fetch(url, { mode: 'cors' });
                const data = await response.json();
                setRows(data);
            } catch (error) {
                setBanner({ active: true, message: 'There was an error fetching the employees data.', type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            }
        }
        fetchData();
    }, []);
    function addEmployeeAPI(newEmployee) {
        fetch(`${url}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEmployee),
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const employeeFromDb = data.employee;
                    newEmployee = employeeFromDb;
                    setBanner({ active: true, message: 'Employee added successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    // update the id
                    const updatedRows = [...rows, newEmployee];
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to add the employee: ' + data.message, type: 'error' });
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
    function deleteEmployeeAPI(employeeId) {
        fetch(`${url}/delete/${employeeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setRows(rows.filter(employee => employee.employee_id !== employeeId));
                    setBanner({ active: true, message: 'Employee deleted successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                } else {
                    setBanner({ active: true, message: 'Failed to delete the employee: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to delete the employee: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
            });
    }

    function editEmployeeAPI(employee_id, field) {
        fetch(`${url}/edit/${employee_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(field),
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setBanner({ active: true, message: 'Employee edited successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    const updatedRows = rows.map(item => {
                        if (item.employee_id === employee_id) {
                            item = data.employee;
                        }
                        return item;
                    })
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to edit the employee: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to edit the employee: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
            });

    }


    return (
        <>
            <h1>Employee</h1>
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
                    pageSize={15}
                    getRowId={(row) => row.employee_id}
                    onCellEditStop={(params, event) => {
                        if (params.field == "employee_password") {
                            const updatedRows = rows.map(row => {
                                if (row.employee_id === params.id) {
                                    row.hasPasswordBeenEdited = true;
                                    row.employee_password = event.target.value;
                                }
                                return row;
                            });
                            setRows(updatedRows);
                        }
                    }}
                    autoHeight
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                />
                <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogContent>
                        <TextField name="name_first_name" label="First Name" fullWidth value={newEmployee.name_first_name} onChange={handleChange} />
                        <TextField name="name_last_name" label="Last Name" fullWidth value={newEmployee.name_last_name} onChange={handleChange} />
                        <TextField name="employee_role" label="Employee Role" fullWidth value={newEmployee.employee_role} onChange={handleChange} />
                        <TextField name="phone_number" label="Phone Number" fullWidth value={newEmployee.phone_number} onChange={handleChange}
                            error={!!errors.phone_number}
                            helperText={errors.phone_number} />
                        <TextField name="employee_email" label="Email" fullWidth value={newEmployee.employee_email} onChange={handleChange}
                            error={!!errors.employee_email}
                            helperText={errors.employee_email} />
                        <TextField name="employee_password" label="Pasword" fullWidth value={newEmployee.employee_password} onChange={handleChange} />


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setModalOpen(false)} color="primary">Cancel</Button>
                        <Button onClick={handleSaveEmployee} color="primary" disabled={shouldSaveButtonBeDisabled()}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}

export default Employee;
