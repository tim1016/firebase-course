import * as functions from "firebase-functions";
import { db } from "./init";
import { QueryDocumentSnapshot } from "firebase-functions/lib/providers/firestore";

export const onAddLesson = functions.firestore
  .document("courses/{courseId}/lessons/{lessonId}")
  .onCreate(async (snap, context) => {
    courseTransaction(snap, (course: any) => {
      return { lessonsCount: course.lessonsCount + 1 };
    });
  });

export const onDeleteLesson = functions.firestore
  .document("courses/{courseId}/lessons/{lessonId}")
  .onDelete(async (snap, context) => {
    courseTransaction(snap, (course: any) => {
      return { lessonsCount: course.lessonsCount - 1 };
    });
  });

function courseTransaction(snap: QueryDocumentSnapshot, cb: Function) {
  return db.runTransaction(async (transaction) => {
    const courseRef = snap.ref.parent.parent;
    const courseSnap = await transaction.get(courseRef!);
    const course = courseSnap.data();
    const changes = cb(course);
    transaction.update(courseRef!, changes);
  });
}
