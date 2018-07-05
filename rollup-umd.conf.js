export default {
  entry: "tmp/esm5/ng-date-picker-advanced.js",
  dest: "dist/bundles/ng-date-picker-advanced.umd.js",
  name: "ngDatePickerAdvanced",
  format: "umd",
  globals: {
    // Angular dependencies
    "@angular/animations": "ng.animations",
    "@angular/core": "ng.core",
    "@angular/common": "ng.common",
    "rxjs/Observable": "Rx",
    "rxjs/ReplaySubject": "Rx",
    "rxjs/BehaviourSubject": "Rx",
    "rxjs/Subscription": "Rx",
    "rxjs/add/operator/map": "Rx.Observable.prototype",
    "rxjs/add/operator/mergeMap": "Rx.Observable.prototype",
    "rxjs/add/operator/fromEvent": "Rx.Observable",
    "rxjs/add/operator/of": "Rx.Observable"
  }
};
