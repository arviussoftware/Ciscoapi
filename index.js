const http = require('http');
const express = require('express');
const app = express();
const { poolPromise } = require('./sqlcon');
const server = http.createServer(app);
const sql = require('mssql');
const bodyParser = require('body-parser');
const PORT =  process.env.PORT || 8080;
app.use(bodyParser.json());


app.get('/api/getcallwebhook', async (req, res) => {

    try {
        const pool = await poolPromise;
        console.log('Connected to the database.');
        const request = pool.request();
        result = await request.query(`EXEC usp_InsertjsonDataToCallsActivity ${"'" + JSON.stringify(req.body) + "'"}`);
        console.log('SQL query executed successfully.');
        //uploadJsonToS3('connectevent', 'contactevent', req.body, `contactevent_${req.body.time}`);
        res.json(req.body);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } finally {
        console.log('Closing the database connection.');
        await sql.close();
    }
});




app.post('/api/getcallwebhook', async (req, res) => {

    try {
        const pool = await poolPromise;
        console.log('Connected to the database.');
        const request = pool.request();

        // Input: JSON payload
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        // Output: ERROR message (VARCHAR(1000))
        request.output('ERROR', sql.VarChar(1000));
        // Execute the stored procedure
        const result = await request.execute('usp_InsertjsonDataToCallsActivity');

        console.log('SQL procedure executed successfully.');
        console.log('Output parameter (ERROR):', result.output.ERROR);

        res.json({
            success: result.output.ERROR === 'SUCCESS',
            message: result.output.ERROR,
            data: req.body
        });

        //result = await request.query(`EXEC usp_InsertjsonDataToCallsActivity ${"'" + JSON.stringify(req.body) + "'"}`);
        // console.log('SQL query executed successfully.');
        // //uploadJsonToS3('connectevent', 'contactevent', req.body, `contactevent_${req.body.time}`);
        // res.json(req.body);

    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } finally {
        console.log('Closing the database connection.');
        await sql.close();
    }
});





app.post('/api/getagentstatus', async (req, res) => {

    try {
        const pool = await poolPromise;
        console.log('Connected to the database.');
        const request = pool.request();

        // Input: JSON payload
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        // Output: ERROR message (VARCHAR(1000))
        request.output('ERROR', sql.VarChar(1000));
        // Execute the stored procedure
        const result = await request.execute('usp_InsertjsonDataToAgentsActivity');

        console.log('SQL procedure executed successfully.');
        console.log('Output parameter (ERROR):', result.output.ERROR);

        res.json({
            success: result.output.ERROR === 'SUCCESS',
            message: result.output.ERROR,
            data: req.body
        });

    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } finally {
        console.log('Closing the database connection.');
        await sql.close();
    }
});








server.listen(PORT, async () => {
    try {
        await poolPromise
        console.log('Server is running on port', PORT);
    } catch (error) {
        console.error('Error connecting to SQL Server during startup:', error);
    }
});

