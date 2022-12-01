import { Component, Directive, OnInit, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['../../../assets/css/components.css'],
})

export class RegisterComponent implements OnInit {

    password1 = '';
    password2 = '';
    username = '';

    public constructor() { 
    }

    public ngOnInit(): void {
    }

}

@Directive({
    selector: '[appForbiddenName]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: ForbiddenValidatorDirective,
        multi: true
    }]
})

export class ForbiddenValidatorDirective implements Validator {

    @Input('appForbiddenName') forbiddenName = '';

    validate(control: AbstractControl): ValidationErrors | null {
        return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
                                  : null;
      }
}

@Directive({
    selector: '[appMatch]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: MatchValidatorDirective,
        multi: true
    }]
})

export class MatchValidatorDirective implements Validator {

    @Input('appMatch') match = '';

    validate(control: AbstractControl): ValidationErrors | null {
        return;
    }
}
