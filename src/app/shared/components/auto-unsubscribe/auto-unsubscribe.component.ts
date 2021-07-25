import { Component, OnDestroy, OnInit } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, OperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export abstract class AutoUnsubscribeComponent implements OnDestroy {

  private isAliveSubj: Subject<boolean> = new Subject();

  constructor() { }

  ngOnDestroy() {
    this.isAliveSubj.next();
  }

  isAlive<T>(): MonoTypeOperatorFunction<T> {
    return takeUntil<T>(this.isAliveSubj);
  }

}
