import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';

function Customer() {
    const url = 'http://localhost:5000/customer';
    const columns = [
        { field: 'customer_id', headerName: 'ID', width: 100, editable: false },
        { field: 'customer_rank', headerName: 'Rank', width: 100, editable: false },
        { field: 'product_price_total', headerName: 'Total Spend', width: 130, editable: false },
        { field: 'name_first_name', headerName: 'First Name', width: 200, editable: false },
        { field: 'name_last_name', headerName: 'Last Name', width: 200, editable: false },
        { field: 'email', headerName: 'Email', width: 250, editable: false },
        { field: 'loyalty_points', headerName: 'Loyalty Points', width: 130, editable: false },
        { field: 'phone_number', headerName: 'Phone Number', width: 200, editable: false },
    ];
    const [rows, setRows] = useState([
    ]);
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });

    useEffect(() => {
        // get customers
        async function fetchData() {
            try {
                const response = await fetch(`${url}/rank`, { mode: 'cors' });
                const data = await response.json();
                setRows(data);
            } catch (error) {
                setBanner({ active: true, message: 'There was an error fetching the customers data.', type: 'error' });
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
                <div>This query displays the rank of customer based on their total spend amount. Customers with no orders are not displayed.</div>
                <div>This query uses a with clause, and the rank function: </div>
                <div>With customer_with_order as <br></br>
                    (Select customer_id, sum(quantity*price) as product_price_total from ORDERS natural join ORDER_PRODUCT natural join PRODUCT
                    GROUP BY customer_id)
                    <br></br>
                    Select *, rank() over (order by product_price_total desc) as customer_rank from customer_with_order natural join CUSTOMER</div>
            </div >
            <div >

                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.customer_id}
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

export default Customer;
