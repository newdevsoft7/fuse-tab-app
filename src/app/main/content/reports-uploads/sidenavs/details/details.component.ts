import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { ReportsUploadsService } from '../../reports-uploads.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-reports-uploads-details-sidenav',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  animations: fuseAnimations
})
export class ReportsUploadsDetailsSidenavComponent implements OnInit {

  selected: any;
  private alive = true;
  selectedFolder: any = {};

  constructor(
    private reportsUploadsService: ReportsUploadsService
  ) { }

  ngOnInit() {
    this.reportsUploadsService.onFileSelected
        .takeWhile(() => this.alive)
        .subscribe(selected => {
          this.selected = selected;
          const folders = _.clone(this.reportsUploadsService.folders);
          this.selectedFolder = _.last(folders); 
        });
  }

}
