import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';

function ProductWithNoOrders() {
    const url = 'http://localhost:5000/product';
    const columns = [
        { field: 'product_id', headerName: 'ID', width: 100, editable: false },
        { field: 'category', headerName: 'Category', width: 130, editable: false },
        { field: 'product_name', headerName: 'Name', width: 200, editable: false },
        { field: 'price', headerName: 'Price', width: 130, editable: false },
        { field: 'product_description', headerName: 'Description', width: 800, editable: false },
    ];
    const [rows, setRows] = useState([
    ]);
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });

    useEffect(() => {
        // get products
        async function fetchData() {
            try {
                const response = await fetch(`${url}/with-no-orders`, { mode: 'cors' });
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
            <div style={{
                border: '1px solid',
                padding: '10px',
                boxShadow: '5px 1px'
            }}>
            <div>This query displays all products that have not been purchased. It uses set membership: </div>
            <div> Select * from PRODUCT WHERE product_id not in (Select distinct product_id from ORDER_PRODUCT);
            </div>
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

export default ProductWithNoOrders;
