import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";
import { RegisterService } from "../../register.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material";
import { RegisterExperienceFormDialogComponent } from ".";
import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";

@Component({
  selector: 'app-register-step3',
  templateUrl: './register-step3.component.html',
  styleUrls: ['./register-step3.component.scss'],
})
export class RegisterStep3Component implements OnInit, OnChanges {
  @Input() user;
  @Output() quitClicked: EventEmitter<any> = new EventEmitter();
  @Output() onStepSucceed: EventEmitter<any> = new EventEmitter();

  categories: any;
  dialogRef: any;

  constructor(
    private spinner: CustomLoadingService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private tokenStorage: TokenStorage,
    private registerService: RegisterService
  ) {}

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user && changes.user.currentValue && !this.categories) {
      this.fetchExperiences();
    }
  }

  private async fetchExperiences() {
    try {
      this.categories = await this.registerService.getExperiences(this.tokenStorage.getUser().id);
    } catch (e) {
      this.toastr.error(e.error.message);
    }
  }

  get message(): string {
    return this.tokenStorage.getSettings()? this.tokenStorage.getSettings().profile_experience_msg : '';
  }

  openForm(category: any, experience?: any) {
    this.dialogRef = this.dialog.open(RegisterExperienceFormDialogComponent, {
      panelClass: 'form-dialog',
      data: {
        category,
        experience
      }
    });

    this.dialogRef.afterClosed().subscribe(res => {
      if (!res) return;
      console.log('=====', res);
    });
  }

  quit() {
    this.quitClicked.next(true);
  }

  async save() {
    try {
      this.spinner.show();
      const res = await this.registerService.registerByStep('step3', {}).toPromise();
      this.toastr.success(res.message);
      if (this.tokenStorage.getRegistrantStep() < 4) {
        this.tokenStorage.setUser({ ...this.tokenStorage.getUser(), ...{ lvl: 'registrant4' } });
      }
      this.tokenStorage.setSteps(res.steps);
      this.onStepSucceed.next(res.steps);
    } catch (e) {
      this.toastr.error(e.error.message);
    } finally {
      this.spinner.hide();
    }
  }
}
