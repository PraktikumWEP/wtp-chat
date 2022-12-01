import { Component, Directive, OnInit, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors, AsyncValidator, ValidatorFn, FormGroup } from '@angular/forms';

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

export class ForbiddenValidatorDirective implements AsyncValidator {

    @Input('appForbiddenName') forbiddenName = '';

    validate(control: AbstractControl): ValidationErrors | null {
        return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
                                  : null;
      }
}

// check if passwords match
@Directive({
    selector: '[appMatch]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: MatchValidatorDirective,
        multi: true
    }]
})

export class MatchValidatorDirective implements Validator {

    validate(control: AbstractControl): ValidationErrors | null {
        return this.match ? matchValidator(pw1,pw2)(control) : null;
    }
}

export function matchValidator(s1: String, s2: String): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let isValid = false;
        if (control && control instanceof FormGroup) {
            let group = control as FormGroup;
            if (group.controls['pw1'].value == group.controls['pw2'].value) {
                isValid = group.controls['pw1'].value == group.controls['pw2'].value;
            }
        }
        if (isValid) {
            return null;
        }
        else {
            return {'passwordCheck': 'failed'}
        }
    }
}
