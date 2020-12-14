import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormControlComponent } from '../base-form-control/base-form-control.component';

@Component({
  selector: 'vwe-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent extends BaseFormControlComponent<boolean> {

  @Input() labelPosition: 'left' | 'right' = 'right';
  @Output() change: EventEmitter<boolean> = new EventEmitter();
  @Output() toggle: EventEmitter<void> = new EventEmitter();

  constructor(
    public cd: ChangeDetectorRef
  ) {
    super();
   }

  toggleCheckbox() {
    this.writeValue(!this.value);
    this.toggle.emit();
  }

  registerOnChange(fn: (val: boolean) => void) {
    this.onChange = (val) => {
      this.cd.markForCheck();
      fn(val);
      this.change.emit(val);
    };
  }

  onChange(val: boolean) {}
}
