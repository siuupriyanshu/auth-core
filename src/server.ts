import app from "./app";
import { connectDB } from "./config/db";

const startServer = async () => {
    const PORT = process.env.PORT || 3000;
     await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }); 
}

startServer();