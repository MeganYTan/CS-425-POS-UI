import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
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
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import './OrdersModal.css';


const OrdersModal = ({ open, onClose, onSave, source, orderData }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [customerId, setCustomerId] = useState('');
    const [discountId, setDiscountId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [orderId, setOrderId] = useState("");
    const [rows, setRows] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [rowCounter, setRowCounter] = useState(0);
    const url = 'http://localhost:5000';
    const customersUrl = url + '/customer';
    const discountUrl = url + '/discount';
    const employeeUrl = url + '/employee';
    const productUrl = url + '/product';

    // set up data for edit

    useEffect(() => {
        if (source === "EDIT") {
            let idCounter = 0;
            setPaymentAmount(orderData.payment_amount);
            setPaymentMethod(orderData.payment_method)
            setCustomerId(orderData.customer_id);
            setDiscountId(orderData.discount_id);
            setEmployeeId(orderData.employee_id);
            setDate(orderData.date_time);
            setTime(orderData.date_time);
            setOrderId(orderData.order_id);
            // set products
            let orderProductsArr = orderData.order_products.split(",");
            orderProductsArr = orderProductsArr.map(item => {
                const lineItem = item.split(":");
                return { product_id: lineItem[0], quantity: lineItem[1], id: idCounter++ };
            });
            setRowCounter(idCounter);
            setRows(orderProductsArr);
        }
    }, [])




    useEffect(() => {
        if (open) {
            fetchCustomers();
            fetchDiscounts();
            fetchEmployees();
            fetchProducts();
        }
    }, [open]);
    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${customersUrl}`, { mode: 'cors' });
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.log("Error fetching customers");
        }
    }
    const fetchDiscounts = async () => {
        try {
            const response = await fetch(discountUrl, { mode: 'cors' });
            const data = await response.json();
            setDiscounts(data);
        } catch (error) {
            console.log("Error fetching discounts");
        }
    }
    const fetchEmployees = async () => {
        try {
            const response = await fetch(employeeUrl, { mode: 'cors' });
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.log("Error fetching employees");
        }
    }
    const fetchProducts = async () => {
        try {
            const response = await fetch(productUrl, { mode: 'cors' });
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.log("Error fetching products");
        }
    }


    const productColumns = [
        // Define your columns for products here
        {
            field: 'product_id', headerName: 'ID', width: 300, editable: true,
            renderCell: (params) => (
                <select
                    value={params.value}
                    onChange={(event) => handleProductIdChange(event, params.id)}
                >
                    {products.map((product, index) => (
                        <option key={product.product_id} value={product.product_id}>
                            {product.product_id}: {product.category} - {product.product_name}; ${product.price}
                        </option>

                    ))}
                </select>
            ),
        },
        { field: 'quantity', headerName: 'Quantity', width: 200, editable: true },
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
                            onClick={() => deleteProduct(params.row.id)}
                        >
                            Delete
                        </Button>
                    </>
                );
            },
        }
    ];
    const handleProductIdChange = (event, id) => {
        const newRows = rows.map(row => {
            if (row.id == id)
                row.product_id = event.target.value;
            return row;
        })
        setRows(newRows);
    };


    const emptyProduct = {
        product_id: 0,
        quantity: 0
    };
    const increaseRowCounter = () => {
        const newRowCounter = rowCounter + 1;
        setRowCounter(newRowCounter)
    }
    const getEmptyProduct = () => {
        increaseRowCounter();
        return { ...emptyProduct, id: rowCounter }
    }
    const addProduct = () => {
        const newRows = [...rows, getEmptyProduct()];
        setRows(newRows);
    }
    const deleteProduct = (id) => {
        const newRows = rows.filter(row => row.id != id);
        setRows(newRows);
    }

    const handleSave = () => {
        const orderData = {
            paymentMethod,
            paymentAmount,
            date,
            time,
            customerId,
            discountId,
            employeeId,
            rows // row of products
        };
        if (source === "EDIT") {
            orderData.orderId = orderId;
        }
        onSave(orderData);
        onClose();
    };
    const shouldSaveButtonBeDisabled = () => {
        return employeeId === "" || rows.length === 0;
    }
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Add New Order</DialogTitle>
            <DialogContent style={{ minHeight: "75vh" }}>
                <div style={{ display: "flex" }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Customer ID</InputLabel>
                            <Select
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                            >
                                <MenuItem key={""} value={""}>
                                    No Customer
                                </MenuItem>
                                {customers.map((customer, index) => (
                                    <MenuItem key={customer.customer_id} value={customer.customer_id}>
                                        {customer.customer_id}: {customer.name_first_name} {customer.name_last_name}
                                    </MenuItem>

                                ))}
                            </Select>
                        </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Discount ID</InputLabel>
                        <Select
                            value={discountId}
                            onChange={(e) => setDiscountId(e.target.value)}
                        >
                            {discounts.map((discount, index) => (
                                <MenuItem key={discount.discount_id} value={discount.discount_id}>
                                    {discount.discount_id}: {discount.coupon_code}; ${discount.discount_amount}
                                </MenuItem>

                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Employee ID</InputLabel>
                        <Select
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                        >
                            {employees.map((employee, index) => (
                                <MenuItem key={employee.employee_id} value={employee.employee_id}>
                                    {employee.employee_id}: {employee.name_first_name} {employee.name_last_name}
                                </MenuItem>

                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div style={{ display: "flex" }}>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Payment Method"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Payment Amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        type="number"
                    />
                </div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>

                    <KeyboardDatePicker
                        margin="normal"
                        label="Date"
                        format="MM/dd/yyyy"
                        value={date}
                        onChange={setDate}
                    />
                    <KeyboardTimePicker
                        margin="normal"
                        label="Time"
                        value={time}
                        onChange={setTime}
                    />
                </MuiPickersUtilsProvider>
                <div>
                    <Button onClick={addProduct} color="primary" variant="contained">
                        Add Row
                    </Button>

                </div>
                <DataGrid
                        rows={rows}
                        columns={productColumns}
                        autoHeight
                        onCellEditCommit={(params, event) => {
                            if (params.field == "quantity") {
                                const updatedRows = rows.map(row => {
                                    if (row.id === params.id) {
                                        row.quantity = params.value;
                                    }
                                    return row;
                                });
                                setRows(updatedRows);
                            }
                        }}
                        pageSizeOptions={[3, 5, 10]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 3, page: 0 },
                            },
                        }}
                    />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} disabled={shouldSaveButtonBeDisabled()}>Save Order</Button>
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
