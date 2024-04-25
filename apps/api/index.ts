import { app } from './app';

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Running api server on http://localhost:${PORT}`);
});
