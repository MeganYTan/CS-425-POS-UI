import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './login/Login';
import CustomerTab from './customer/CustomerTab';
import Customer from './customer/Customer';

import Discount from './discount/Discount';
import ProductTab from './product/ProductTab';
import Employee from './employee/Employee';
import Orders from './orders/Orders';
import Info from './info/Info';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './common/header/Header';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <BrowserRouter>
      <Header />

      <Routes>
        {/* <Route path="/" element={<Login />}></Route> */}
        <Route path="/customer" element={<CustomerTab />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/discount" element={<Discount/>} />
        <Route path="/product" element={<ProductTab/>} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/info" element={<Info />} />
        {/* <Redirect from="/" to="/orders" /> */}
        {/* reports, current transaction, employees, stock, home is login? */}
      </Routes>
    </BrowserRouter>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
