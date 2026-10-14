
import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 2660;

app.listen(PORT, () => {
  console.log(`Denollia API is running on port ${PORT}`);
});
