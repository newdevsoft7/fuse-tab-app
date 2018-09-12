import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions, ElementEventType } from 'ngx-stripe';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { SettingsService } from '../settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '30px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '14px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  form: FormGroup;

  invoices: any[];
  pageSize: number = 20;
  pageNumber: number = 0;
  total: number;
  isLoading: boolean = false;
  pageSizes = [5, 10, 20, 50, 100];
  cardInvalid: boolean = true;
  
  constructor(
    private formBuilder: FormBuilder,
    private stripeService: StripeService,
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.fetchInvoices();
    this.card.on.subscribe(e => {
      if (e.type == 'change') {
        this.cardInvalid = !e.event.complete;
      }
    });
  }

  onPageSizeChange(event) {
    this.pageSize = event.value;
    this.fetchInvoices();
  }

  onSetPage(pageInfo) {
    this.pageNumber = pageInfo.page - 1;
    this.fetchInvoices();
  }

  private async fetchInvoices() {
    try {
      this.isLoading = true;
      const res = await this.settingsService.getBillingInvoices({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      });
      this.invoices = res.data;
      this.pageNumber = res.page_number;
      this.pageSize = res.page_size;
      this.total = res.total_counts;
    } catch (e) {
      this.displayError(e);
    } finally {
      this.isLoading = false;
    }
  }

  save() {
    const name = this.form.get('name').value;
    this.stripeService
      .createToken(this.card.getCard(), { name })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token.id);
        } else if (result.error) {
          this.toastr.error(result.error.message);
        }
      });
  }

  update() {

  }

  delete() {

  }

  onActivate(evt) {

  }

  min(x, y) {
    return Math.min(x, y);
}

  private displayError(e) {
    const errors = e.error.errors;
    if (errors) {
      Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
    }
    else {
      this.toastr.error(e.error.message);
    }
  }

}
