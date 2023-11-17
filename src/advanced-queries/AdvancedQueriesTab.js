import { Tabs, Tab } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import ProductCheaperThanAverage from './ProductCheaperThanAverage';
import ProductWithOrdersAndDiscount from './ProductWithOrdersAndDiscount';
import ProductWithSales from './ProductWithSales';
import CustomerWithOrders from './CustomerWithOrders';
import CustomerRank from './CustomerRank';
import ProductWithNoOrders from './ProductWithNoOrders';
import DailySalesReport from './DailySalesReport';
import ProductByDate from './ProductByDate';

function AdvancedQueriesTab() {

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const tabs = [
        {
            label: "Customers with Rank",
            tabIndex: 0,
            component: <CustomerRank />
        },
        {
            label: "Products Cheaper than Average",
            tabIndex: 1,
            component:  <ProductCheaperThanAverage />
        },
        /*{
            label: "Products with Orders and Discounts",
            tabIndex: 2,
            component: <ProductWithOrdersAndDiscount />
        },*/
        {
            label: "Products with Total Sale Amount",
            tabIndex: 3,
            component: <ProductWithSales />
        },
        {
            label: "Unpurchased Products",
            tabIndex: 4,
            component: <ProductWithNoOrders />
        },
        {
            label: "Daily Sales by Product and Quantity",
            tabIndex: 5,
            component: <DailySalesReport />
        },
        {
            label: "Cummulative Total by Product",
            tabIndex: 6,
            component: <ProductByDate />
        },
    ]
    tabs.sort((val1,val2) => val1.tabIndex - val2.tabIndex);
    return (
        <>
            <h1>Advanced Queries</h1>
            <Tabs value={tabValue} 
                onChange={handleTabChange}
            >
                {
                    tabs.map(item => <Tab key={item.tabIndex} label= {item.label} />)
                }
                
            </Tabs>
            {tabs[tabValue].component}
        </>
    );
}

export default AdvancedQueriesTab;
