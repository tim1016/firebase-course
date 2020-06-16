import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Course } from "../model/course";
import { map, first } from "rxjs/operators";
import { Observable } from "rxjs";
import { Lesson } from "../model/lesson";
// import {OrderByDirection} from "@angular/fire/firestore"

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  courses$: Observable<Course[]>;
  constructor(private db: AngularFirestore) {}

  loadAllCourses(): Observable<Course[]> {
    return (this.courses$ = this.db
      .collection("courses")
      .snapshotChanges()
      .pipe(map((snaps) => this.convertSnaps<Course>(snaps))));
  }

  convertSnaps<T>(snaps): T[] {
    return <T[]>snaps.map((snap) => {
      return {
        id: snap.payload.doc.id,
        ...(snap.payload.doc.data() as object),
      };
    });
  }

  findCourseByUrl(courseUrl: string): Observable<Course> {
    return this.db
      .collection("courses", (ref) => ref.where("url", "==", courseUrl))
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          // snaps.forEach((snap) => {
          //   console.log(snap.payload.doc.data());
          // });
          const courses = this.convertSnaps<Course>(snaps);
          if (courses.length === 1) {
            // console.log(courses[0]);
            return courses[0];
          } else {
            console.log("undefined");
            return undefined;
          }
        }),
        first()
      );
  }

  findLessons(
    courseId: string,
    sortOrder: "asc" | "desc" = "asc",
    pageNumber = 0,
    pageSize = 3
  ): Observable<Lesson[]> {
    return this.db
      .collection(`courses/${courseId}/lessons`, (ref) =>
        ref
          .orderBy("seqNo", sortOrder)
          .limit(pageSize)
          .startAfter(pageNumber * pageSize)
      )
      .snapshotChanges()
      .pipe(
        map((snaps) => this.convertSnaps<Lesson>(snaps)),
        first()
      );
  }
}
