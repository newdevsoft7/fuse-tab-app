import { Component, ViewChild, OnInit } from "@angular/core";
import { MatHorizontalStepper } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {

  @ViewChild('stepper') stepper: MatHorizontalStepper;

  currentStep: number;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.firstChild.params.subscribe((res: {step: string}) => {
      const step = parseInt(res.step);
      this.currentStep = step;
      if (this.stepper.selectedIndex !== step - 1) {
        this.stepper.selectedIndex = step - 1;
      }
    });

    this.stepper.selectionChange.subscribe(res => {
      const step = res.selectedIndex + 1;
      if (step === this.currentStep) return;
      this.router.navigate(['/complete', step]);
    });
  }

  nextStep() {
    this.router.navigate(['/complete', this.currentStep + 1]);
  }

  prevStep() {
    this.router.navigate(['/complete', this.currentStep - 1]);
  }

  doSubmit() {
    // @todo
  }
}
