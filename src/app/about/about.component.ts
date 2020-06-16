import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { of } from "rxjs";

// import * as firebase from "firebase/app";
// import "firebase/firestore";

// const config = {
//   apiKey: "AIzaSyDTCGRHA8TtPZOFlZuBhzSer98qvAPMBoc",
//   authDomain: "fir-course-cafee.firebaseapp.com",
//   databaseURL: "https://fir-course-cafee.firebaseio.com",
//   projectId: "fir-course-cafee",
//   storageBucket: "fir-course-cafee.appspot.com",
//   messagingSenderId: "591841429823",
//   appId: "1:591841429823:web:7ada1f100fa1101c42eb8a",
// };

// firebase.initializeApp(config);

// const db = firebase.firestore();
// db.settings({ timestampsInSnapshots: true });

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor(private db: AngularFirestore) {}

  ngOnInit() {}

  batchWrite() {
    const courseRef1 = this.db.doc("courses/fHFZykLZHJZsRCyGUOOW").ref;
    const courseRef2 = this.db.doc("courses/rp4JBEV8F4yVBWfJAJmi").ref;
    const batch = this.db.firestore.batch();

    batch.update(courseRef1, { titles: { description: "New Course Ref1" } });

    batch.update(courseRef2, { titles: { description: "New Course Ref2" } });

    const batchObs = of(batch.commit());
  }
}
