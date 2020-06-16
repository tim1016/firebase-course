import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private coursesService: CoursesService) {}
  courses$: Observable<Course[]>;

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;
  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.courses$ = this.coursesService.loadAllCourses();

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
  // convertSnaps<T>(snaps): T[] {
  //   return <T[]>snaps.map((snap) => {
  //     return {
  //       id: snap.payload.doc.id,
  //       ...(snap.payload.doc.data() as object),
  //     };
  //   });
  // }
}
