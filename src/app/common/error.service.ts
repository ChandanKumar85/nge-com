import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  handleError(err:HttpErrorResponse){
    if(!err.error || !err.error.error){
      return throwError('UNKNOWN')
    }else {
      return throwError(err.error.error.message)
    }
  }
  
  errorMessage = {
    UNKNOWN: 'An Unknown Error is Occurred.',
    EMAIL_EXISTS: 'Email is Already Exists.',
    OPERATION_NOT_ALLOWED: 'Password sign-in is disabled.',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'We have blocked all requests.',
    EMAIL_NOT_FOUND: 'This user mey have been deleted.',
    INVALID_PASSWORD: 'This password is invalid. or the user does not have a password.',
    USER_DISABLED: 'The user account has been disabled by admin.'
  }

}
// This is no user record corresponding to this identifire.   