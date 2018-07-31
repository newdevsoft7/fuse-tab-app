import { Component, OnInit, ViewChild } from "@angular/core";
import { ShowcaseViewService } from "./showcase-view.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ShowcaseComponent } from "../showcase/showcase.component";

@Component({
  selector: 'sc-showcase-view',
  templateUrl: './showcase-view.component.html',
  styleUrls: ['./showcase-view.component.scss']
})
export class ShowcaseViewComponent implements OnInit {

  data: any;
  @ViewChild('showcase') showcaseComponent: ShowcaseComponent;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private showcaseViewService: ShowcaseViewService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      if (!data.hasOwnProperty('user_id') || !data.hasOwnProperty('cap_id') || !data.hasOwnProperty('type')) {
        this.toastr.error('Insufficient params!');
        return;
      }
      this.fetchData(data);
    });

    if (window.addEventListener) {
      window.addEventListener('message', this.onMessage.bind(this), false);
    } else if ((<any>window).attachEvent) {
      (<any>window).attachEvent('onmessage', this.onMessage.bind(this), false);
    }
  }

  async fetchData(data: any) {
    try {
      const { type } = data;
      if (data.type === 'card') {
        const payload = await this.showcaseViewService.getUserCard(data.user_id, data.cap_id);
        this.data = {
          payload,
          type,
          template_id: payload.other_id,
          public: true
        };
      }
    } catch (e) {
      this.toastr.error(e.error.message);
    }
  }

  onMessage(event: any) {
    if (event.data.type === 'showcaseconnect' && event.data.message === 'loaded') {
      this.showcaseComponent.loading = false;
    }
  }
}
