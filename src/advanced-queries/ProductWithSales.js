import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';

function ProductWithSales() {
    const url = 'http://localhost:5000/product';
    const columns = [
        { field: 'product_id', headerName: 'ID', width: 100, editable: false },
        { field: 'category', headerName: 'Category', width: 130, editable: false },
        { field: 'product_name', headerName: 'Name', width: 200, editable: false },
        { field: 'price', headerName: 'Price', width: 130, editable: false },
        { field: 'product_description', headerName: 'Description', width: 800, editable: false },
        { field: 'PRODUCT_TOTAL_SALES_AMOUNT', headerName: 'Total Sale Amount', width: 130, editable: false },
    ];
    const [rows, setRows] = useState([
    ]);
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });

    useEffect(() => {
        // get products
        async function fetchData() {
            try {
                const response = await fetch(`${url}/with-sales`, { mode: 'cors' });
                const data = await response.json();
                console.log(data);
                setRows(
                    data.map(item => {
                        if (item.product_id == null) {
                            item.product_id = "All " + item.category;
                        }
                        return item;
                    })
                );
            } catch (error) {
                setBanner({ active: true, message: 'There was an error fetching the products data.', type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            {banner.active && <Banner message={banner.message} type={banner.type} />}
            <div>This query displays products along with their total sale amount. This query is uses olap (rollup): </div>
            <div>         SELECT
                product.product_id,
                date_time,
                COALESCE(category, 'ALL') AS product_category,
                COALESCE(product_name, 'ALL') AS product_name,
                SUM(ORDER_PRODUCT.quantity) AS PRODUCT_TOTAL_QUANTITY
                FROM ORDERS
                JOIN ORDER_PRODUCT ON ORDERS.order_id = ORDER_PRODUCT.order_id
                JOIN PRODUCT ON ORDER_PRODUCT.product_id = PRODUCT.product_id
                WHERE date_time BETWEEN '2023-01-01' AND '2023-10-02'
                GROUP BY date_time, category, product_name, product_id
                WITH ROLLUP;
            </div>
            <div>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={15}
                    getRowId={(row) => row.product_id}
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

export default ProductWithSales;
