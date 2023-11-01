import React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const rows = [
    // Sample data
    { id: 1, customer_id: 'C001', first_name: 'Alice', last_name: 'Brown', email: 'alice@gmail.com', loyalty_points: 50, phone_number: '123-456-7890' },
    // ... add more rows or fetch from an API
];

const columns = [
    { field: 'customer_id', headerName: 'Customer ID', width: 130 },
    { field: 'first_name', headerName: 'First Name', width: 130 },
    { field: 'last_name', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'loyalty_points', headerName: 'Loyalty Points', width: 150 },
    { field: 'phone_number', headerName: 'Phone Number', width: 150 }
];

function Customers() {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
    );
}

export default Customers;
