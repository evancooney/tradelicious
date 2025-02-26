import app from './app.js';

// Start the server
const port = 3000;
app.listen(port,  () => {
    console.log(`Server is running on http://localhost:${port}`);
});