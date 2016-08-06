import express from 'express';

const app = express();
const PORT = 6969;

app.get('/', (req, res) => {
	res.send('hello world!');
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}!`);
	
});