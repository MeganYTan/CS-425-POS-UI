import React from 'react';
import { AppBar, Toolbar, Button, Typography, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    link: {
        textDecoration: 'none',
        color: 'inherit'
    }
}));

function Header() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        CS425 Group O POS CRUD APP
                    </Typography>
                    <Link to="/customer" className={classes.link}><Button color="inherit">Customers</Button></Link>
                    <Link to="/discount" className={classes.link}><Button color="inherit">Discounts</Button></Link>
                    <Link to="/employee" className={classes.link}><Button color="inherit">Employees</Button></Link>
                    <Link to="/product" className={classes.link}><Button color="inherit">Products</Button></Link>
                    <Link to="/orders" className={classes.link}><Button color="inherit">Orders</Button></Link>
                    
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;
