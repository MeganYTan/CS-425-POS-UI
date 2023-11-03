import React, { useState, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';

const OrdersModal = ({ open, onClose, onSave }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [customerId, setCustomerId] = useState("");
    const [discountId, setDiscountId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [products, setProducts] = useState([]);

    const [customers, setCustomers] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const url = 'http://localhost:5000';
    const customersUrl = url + '/customer';
    const discountUrl = url + '/discount';
    const employeeUrl = url + '/employee';
    // Fetch dropdown options on component mount or when opening the popup
    useEffect(() => {
        if (open) {
            // fetch customers, discounts, and employees
            // setCustomers, setDiscounts, setEmployees
            fetchCustomers();
            fetchDiscounts();
            fetchEmployees();
        }
    }, [open]);
    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${customersUrl}`, { mode: 'cors' });
            const data = await response.json();
            setCustomers(data);
            console.log(customers);
        } catch (error) {
            console.log("Error fetching customers");
        }
    }
    const fetchDiscounts = async () => {
        try {
            const response = await fetch(discountUrl, { mode: 'cors' });
            const data = await response.json();
            setDiscounts(data => data.map(row => row.discount_id));
        } catch (error) {
            console.log("Error fetching discounts");
        }
    }
    const fetchEmployees = async () => {
        try {
            const response = await fetch(employeeUrl, { mode: 'cors' });
            const data = await response.json();
            setEmployees(data => data.map(row => row.employee_id));
        } catch (error) {
            console.log("Error fetching discounts");
        }
    }

    const productColumns = [
        // Define your columns for products here
        { field: 'product_id', headerName: 'ID', width: 130, editable: false },
        { field: 'quantity', headerName: 'Quantity', width: 200, editable: false },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => deleteProduct(params.row.product_id)}
                        >
                            Delete
                        </Button>
                    </>
                );
            },
        }
    ];

    const handleSave = () => {
        const orderData = {
            paymentMethod,
            paymentAmount,
            date,
            time,
            customerId,
            discountId,
            employeeId,
            products
        };
        onSave(orderData);
        onClose();
    };
    const deleteProduct = () => {

    }
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Add New Order</DialogTitle>
            <div>{customerId}</div>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Customer ID</InputLabel>
                    <Select
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                    >
                        {customers.map((customer, index) => (
                            <MenuItem key={customer.customer_id} value={customer.customer_id}>
                                {customer.customer_id}: {customer.name_first_name} {customer.name_last_name}
                            </MenuItem>

                        ))}
                    </Select>
                </FormControl>
                {/* Repeat the above structure for discountId and employeeId */}

                {/* <TextField
                    fullWidth
                    margin="normal"
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                /> */}

                {/* <TextField
                    fullWidth
                    margin="normal"
                    label="Payment Amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    type="number"
                /> */}

                {/* <KeyboardDatePicker
          margin="normal"
          label="Date"
          format="MM/dd/yyyy"
          value={date}
          onChange={setDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        /> */}

                {/* <KeyboardTimePicker
          margin="normal"
          label="Time"
          value={time}
          onChange={setTime}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        /> */}

                {/* DataGrid for products */}
                {/* <DataGrid
                    rows={products}
                    columns={productColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                /> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save Order</Button>
            </DialogActions>
        </Dialog>
    );
};
/* order_id: "",
        customer_id: "",
        discount_id: "",
        employee_id: "",
        date_time: "",
        order_products: "",
        order_total: "",
        payment_amount: "",
        payment_method: "DEFAULT" */
export default OrdersModal;
