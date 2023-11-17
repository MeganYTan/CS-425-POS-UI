import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';
function DailySalesReport() {
    const url = 'http://localhost:5000/product';
    const columns = [
        { field: 'date_time', headerName: 'Date', width: 250, editable: false },
        { field: 'product_category', headerName: 'Category', width: 130, editable: false },
        { field: 'product_name', headerName: 'Name', width: 200, editable: false },
        { field: 'PRODUCT_TOTAL_QUANTITY', headerName: 'Total Quantity', width: 130, editable: false },
        { field: 'PRODUCT_TOTAL_PRICE', headerName: 'Total Price', width: 130, editable: false },
    ];
    const [rows, setRows] = useState([]);
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        fetch(`${url}/sales?start_date=${startDate}&end_date=${endDate}`, {
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

    return (
        <>
            {banner.active && <Banner message={banner.message} type={banner.type} />}
            <div style={{
                border: '1px solid',
                padding: '10px',
                boxShadow: '5px 1px'
            }}>
            <div>This query displays sales by category and day. This query uses olap (rollup) to show the daily quantity by cateogry. START_DATE and END_DATE are the user entered parameters </div>
            <div>
                SELECT date_time,
                COALESCE(category, 'ALL') AS product_category,
                COALESCE(product_name, 'ALL') AS product_name,
                SUM(ORDER_PRODUCT.quantity) AS PRODUCT_TOTAL_QUANTITY,
                SUM(ORDER_PRODUCT.quantity * price) as PRODUCT_TOTAL_PRICE
                FROM ORDERS
                JOIN ORDER_PRODUCT ON ORDERS.order_id = ORDER_PRODUCT.order_id
                JOIN PRODUCT ON ORDER_PRODUCT.product_id = PRODUCT.product_id
                WHERE date_time BETWEEN START_DATE AND END_DATE
                GROUP BY date_time, category, product_name
                WITH ROLLUP
            </div>
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
                </label>&nbsp;
                <label>
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
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

export default DailySalesReport;
