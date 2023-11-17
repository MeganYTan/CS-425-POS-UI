import React, { useState, useEffect } from 'react';
import Banner from '../common/banner/Banner';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@material-ui/core';

function Product() {
    const url = 'http://localhost:5000/product';
    const columns = [
        { field: 'product_id', headerName: 'ID', width: 100, editable: false },
        { field: 'category', headerName: 'Category', width: 130, editable: true },
        { field: 'product_name', headerName: 'Name', width: 200, editable: true },
        { field: 'price', headerName: 'Price', width: 130, editable: true },
        { field: 'product_description', headerName: 'Description', width: 700, editable: true },
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
                            onClick={() => deleteProductAPI(params.row.product_id)}
                        >
                            Delete
                        </Button>
                    </>
                );
            },
        }
    ];
    const [rows, setRows] = useState([
    ]);
    const emptyProduct = JSON.parse(JSON.stringify({
        category: '',
        product_name: '',
        price: '',
        product_description: '',
    }));
    const [banner, setBanner] = React.useState({ active: false, message: '', type: '' });
    const [modalOpen, setModalOpen] = React.useState(false);
    const [newProduct, setNewProduct] = React.useState(emptyProduct);

    const shouldSaveButtonBeDisabled = () => {
        return Object.values(newProduct).some(value => value === '');
    };

    function handleSaveRow(row) {
        editProductAPI(row.product_id, row);
    }
    const handleChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProduct = async () => {
        addProductAPI(newProduct);

        // Reset the form and close the modal
        setNewProduct(emptyProduct);
        setModalOpen(false);
    };

    useEffect(() => {
        // get products
        async function fetchData() {
            try {
                const response = await fetch(url, { mode: 'cors' });
                const data = await response.json();
                setRows(data);
            } catch (error) {
                setBanner({ active: true, message: 'There was an error fetching the products data.', type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            }
        }
        fetchData();
    }, []);
    function addProductAPI(newProduct) {
        fetch(`${url}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.product_id) {
                    newProduct.product_id = data.product_id;
                    setBanner({ active: true, message: 'Product added successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    // update the id
                    const updatedRows = [...rows, newProduct];
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to add the product.', type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    // remove the product from the row
                    setRows(rows.filter(product => product.product_id != ""));
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to add the product. Error:' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            });
    }
    function deleteProductAPI(productId) {
        fetch(`${url}/delete/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setRows(rows.filter(product => product.product_id !== productId));
                    setBanner({ active: true, message: 'Product deleted successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                } else {
                    setBanner({ active: true, message: 'Failed to delete the product: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to delete the product: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 5000);
            });
    }

    function editProductAPI(product_id, field, value) {
        fetch(`${url}/edit/${product_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(field),
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setBanner({ active: true, message: 'Product edited successfully!', type: 'success' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                    const updatedRows = rows.map(item => {
                        if (item.product_id === product_id) {
                            item = field;
                        }
                        return item;
                    })
                    setRows(updatedRows);
                } else {
                    setBanner({ active: true, message: 'Failed to edit the product: ' + data.message, type: 'error' });
                    setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
                }
            })
            .catch((error) => {
                setBanner({ active: true, message: 'Failed to edit the product: ' + error, type: 'error' });
                setTimeout(() => setBanner({ active: false, message: '', type: '' }), 3000);
            });

    }


    return (
        <>
            <h1>Product</h1>
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
                    getRowId={(row) => row.product_id}
                    autoHeight
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                />
                <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogContent>
                        <TextField name="category" label="Category" fullWidth value={newProduct.category} onChange={handleChange} />
                        <TextField name="product_name" label="Name" fullWidth value={newProduct.product_name} onChange={handleChange} />
                        <TextField name="price" type="number" label="Price" fullWidth value={newProduct.price} onChange={handleChange} />
                        <TextField name="product_description" label="Description" fullWidth value={newProduct.product_description} onChange={handleChange} />


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setModalOpen(false)} color="primary">Cancel</Button>
                        <Button onClick={handleSaveProduct} color="primary" disabled={shouldSaveButtonBeDisabled()}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}

export default Product;
