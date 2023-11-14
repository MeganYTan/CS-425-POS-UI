import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Login() {
  return (
    <>
      <h1>Info</h1>
      <ul>
        <li>With statement       <div>
      WITH otp AS (
      SELECT order_id, SUM(total_price) AS total_price FROM
      (SELECT order_id, quantity*price as total_price FROM
      (SELECT * FROM ORDERS NATURAL JOIN ORDER_PRODUCT NATURAL JOIN PRODUCT) t1) t2 
      GROUP BY order_id
      ORDER BY order_id
      )
      SELECT * FROM otp NATURAL JOIN Payment natural join (
      SELECT 
          o.*, 
          GROUP_CONCAT(
              CONCAT_WS(':', op.product_id, op.quantity) 
              SEPARATOR ','
          ) AS order_products
      FROM 
          order_product op
      NATURAL JOIN
        orders o
      GROUP BY 
          o.order_id
          ) t
          ;
      </div></li>
      </ul>

    </>
  );
}

export default Login;
