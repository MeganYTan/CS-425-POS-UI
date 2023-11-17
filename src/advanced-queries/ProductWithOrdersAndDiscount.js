import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';

function ProductWithOrdersAndDiscount() {
    const url = 'http://localhost:5000/product';
    const columns = [
        { field: 'product_id', headerName: 'ID', width: 100, editable: false },
        { field: 'category', headerName: 'Category', width: 130, editable: false },
        { field: 'product_name', headerName: 'Name', width: 150, editable: false },
        { field: 'price', headerName: 'Price', width: 130, editable: false },
        { field: 'product_description', headerName: 'Description', width: 900, editable: false },
    ];
    const [rows, setRows] = useState([
    ]);
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });

    useEffect(() => {
        // get products
        async function fetchData() {
            try {
                const response = await fetch(`${url}/orders-and-discount`, { mode: 'cors' });
                const data = await response.json();
                setRows(data);
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
            <div>This query displays products which belong to an order that applies a discount. This query is uses the union set operation: </div>
            <div> Select * from PRODUCT WHERE product_id in ( <br></br>
                Select distinct p.product_id  
                from PRODUCT p
                JOIN ORDER_PRODUCT op ON p.product_id = op.product_id <br></br>
                UNION <br></br>
                Select distinct p.product_id
                from PRODUCT p
                JOIN ORDER_PRODUCT op ON p.product_id = op.product_id
                JOIN ORDERS o ON op.order_id = o.order_id
                WHERE o.discount_id IS NOT NULL <br></br>
                )
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

export default ProductWithOrdersAndDiscount;
