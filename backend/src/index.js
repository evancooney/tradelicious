import app from './app.js';

// Start the server
const port = 3333;
const host='0.0.0.0';
app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});