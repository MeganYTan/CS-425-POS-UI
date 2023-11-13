import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@material-ui/core';

function Discount() {
    const url = 'http://localhost:5000/discount';
    const columns = [
        { field: 'discount_id', headerName: 'ID', width: 130, editable: false },
        { field: 'discount_amount', headerName: 'Amount', width: 200, editable: true },
        { field: 'discount_description', headerName: 'Description', width: 200, editable: true },
        { field: 'coupon_code', headerName: 'Coupon Code', width: 200, editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleSaveRow(params.row)}
                        >
                            Save
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => deleteDiscountAPI(params.row.discount_id)}
                        >
                            Delete
                        </Button>
                    </>
                );
            },
        }
    ];
    const [rows, setRows] = useState([
        {
            discount_id: 1,
            discount_amount: 5,
            discount_description: "Default description",
            coupon_code: "DEFAULT"
        },
    ]);
    const emptyDisount = JSON.parse(JSON.stringify({
        discount_amount: '',
        discount_description: '',
        coupon_code: ''
    }));
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });
    const [modalOpen, setModalOpen] = React.useState(false);
    const [newDiscount, setNewDiscount] = React.useState(emptyDisount);

    const shouldSaveButtonBeDisabled = () => {
        return Object.values(newDiscount).some(value => value === '');
    };

    function handleSaveRow(row) {
        editDiscountAPI(row.discount_id, row);
    }
    const handleChange = (e) => {
        setNewDiscount({
            ...newDiscount,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveDiscount = async () => {
        addDiscountAPI(newDiscount);

        // Reset the form and close the modal
        setNewDiscount(emptyDisount);
        setModalOpen(false);
    };

    useEffect(() => {
        // get discounts
        async function fetchData() {
            try {
                const response = await fetch(url, { mode: 'cors' });
                const data = await response.json();
                setRows(data);
            } catch (error) {
                setBanner({ active: true, message: 'There was an error fetching the discounts data.', type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            }
        }
        fetchData();
    }, []);
    function addDiscountAPI(newDiscount) {
        fetch(`${url}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDiscount)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.discount_id) {
                    newDiscount.discount_id = data.discount_id;
                    setBanner({ active: true, message: 'Discount added successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    // update the id
                    const updatedRows = [...rows, newDiscount];
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to add the discount:' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    // remove the discount from the row
                    setRows(rows.filter(discount => discount.discount_id != ""));
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to add the discount. Error:' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            });
    }
    function deleteDiscountAPI(discountId) {
        fetch(`${url}/delete/${discountId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setRows(rows.filter(discount => discount.discount_id !== discountId));
                    setBanner({ active: true, message: 'Discount deleted successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                } else {
                    setBanner({ active: true, message: 'Failed to delete the discount: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to delete the discount: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
            });
    }

    function editDiscountAPI(discount_id, field, value) {
        fetch(`${url}/edit/${discount_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(field),
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setBanner({ active: true, message: 'Discount edited successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    const updatedRows = rows.map(item => {
                        if (item.discount_id === discount_id) {
                            item = field;
                        }
                        return item;
                    })
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to edit the discount: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to edit the discount: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            });

    }


    return (
        <>
            <h2>Discount</h2>
            {banner.active && <Banner message={banner.message} type={banner.type} />}
            <div>
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>

                        Add +
                    </Button>
                </div>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={15}
                    getRowId={(row) => row.discount_id}
                    autoHeight
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                />
                <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                    <DialogTitle>Add New Discount</DialogTitle>
                    <DialogContent>
                        <TextField name="discount_amount" type="number" label="Amount" fullWidth value={newDiscount.discount_amount} onChange={handleChange} />
                        <TextField name="discount_description" label="Description" fullWidth value={newDiscount.discount_description} onChange={handleChange} />
                        <TextField name="coupon_code" label="Coupon Code" fullWidth value={newDiscount.coupon_code} onChange={handleChange} />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setModalOpen(false)} color="primary">Cancel</Button>
                        <Button onClick={handleSaveDiscount} color="primary" disabled={shouldSaveButtonBeDisabled()}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}

export default Discount;
