import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';

function ProductCheaperThanAverage() {
    const url = 'http://localhost:5000/product';
    const columns = [
        { field: 'product_id', headerName: 'ID', width: 100, editable: false },
        { field: 'category', headerName: 'Category', width: 130, editable: false },
        { field: 'product_name', headerName: 'Name', width: 150, editable: false },
        { field: 'price', headerName: 'Price', width: 130, editable: false },
        { field: 'product_description', headerName: 'Description', width: 950, editable: false },
    ];
    const [rows, setRows] = useState([

    ]);
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });

    useEffect(() => {
        // get products
        async function fetchData() {
            try {
                const response = await fetch(`${url}/cheaper-than-average`, { mode: 'cors' });
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
            <div style={{
                border: '1px solid',
                padding: '10px',
                boxShadow: '5px 1px'
            }}>
                <div>This query displays the products that are cheaper than the average product. It uses the avg() aggregate function, and set comparison : </div>
                <div> Select * FROM PRODUCT WHERE price &lt; ALL (Select AVG(price) FROM PRODUCT GROUP BY category)
                </div>
            </div >
            <div ></div>
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

export default ProductCheaperThanAverage;
