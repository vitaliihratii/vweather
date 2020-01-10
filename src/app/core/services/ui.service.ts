import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  darkModeState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    // TODO: if the user is signed in get the default value from Firebase
  }
}
