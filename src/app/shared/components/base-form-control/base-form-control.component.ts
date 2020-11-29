import { ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export abstract class BaseFormControlComponent<T> implements ControlValueAccessor {

  @Input() disabled: boolean;

  private _value: T;

  protected constructor(
  ) { }

  public writeValue(val: T) {
    this._value = val;
    this.onChange(val);
  }

  public registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  public registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  protected onChange(val: T): void {}  

  protected onTouched(): void {}

  public get value(): T {
    return this._value;
  }
}
