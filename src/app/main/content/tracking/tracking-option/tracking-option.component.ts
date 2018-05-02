import { Component, Input, OnInit } from "@angular/core";
import { TrackingService } from "../tracking.service";

@Component({
  selector: 'app-tracking-option-detail',
  templateUrl: './tracking-option.component.html',
  styleUrls: ['./tracking-option.component.scss']
})
export class TrackingOptionDetailComponent implements OnInit {
  @Input() data: { id?: number, tracking_cat_id?: number };

  constructor(private trackingService: TrackingService) {}

  async ngOnInit() {
    try {
      const res = await this.trackingService.getTrackingOption(this.data.tracking_cat_id, this.data.id).toPromise();
      console.log('=====', res);
      const res1 = await this.trackingService.getTrackingOptionAccess(this.data.id).toPromise();
      console.log('*****', res1);
    } catch (e) {
      console.log(e);
    }
  }
}
