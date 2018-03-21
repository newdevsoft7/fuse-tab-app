import { Component, ViewChild, OnInit } from "@angular/core";
import { MatHorizontalStepper } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { FuseConfigService } from "../../../../core/services/config.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('stepper') stepper: MatHorizontalStepper;

  user;

  currentStep: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fuseConfig: FuseConfigService
  ) {

  }

  ngOnInit() {
    this.route.firstChild.params.subscribe((res: {step: string}) => {
      let step = parseInt(res.step) || 0;
      if (step >= 8) {
        step = 7;
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

  doSubmit() {
  }
}
