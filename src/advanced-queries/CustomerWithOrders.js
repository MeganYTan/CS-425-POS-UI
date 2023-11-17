import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';

function Customer() {
    const url = 'http://localhost:5000/customer';
    const columns = [
        { field: 'customer_id', headerName: 'ID', width: 130, editable: false },
        { field: 'name_first_name', headerName: 'First Name', width: 200, editable: false },
        { field: 'name_last_name', headerName: 'Last Name', width: 200, editable: false },
        { field: 'email', headerName: 'Email', width: 250, editable: false },
        { field: 'loyalty_points', headerName: 'Loyalty Points', width: 200, editable: false },
        { field: 'phone_number', headerName: 'Phone Number', width: 200, editable: false },
    ];
    const [rows, setRows] = useState([
    ]);
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });

    useEffect(() => {
        // get customers
        async function fetchData() {
            try {
                const response = await fetch(`${url}/with-orders`, { mode: 'cors' });
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
