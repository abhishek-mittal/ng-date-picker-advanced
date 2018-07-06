import { Directive, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, HostBinding } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Directive({
  selector: '[ABInput]',
  host: {
    'style': `font-family: cursive;
    background-color: white;
    color: #44046d;
    height: 0;
    padding: 24.5px 47px 24.5px 16px;
    text-decoration: underline;
    font-stretch: ultra-condensed;
    font-size: 15px;
    font-weight: 700;
    width: fit-content;`,
  },
  providers: [DatePipe]
})
export class ABInputDirective implements OnInit {
  
  @Input() id: string;
  @Input() date = '';
  @Output() dateChange = new EventEmitter();

  @HostBinding('value')private xyz = 'Select Date';
  private changes = new BehaviorSubject('');
  private subscription: any;

  constructor(private _dp: DatePipe) { }
  
  ngOnInit() {
    this.subscription = this.changes.subscribe(e => {
        this.dateChange.emit(e);
      });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  @HostListener('document:dateChange', ['$event'])
  changeEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    const data = event.detail;
    if (data.id === this.id) {
      if ( data.isSingular ) {
        this.updateValueIfCurrentDate(data.finaldate);
      } else {
        this.updateValueForHostInput(data.finaldate);
      }
      this.changes.next(data.finaldate);
    }
  }

  updateValueForHostInput({from, to}) {
    this.xyz = `From: ${
      this.formatDate(from.date)
    } - To: ${
      this.formatDate(to.date)
    }`;
  }

  updateValueIfCurrentDate(date){
    this.xyz = this.formatDate(date);
  }

  formatDate(date) {
    return this._dp.transform(date);
  }
}
