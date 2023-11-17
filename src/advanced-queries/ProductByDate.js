import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText } from '@mui/material';

function ProductByDate() {
    const url = 'http://localhost:5000/product';
    const columns = [
        { field: 'date_time', headerName: 'Date', width: 250, editable: false },
        { field: 'product_id', headerName: 'ID', width: 100, editable: false },
        { field: 'product_category', headerName: 'Category', width: 130, editable: false },
        { field: 'product_name', headerName: 'Name', width: 200, editable: false },
        { field: 'quantity', headerName: 'Quantity', width: 130, editable: false },
        { field: 'CumulativeQuantity', headerName: 'Cumulative Quantity', width: 130, editable: false },
    ];
    const [rows, setRows] = useState([]);
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setselectedProducts] = useState([]);


    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${url}`, { mode: 'cors' });
                const data = await response.json();
                setProducts(data);
                console.log(products);
            } catch (error) {
                setBanner({ active: true, message: 'There was an error fetching the products data.', type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            }
        }
        fetchProducts();
    }, []);
    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        fetch(`${url}/cummulative-total?start_date=${startDate}&end_date=${endDate}&ids=${selectedProducts}`, {
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    data.forEach((item, index) => item.id = index);
                    setRows(data);
                } else {
                    setBanner({ active: true, message: 'There was an error fetching the data.', type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'There was an error fetching the data.', type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            });
    }
    const handleChange = (event) => {
        console.log(event.target.value);
        const {
            target: { value },
        } = event;
        setselectedProducts(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <>
            {banner.active && <Banner message={banner.message} type={banner.type} />}
            <div>This query displays products along with their cumulative quantity within a date range. This query is uses a window function (sum over partition) and set membership (in).<br></br> START_DATE, END_DATE, and PRODUCT_IDS are the user entered parameters </div>
            <div>
                SELECT
                date_time,
                p.product_id,
                p.product_name,
                p.category,
                op.quantity,
                SUM(op.quantity) OVER (PARTITION BY p.product_id ORDER BY o.date_time) AS CumulativeQuantity<br></br>
                FROM
                Orders o
                JOIN
                Order_Product op ON o.order_id = op.order_id
                JOIN
                Product p ON op.product_id = p.product_id<br></br>
                WHERE
                o.date_time BETWEEN START_DATE AND END_DATE
                AND p.product_id in PRODUCT_IDS
                ORDER BY
                p.product_id, o.date_time;
            </div>
            <br></br>
            <form onSubmit={handleSubmit}>
                <label>
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
                <br></br>
                <Select
                    value={selectedProducts}
                    multiple
                    onChange={handleChange}

                >
                    {products.map((product, index) => (
                        <MenuItem key={product.product_id} value={product.product_id}>
                            {product.product_id}: {product.product_name}
                        </MenuItem>

                    ))}
                </Select>
                <button type="submit">Get Sales Data</button>
            </form>

            <div>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={15}
                    autoHeight
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                />
            </div>
        </>
    );
}

export default ProductByDate;
