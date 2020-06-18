import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import * as firebaseui from "firebaseui";
import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  ui: firebaseui.auth.AuthUI;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // firebase.initializeApp(environment.firebase);
    const uiConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this),
      },
    };

    this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    this.ui.start("#firebaseui-auth-container", uiConfig);
  }
  onLoginSuccessful(result) {
    console.log(result);

    this.ngZone.run(() => {
      this.router.navigate(["/", "courses"]);
    });
  }

  ngOnDestroy() {
    this.ui.delete();
  }
}
