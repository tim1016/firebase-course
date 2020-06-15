import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private db: AngularFirestore) {}
  courses$: Observable<Course[]>;

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;
  ngOnInit() {
    this.courses$ = this.db
      .collection("courses")
      .snapshotChanges()
      .pipe(map((snaps) => this.convertSnaps<Course>(snaps)));

    this.beginnerCourses$ = this.courses$.pipe(
      map((courses) => {
        return courses.filter((course) =>
          course.categories.includes("BEGINNER")
        );
      })
    );

    this.advancedCourses$ = this.courses$.pipe(
      map((courses) => {
        return courses.filter((course) =>
          course.categories.includes("ADVANCED")
        );
      })
    );
  }

  convertSnaps<T>(snaps): T[] {
    return <T[]>snaps.map((snap) => {
      return {
        id: snap.payload.doc.id,
        ...(snap.payload.doc.data() as object),
      };
    });
  }
}
