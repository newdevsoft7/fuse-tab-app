import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";
import { RegisterService } from "../../register.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material";
import { RegisterExperienceFormDialogComponent } from "./experience-form-dialog/experience-form-dialog.component";
import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";

import * as moment from 'moment';
import * as _ from 'lodash';

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
      this.handleError(e);
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
      this.saveExperience(res.category, res.experience);
    });
  }

  editExperience(category: any, rawExp: any): void {
    let experience: any = {
      id: rawExp.id
    };
    for (let i = 0; i < rawExp.data.length; i++) {
      experience[`h${category.headings[i].id}`] = rawExp.data[i];
      if (category.headings[i].type === 'date') {
        experience[`h${category.headings[i].id}`] = moment(rawExp.data[i], category.dformat).format('YYYY-MM-DD');
      } else if (category.headings[i].type === 'list') {
        experience[`h${category.headings[i].id}`] = parseInt(rawExp.data[i]);
      }
    }
    this.openForm(category, experience);
  }

  async deleteExperience(category: any, rawExp: any): Promise<any> {
    try {
      this.spinner.show();
      await this.registerService.deleteExperience(rawExp.id);
      const index = category.experience.findIndex(exp => exp.id === rawExp.id);
      category.experience.splice(index, 1);
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  private async saveExperience(category: any, experience: any) {
    try {
      this.spinner.show();
      let res;
      if (experience.id) {
        res = await this.registerService.updateExperience(experience);
        this.toastr.success(res.message);
        const experiences = _.cloneDeep(category.experience);
        for (let exp of experiences) {
          if (exp.id === parseInt(experience.id)) {
            exp.data = res.data;
            break;
          }
        }
        category.experience = experiences;
      } else {
        experience.experience_cat_id = category.id;
        res = await this.registerService.createExperience(this.user.id, experience);
        this.toastr.success(res.message);
        delete res.message;
        const experiences = _.cloneDeep(category.experience);
        experiences.push(res);
        category.experience = experiences;
      }
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  getDisplayValue(value: string, options: any): string {
    return options.find(option => option.id === parseInt(value)).oname;
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
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  private handleError(e) {
    this.toastr.error(e.error.message);
  }
}
