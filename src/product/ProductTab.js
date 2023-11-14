import { Tabs, Tab } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Product from './Product';
import ProductCheaperThanAverage from './ProductCheaperThanAverage';
import ProductWithOrdersAndDiscount from './ProductWithOrdersAndDiscount';
import ProductWithSales from './ProductWithSales';

function ProductTab() {

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    return (
        <>
            <h1>Products</h1>
            <Tabs value={tabValue} 
                onChange={handleTabChange}
            >
                <Tab label="Products" />
                <Tab label="Products with Orders and Discounts" />
                <Tab label="Products Cheaper than Average" />
                <Tab label="Products with total sale amount" />
            </Tabs>

            {tabValue === 0 && (
                <div>
                    <Product />
                </div>
            )}
            {tabValue === 1 && (
                <div>
                    <ProductWithOrdersAndDiscount />
                    
                </div>
            )}
            {tabValue === 2 && (
                <div>
                    <ProductCheaperThanAverage />
                </div>
            )}
            {tabValue === 3 && (
                <div>
                    <ProductWithSales />
                </div>
            )}
        </>
    );
}

export default ProductTab;
