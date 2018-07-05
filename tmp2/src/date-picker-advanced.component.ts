
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-date-picker-advanced',
  templateUrl: './date-picker-advanced.component.html',
  styleUrls: ['./date-picker-advanced.component.css']
})
export class DatePickerAdvancedComponent implements OnInit {

  @Input() id: string;

  singularDate = false;

  private __years = Array.from(Array(200).keys()).map( y => y + 1900);
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  private __months = [
    'Jan',
    'Feb',
    'Mar',
    'April',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  years: any;
  months: any;

  startMonthSelected = true;
  startYearSelected = true;
  endMonthSelected = false;
  endYearSelected = false;


  selectedDate: number;
  selectedMonth: number;
  selectedYear: number;

  selectedEndYear: number;
  selectedEndMonth: number;
  selectedEndDate: number;

  __today: Date;
  __dates_for_c1: Array<Array<any>>;
  __dates_for_c2: Array<Array<any>>;
  __currentDate: Date;
  isRangePicker = false;
  updateToInRange = false;
  updateFromInRange = true;


  __finalDate = {
    from: { date: new Date(), isValid: false},
    to: { date: null, isValid: false}
  };

  _min: Date;
  _max: Date;

  _from: Date;
  _to: Date;

  applyMinMaxRange = false;

  dateCell: any;

  @Output()
  date: EventEmitter<any>  = new EventEmitter();

  @Input('min')
  set min(m: string) {
    this._min = m && this.testDate(m) || this._min;
  }
  @Input('max')
  set max(m: string) {
    this._max = m && this.testDate(m) || this._max;
    this.applyMinMaxRange = true;
  }

  constructor() {
    this.__today = new Date(); // Today's Date
    this._min = new Date(1900, 0, 1); // Range Set - Not Implemented Yet.
    this._max = new Date(2099, 0, 1); // Range Set - Not Implemented Yet.
    this._from = new Date(); // Range Set - Not Implemented Yet.

    this.__dates_for_c1 = []; // Calender Date 1
    this.__dates_for_c2 = []; // Calender Date 2

    this.selectedDate = this.__today.getDate(); // Date selected by the user for calender 1
    this.selectedMonth = this.__today.getMonth(); // Month selected by the user for calender 1
    this.selectedYear = this.__today.getFullYear(); // Year selected by the user for calender 1
    this.selectedEndYear = this.selectedYear;
    this.selectedEndMonth = this.selectedMonth + 1; // Updating the Month of calender 2 JIC
  }

  ngOnInit(): void {
    this.months = this.__months;
    this.years = this.__years;
    this.__currentDate = new Date();
    this.renderCalenderDate();
    this.scrollYearIntoView();
    this.updateMinMax();
  }

  updateMinMax() {
    if ( this.applyMinMaxRange && (this._max >= this._min) ){
      this.years = this.years.filter( n => {
        return (n >= this._min.getFullYear()) && (n <= this._max.getFullYear());
      } );
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  updateDateInInput() {
    const { from, to } = this.__finalDate;
    if (from.isValid && to.isValid) {
      const dateChanges = new CustomEvent( 'dateChange', { detail: { finaldate: this.__finalDate,
        id: this.id
      }} );
      // this.date.emit(
        document.dispatchEvent(dateChanges);
      // );
    } else if ( this.singularDate ) {
      const dateChanges = new CustomEvent( 'dateChange', { detail: { finaldate: this.__currentDate,
        id: this.id, isSingular: this.singularDate
      }} );
      // this.date.emit(
        document.dispatchEvent(dateChanges);
      // );
    }
  }

  // Set Year Value in Calender 1
  setCurrentYear(y = this.__today.getFullYear()) {
    if (y !== this.selectedYear) {
      this.selectedMonth = 0;
      this.selectedDate = 0;
      // this.selectedMonth || (this.selectedMonth = 0);
      // this.selectedDate || (this.selectedDate = 0);
    }
    this.selectedYear = y;
    this.setEndYear(y);
    this.startYearSelected = true;
    this.__currentDate.setFullYear(y);
    // tslint:disable-next-line:no-unused-expression
    const {date, isValid} = this.__finalDate.from;
    this.__finalDate.from.isValid = false; // since from being reset
    this.scrollYearIntoView(0);
  }

  // Set Month Value in Calender 1
  setCurrentMonth(m = this.__today.getMonth()) {
      if (m !== this.selectedMonth) {
        this.selectedDate && (this.selectedDate = 0);
      }
        this.selectedMonth = m;
        this.selectedEndMonth = m;
      this.startMonthSelected = true; // For Removig Date from context
        this.renderCalenderDate({
          y: this.selectedYear,
          m: this.selectedMonth
      });
    // this.isRangePicker && this.setDateRange(m);
  }


  // Final Step: Set Date Value in Calender 1
  setCurrentDate(d = this.__today.getDate()) {

    if (this.singularDate) {
      this.selectedDate = d;
      this.setFromDate(d);
    } else {
      if ((this.selectedMonth === this.__finalDate.from.date.getMonth()) &&
        this.__finalDate.from.isValid
      ) {
        // this.selectedEndMonth = this.selectedMonth;
        // this.selectedEndYear = this.selectedYear;
        this.endMonthSelected = false;
        this.selectedDate = d;
        this.setToDate(d, this.selectedMonth, this.selectedYear);
      } else {
        this.__finalDate.from.isValid = true;
        this.setFromDate(d);
      }
    }
  }

  // End Year Set
  setEndYear (ey) {
    if ( ey !== this.selectedEndYear ) {
      this.selectedEndMonth = 0;
      this.selectedEndDate = 0;
    }
    this.selectedEndYear = ey;
    // this.endMonthSelected = false;
    this.endYearSelected = true;
    this.scrollYearIntoView(1);
  }


   // End Month Set
   setEndMonth(em) {
    const {date, isValid} = this.__finalDate.to;
    isValid && (date.getMonth() !== em) && this.selectedEndDate && (this.selectedEndDate = 0) && (this.__finalDate.to.isValid = false);
    this.endMonthSelected = true;
    this.selectedEndMonth = em;
    this.isRangePicker && this.renderCalenderDate({
      y: this.selectedEndYear,
      m: this.selectedEndMonth
    }, 2);
  }

   // End Date Set
  setEndDate(d = this.selectedEndDate) {
    this.__finalDate.from.isValid &&
      (this.selectedEndDate = d);
    this.setToDate(d);
  }

  // Date Picker Type : Reset
  datePickerTypeChange(type) {
    this.resetFinalObject();
    this.startMonthSelected = type;
    this.endMonthSelected = !type;
    this.endYearSelected = !type;
    this.isRangePicker = type;
  }

  // Highlight Today's date.
  checkForToday(value) {
    return this.selectedMonth === this.__today.getMonth() &&
    this.selectedYear === this.__today.getFullYear() &&
    value === this.__today.getDate();
  }


  // Setting Final Value For From
  setFromDate(date = this.selectedDate, month = this.selectedMonth, year = this.selectedYear) {
    if (this.singularDate) {
      this.__currentDate = new Date(year, month, date);
      this.updateDateInInput();
    } else {
      let isfrom, isto;
      [isfrom, isto] = [this.__finalDate.from.isValid, this.__finalDate.to.isValid];
      if (isfrom && isto) {
        this.resetFinalObject();
      } else {
        this.__finalDate.from.isValid = true;
        this.__finalDate.to.isValid = false;
        this.selectedDate = date;
        this.selectedMonth = month;
        this.selectedYear = year;
        this.__finalDate.from.date = new Date(year, month, date);
      }
    }
  }

  // Setting Final Value For TO
  setToDate(date = this.selectedEndDate, month = this.selectedEndMonth, year = this.selectedEndYear) {
    const { from, to } = this.__finalDate;
    try {
      if ( from.isValid && to.isValid) {
        this.resetFinalObject();
      } else if (
        from.isValid && !to.isValid &&
        (year === from.date.getFullYear() && (month >= from.date.getMonth()))
      ) {
        if (month === from.date.getMonth() && date <= from.date.getDate()) throw 'Set_From_Date'; 
        this.__finalDate.to.date = new Date(year, month, date);
        this.__finalDate.to.isValid = true;
        this.updateDateInInput();
      } else if (
        from.isValid && !to.isValid &&
        year > from.date.getFullYear()
      ) {
        this.__finalDate.to.date = new Date(year, month, date);
        this.__finalDate.to.isValid = true;
      } else {
         throw 'Set_From_Date'; 
      }
    } catch (error) {
      this.endMonthSelected = false;

      this.selectedMonth = this.selectedEndMonth;
      this.selectedYear = this.selectedEndYear;
      this.setFromDate(date);

      this.renderCalenderDate( {
        y: this.selectedYear,
        m: this.selectedMonth
      });
    }
  }

  // Date Selected : Highlighter - Calender 1
  checkFromInRange(e) {

    if ( this.singularDate) {
      return e === this.selectedDate;
    }

    if (
      !this.singularDate &&
      this.__finalDate.from.isValid && this.__finalDate.to.isValid &&
      (this.__finalDate.from.date.getMonth() === this.__finalDate.to.date.getMonth()) &&
      (this.__finalDate.from.date.getFullYear() === this.__finalDate.to.date.getFullYear()) &&
      (this.__finalDate.from.date < this.__finalDate.to.date) &&
      (e >= this.__finalDate.from.date.getDate()) &&
      (e <= this.__finalDate.to.date.getDate())
    ) {

      return true;
    } else if (
      !this.singularDate &&
      this.__finalDate.from.isValid && this.__finalDate.to.isValid &&
      (this.__finalDate.from.date.getMonth() !== this.__finalDate.to.date.getMonth()) &&
      (this.__finalDate.from.date.getFullYear() === this.__finalDate.to.date.getFullYear()) &&
      ((this.__finalDate.from.date < this.__finalDate.to.date) &&
      (e <= 31) && (e >= this.selectedDate))
    ) {
      return true;
    } else if (
      !this.singularDate &&
      this.__finalDate.from.isValid && this.__finalDate.to.isValid &&
      (this.__finalDate.from.date.getFullYear() !== this.__finalDate.to.date.getFullYear()) &&
      ((this.__finalDate.from.date < this.__finalDate.to.date) &&
      (e <= 31) && (e >= this.selectedDate))
    ) {
      return true;
    } else if (
      !this.singularDate &&
      this.__finalDate.from.isValid &&
      (e === this.__finalDate.from.date.getDate() || e === this.selectedDate)
    ) {
      return true;
    }
    return false;
  }

  // Date Selected : Highlighter - Calender 2
  checkToInRange(e) {
    const { from, to } = this.__finalDate;
    return to.isValid &&
           from.isValid &&
           (e <= this.selectedEndDate);
  }


  // For hover Effect
  checkInRange(e) {
    return false;
  }

  // complete
   // Render Calender Date
   renderCalenderDate({y, m} = {
     y: this.__today.getFullYear(),
     m: this.__today.getMonth()
    }, cid = 1) {
    const firstday = new Date(y, m, 1 );
    const noofdays = this.consultDate(m);
    const dateArray = Array.from(Array(noofdays).keys()).map(n => ++n);
    dateArray.unshift(...Array(firstday.getDay()));
    dateArray.filter(f => f <= noofdays || f === undefined);
    const finalDateArray = this.splitArrayIntoSubArray(dateArray, 7);
    switch (cid) {
      case 2:
        this.__dates_for_c2 = finalDateArray;
        break;
      default:
        this.__dates_for_c1 = finalDateArray;
        break;

    }
  }

  // Helper For Renderer
  consultDate(month = this.__today.getMonth()) {
    return new Date(this.__today.getFullYear(), month + 1, 0).getDate();
  }

  // Reset From And To Values
  resetFinalObject() {
    Object.assign(this.__finalDate.from, { date: new Date(1700, 1, 1), isValid: false}) ;
    Object.assign(this.__finalDate.to, { date: null, isValid: false}) ;
  }

  // Scroll Year into View
  scrollYearIntoView(target = 0) {
    setTimeout(_ => {
      document.querySelectorAll('.ab-focus')[target] && document.querySelectorAll('.ab-focus')[target].scrollIntoView();
    }, 100);
  }

  splitArrayIntoSubArray(array, sublength) {
    const finalDateArray = [];
    while (array.length) {
      finalDateArray.push(array.splice(0, sublength));
    }
    return finalDateArray;
  }

  setSingularDatePicker(t) {
    this.singularDate = t;
    this.__currentDate = new Date();
    this.resetFinalObject();
  }

  testDate(d) {
    try {
      return new Date(d);
    } catch (error) {
      return false;
    }
  }

  checkFromMinMax(m) {
    return this.applyMinMaxRange && ((m < this._min.getMonth())
    && (this.selectedYear === this._min.getFullYear())) || ((m > this._max.getMonth())
    && (this.selectedYear === this._max.getFullYear()))
    ;
  }
  checkToMinMax(em) {
    return (this.applyMinMaxRange && (em > this._max.getMonth())
    && (this.selectedEndYear === this._max.getFullYear()));
  }

  checkFromMinMaxDate(d) {
    return this.applyMinMaxRange && ((this.selectedMonth === this._min.getMonth())
    && (this.selectedYear === this._min.getFullYear()) && d < this._min.getDate())
    || ((this.selectedMonth === this._max.getMonth())
    && (this.selectedYear === this._max.getFullYear()) && d > this._max.getDate() );
  }
  checkToMinMaxDate(ed) {
    return ((this.selectedEndMonth === this._max.getMonth())
    && (this.selectedEndYear === this._max.getFullYear()) && ed > this._max.getDate() );
  }
}
