# ng-datepickeradvanced
[![Greenkeeper badge](https://badges.greenkeeper.io/abhishek-mittal/ng-date-picker-advanced.svg)](https://greenkeeper.io/)

## Installation
<pre>
<code>
npm install ng-datepickeradvanced
</code>
</pre>

> Note*: Bootstrap 4.x.x is required.

    import { DatePickeAdvancedModule } from 'ng-datepickeradvanced'
   
  

> For dropdown style add few lines of code as followed.

 - `import { ABInputDirective } from 'ng-datepickeradvanced'`
```
<div  id="abDatePicker">
<input  ABInput  disabled [id]="'datePicker'" (dateChange)="callFunction1($event)" />
<i  class=" fas fa-chevron-circle-down"  for="datePicker" (click)="activateDatePicker = !activateDatePicker"></i>
<app-date-picker-advanced [min]="min" [max]="max" [id]="'datePicker'" *ngIf="activateDatePicker"></app-date-picker-advanced>
</div>
```

> Note*: ID is required in case to prevent event emitter from invoking on every instance.

 -
  ```
  #abDatePicker {
}
#abDatePicker > i {
	color: blueviolet;
	margin: 12px  -39px;
	font-size: 30px;
	position: absolute;
	cursor: pointer;
}
```


## Demo

 - Single Date Select

![](https://lh3.googleusercontent.com/0SE0gsj7kDwIpyI5pIczWxwl4sd-d1M9rkud5ed_qzY-K_cVhW0XgDxLkbD_kPcpds9HRWp_bjZs)

* Date Range Select

![
](https://lh3.googleusercontent.com/ypEchr0ioRmR3HlXWFUl3WUgbScnKE5yjVQwmzryfTD9kxRSThDq8nyHOSmsMWUq8-yo0_oSyBWH)

## API

**For: app-date-picker-advanced**

| Name        | Description 
| ------------- |:-------------:| -----:|
| @Input() min: string| The minimum valid date.
| @Input() max: string| The maximum valid date.
| @Input() id: string| Required if using more than one instance on same component.

**For: input - derivative [ABInput]**

| Name        | Description 
| ------------- |:-------------:| -----:|
| @Input() dateChange: EventEmitter< Object >| Emits the output if the value.
| @Input() id: string| Required if using more than one instance on same component.

## Results

Date-Range: 

    {
	    from: {
		    date: Date,
		    isValid: Boolean
	    },
		to: {
		    date: Date,
		    isValid: Boolean
	    }
    }

Singular: Date
