import express from 'express';
import dotenv from 'dotenv'
import mysql from 'mysql2/promise';
import ProductRoutes from './routes/ProductRoutes.js'
import OrderRoutes from './routes/OrderRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());

let db;
(async () => {
    try {
        db = await mysql.createConnection({
            port: process.env.MYSQL_PORT,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });
        console.log('Connected to MySQL');
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
    }
})();

app.use((req, res, next) => {
    req.db = db; 
    next();
});
app.use("/product",ProductRoutes);
app.use("/orders",OrderRoutes);
app.listen(process.env.PORT, () => {})