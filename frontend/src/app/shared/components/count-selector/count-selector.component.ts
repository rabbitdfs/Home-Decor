import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent {

  @Input() count = 1;
  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  countChange() {
    this.onCountChange.emit(this.count);
  }
  decreaseCount() {
    if (this.count > 1) {
      this.count--;
      this.countChange();
    }
  }

  increaseCount() {
    this.count++;
    this.countChange();
  }
}
