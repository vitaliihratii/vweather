import { Injectable } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() { }

  transformSnapshots<T>(snaps: DocumentChangeAction<any>[]): T[] {
    return snaps.length ? <T[]>snaps.map(snap => ({ ...snap.payload.doc.data(), id: snap.payload.doc.id })) : [];
  }
}
