const sql = require('mssql');
require('dotenv').config();
// Configure the database connection
const config = {
  user: "vsa",
  password: "!nd!@123",
  server: "45.122.120.92",
  database: "CiscoConnect",
  options: {
    encrypt: false, // Change to true if your SQL Server is hosted on Azure
    trustServerCertificate: true, // Change to false if your SQL Server uses a self-signed certificate
    enableArithAbort: true,
  },
  pool: {
    max: 100, // Maximum number of connections
    min: 0,  // Minimum number of connections
    idleTimeoutMillis: 500000 // How long a connection is allowed to be idle before being closed
  }
};

// Create a connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = {sql,poolPromise};