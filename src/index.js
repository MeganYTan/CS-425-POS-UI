import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Customer from './customer/Customer';
import Discount from './discount/Discount';
import Product from './product/Product';
import Employee from './employee/Employee';
import Orders from './orders/Orders';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './common/header/Header';
import AdvancedQueriesTab from './advanced-queries/AdvancedQueriesTab';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <BrowserRouter>
      <Header />
      {/* This is a database interface application for a point-of-sale system. This project is made by group O for CS425 in Fall 2023. */}
      <Routes>
        {/* <Route path="/" element={<Login />}></Route> */}
        <Route path="/customer" element={<Customer />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/discount" element={<Discount/>} />
        <Route path="/product" element={<Product/>} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/advanced-queries" element={<AdvancedQueriesTab />} />
        {/* <Redirect from="/" to="/orders" /> */}
      </Routes>
    </BrowserRouter>
    <div>
    
    </div>
  </>
);
