import server from "./socket";
import connectDB from "./config/db";
import { PORT } from "./config/constants";

connectDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
