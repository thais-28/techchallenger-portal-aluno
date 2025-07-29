import express, { json, Request, Response } from "express";
import createApp from "./app";

const app = createApp();

const port = 3333;

app.listen(port, () => {
  console.log(`❤️ Server running at port http://localhost:${port}`);
});
