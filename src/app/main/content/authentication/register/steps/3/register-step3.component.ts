import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";
import { RegisterService } from "../../register.service";
import { ToastrService } from "ngx-toastr";
import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";

@Component({
  selector: 'app-register-step3',
  templateUrl: './register-step3.component.html',
  styleUrls: ['./register-step3.component.scss'],
})
export class RegisterStep3Component implements OnInit {
  @Input() user;
  @Output() quitClicked: EventEmitter<any> = new EventEmitter();
  @Output() onStepSucceed: EventEmitter<any> = new EventEmitter();

  settings: any;

  constructor(
    private spinner: CustomLoadingService,
    private tokenStorage: TokenStorage,
    private registerService: RegisterService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.settings = this.tokenStorage.getSettings();
  }

  quit() {
    this.quitClicked.next(true);
  }

  async save() {
    try {
      this.spinner.show();
      const res = await this.registerService.registerByStep('step3', {}).toPromise();
      //this.toastr.success(res.message);
      if (this.tokenStorage.getRegistrantStep() < 4) {
        this.tokenStorage.setUser({ ...this.tokenStorage.getUser(), ...{ lvl: 'registrant4' } });
      }
      this.tokenStorage.setSteps(res.steps);
      this.onStepSucceed.next(res.steps);
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  private handleError(e) {
    const errors = e.error.errors;
    if (errors) {
      Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
    }
    else {
      this.toastr.error(e.error.message);
    }
  }
}
