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

  currentStep: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fuseConfig: FuseConfigService
  ) {

  }

  ngOnInit() {
    this.route.firstChild.params.subscribe((res: {step: string}) => {
      const step = parseInt(res.step);
      this.currentStep = step;
      if (this.stepper.selectedIndex !== step) {
        this.stepper.selectedIndex = step;
      }
    });

    this.stepper.selectionChange.subscribe(res => {
      const step = res.selectedIndex + 1;
      if (step === this.currentStep) return;
      this.router.navigate(['/register', step]);
    });
  }

  nextStep() {
    this.router.navigate(['/register', this.currentStep + 1]);
  }

  prevStep() {
    this.router.navigate(['/register', this.currentStep - 1]);
  }

  doSubmit() {
    // @todo
  }
}
