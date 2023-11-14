import { Tabs, Tab } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Customer from './Customer';
import CustomerWithOrders from './CustomerWithOrders';
import CustomerRank from './CustomerRank';

function CustomerTab() {

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    return (
        <>
            <h1>Customers</h1>
            <Tabs value={tabValue} 
                onChange={handleTabChange}
            >
                <Tab label="Customers" />
                <Tab label="Customer Rank" />
                <Tab label="Customer With Orders" />
            </Tabs>

            {tabValue === 0 && (
                <div>
                    <Customer />
                </div>
            )}
            {tabValue === 1 && (
                <div>
                    <CustomerRank />
                </div>
            )}
            {tabValue === 2 && (
                <div>
                    <CustomerWithOrders />
                </div>
            )}
        </>
    );
}

export default CustomerTab;
