import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./src/dbConnection/Connection.js";
import cors from "cors";
import userRouter from "./src/routes/userRouter.js";
import messageRouter from "./src/routes/messageRoute.js";
import { app, server } from "./SocketIo/server.js";
import path from "path";

dotenv.config();




app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://chat-app-0zpk.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);




app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

//deployment
if (process.env.NODE_ENV === "production") {
    const dirname = path.resolve();

app.use(express.static(path.join(dirname, "/client/dist")))
app.use((_,res)=>{
    res.sendFile(path.resolve(dirname, "client", "dist", "index.html"))
})
}
const PORT = process.env.PORT || 5000;
connectDB();
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
