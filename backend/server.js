import { app } from "./app.js";

// default port 
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is woriking on port ${PORT}`);
});