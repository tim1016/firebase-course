import * as functions from "firebase-functions";
// import { Course } from "../../src/app/model/course";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   response.status(200).json({ message: "Hello from firebase" });
// });

import * as express from "express";
import { db } from "./init";
// import { onAddLesson } from "./lessons-counter";
const cors = require("cors");

const app = express();

app.use(cors({ origin: true }));

app.get("/courses", async (request, response) => {
  const snaps = await db.collection("courses").get();
  const courses: any[] = [];
  snaps.forEach((snap: any) => courses.push(snap));
  response.status(200).json({ courses });
});

export const getCourses = functions.https.onRequest(app);

export { onAddLesson, onDeleteLesson } from "./lessons-counter";
