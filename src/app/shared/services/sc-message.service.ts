import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class SCMessageService {

  constructor(
    private toastr: ToastrService
  ) { }

  error(e) {
    const errors = e.error.errors;
    if (errors) {
      Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
    } else {
      this.toastr.error(e.error.message);
    }
  }
}
