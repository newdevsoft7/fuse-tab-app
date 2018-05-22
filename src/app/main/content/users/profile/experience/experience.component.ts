import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { UsersProfileExperienceService } from "./experience.service";
import { UsersProfileExperienceFormDialogComponent } from "./experience-form-dialog/experience-form-dialog.component";

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-users-profile-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class UsersProfileExperienceComponent implements OnChanges {
  @Input() userInfo: any;
  @Input() settings: any;

  categories: any;
  dialogRef: any;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private experienceService: UsersProfileExperienceService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userInfo && changes.userInfo.currentValue && !this.categories) {
      this.fetchExperiences();
    }
  }

  private async fetchExperiences() {
    try {
      this.categories = await this.experienceService.getExperiences(this.userInfo.id);
    } catch (e) {
      this.handleError(e);
    }
  }

  openForm(category: any, experience?: any) {
    this.dialogRef = this.dialog.open(UsersProfileExperienceFormDialogComponent, {
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
      const index = category.experience.findIndex(exp => exp.id === rawExp.id);
      category.experience.splice(index, 1);
      await this.experienceService.deleteExperience(rawExp.id);
    } catch (e) {
      this.handleError(e);
    }
  }

  private async saveExperience(category: any, experience: any) {
    try {
      if (experience.id) {
        const experiences = _.cloneDeep(category.experience);
        const selectedExp = experiences.find(exp => exp.id === parseInt(experience.id));
        if (selectedExp) {
          let count = 0;
          for (let key in experience) {
            if (key !== 'id') {
              selectedExp.data[count++] = experience[key];
            }
          }
        }
        category.experience = experiences;
        await this.experienceService.updateExperience(experience);
      } else {
        let count = 0, newExp = { id: null, data: [] };
        for (let key in experience) {
          newExp.data[count++] = experience[key];
        }
        category.experience.push(newExp);
        experience.experience_cat_id = category.id;
        const res = await this.experienceService.createExperience(this.userInfo.id, experience);
        newExp.id = res.id;
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  getDisplayValue(value: string, options: any): string {
    return options.find(option => option.id === parseInt(value)).oname;
  }

  private handleError(e) {
    this.toastr.error(e.error.message);
  }
}
