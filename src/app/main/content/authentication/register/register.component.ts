import { Component, ViewChild, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatHorizontalStepper, MatDialog, MatDialogRef } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { FuseConfigService } from "../../../../core/services/config.service";

import * as _ from "lodash";
import { UserService } from "../../users/user.service";
import { TokenStorage } from "../../../../shared/services/token-storage.service";
import { AuthenticationService } from "../../../../shared/services/authentication.service";
import { AppSettingService } from "../../../../shared/services/app-setting.service";
import { FuseConfirmYesNoDialogComponent } from "../../../../core/components/confirm-yes-no-dialog/confirm-yes-no-dialog.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('stepper') stepper: MatHorizontalStepper;

  user;

  currentStep: number;

  forms: FormGroup[] = []; // From step 0 to step 6

  // For step visibility: null => hidden
  steps: any; // From step 1 to step 8

  dialogRef: MatDialogRef<FuseConfirmYesNoDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private tokenStorage: TokenStorage,
    private appSettings: AppSettingService,
    private authService: AuthenticationService,
    private fuseConfig: FuseConfigService
  ) {
    this.steps = this.appSettings.baseData.steps;
    this.user = this.tokenStorage.getUser();
    if (this.user) {
      // For registered, but not completed user, set steps
      this.steps = this.tokenStorage.getSteps();
    }
  }

  ngOnInit() {

    _.times(9, (n) => {
      this.forms[n] = this.formBuilder.group({
        success: [null, Validators.required]
      });
    });

    if (this.user) { // Registered, but not completed user
      this.setSteps(this.steps);
    }

    this.route.firstChild.params.subscribe((res: { step: string }) => {
      let step = parseInt(res.step) || 0;
      if (step >= 9) {
        step = 8;
      }
      this.changeStep(step);
    });

    this.stepper.selectionChange.subscribe(res => {
      const step = res.selectedIndex;
      if (step === this.currentStep) return;
      if (step === 0) {
        this.router.navigate(['/register']);
      } else {
        this.router.navigate(['/register', step]);
      }
    });

  }

  // Callback when step successfully passed
  onStepSucceed(steps) {
    this.setSteps(steps);
  }

  // Set every steps
  setSteps(steps) {

    // Sets step 0 passed
    this.forms[0].patchValue({
      success: 'success'
    });

    // Sets forms from step1 to step8
    const keys = Object.keys(steps);
    this.steps = steps;

    _.forEach(keys, key => {
      const index = parseInt(key.replace('step', ''));
      if (_.isNull(steps[key])) return;
      this.forms[index].patchValue({
        success: steps[key] > 0 ? 'success' : '' // 'success' means passed
      });
    });

    // For last step = 1, Uncheck passed
    const values = _.map(keys, key => {
      return { key, value: steps[key] };
    });
    const lastStep = _.findLast(values, v => v.value === 1);
    if (!_.isUndefined(lastStep)) {
      const index = parseInt(lastStep.key.replace('step', '')); // Last step
      this.forms[index].patchValue({
        success: ''
      });

      // Navigate last step, but consider skipped steps
      let stepsToSkip = 0;
      for (let i = 1; i < index; i++) {
        if (!steps[`step${i}`]) stepsToSkip++;
      }
      const stepIndex = index - stepsToSkip;
      this.changeStep(stepIndex);
      this.router.navigate(['/register', stepIndex]);
    }
  }

  // Callback when user successfully passed step 0
  onUserCreated(user) {
    this.user = user;
  }

  changeStep(step: number) {
    this.currentStep = step;
    if (this.stepper.selectedIndex !== step) {
      this.stepper.selectedIndex = step;
    }
  }

  nextStep() {
    this.router.navigate(['/register', this.currentStep + 1]);
  }

  prevStep() {
    if (this.currentStep === 1) {
      this.router.navigate(['/register']);
    } else {
      this.router.navigate(['/register', this.currentStep - 1]);
    }
  }

  quitStep(event, hideConfirm?: boolean) {
    if (!hideConfirm) {
      this.dialogRef = this.dialog.open(FuseConfirmYesNoDialogComponent, {
        disableClose: false
      });
      this.dialogRef.componentInstance.confirmTitle = 'Really quit?';
      this.dialogRef.componentInstance.confirmMessage = 'You may log in to resume where you left off at any time.';
      this.dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.authService.logout();
        }
      });
    } else {
      this.authService.logout();
    }
  }

  doSubmit() {
  }
}
