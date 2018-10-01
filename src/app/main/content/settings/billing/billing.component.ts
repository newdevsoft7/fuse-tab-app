import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions, ElementEventType } from 'ngx-stripe';
import { SettingsService } from '../settings.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SCMessageService } from '../../../../shared/services/sc-message.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit, OnDestroy {

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

  haveCard: boolean;
  showForm: boolean = false;
  cardBrand: string;
  cardLast4: any;
  cardExpiry: string = '02/20';
  cardSubscription: Subscription;
  cardFetched: boolean = false;
  message: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private stripeService: StripeService,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    private scMessageService: SCMessageService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.fetchInvoices();
    this.getStripeBillCard();
  }

  ngAfterViewChecked() {
    if (this.card && !this.cardSubscription) {
      this.cardSubscription = this.card.on.subscribe(e => {
        if (e.type == 'change') {
          this.cardInvalid = !e.event.complete;
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.cardSubscription) {
      this.cardSubscription.unsubscribe();
    }
  }

  async getStripeBillCard() {
    try {
      const res = await this.settingsService.getStripeBillCard();
      this.haveCard = res.got_card;
      this.showForm = res.show_form;
      this.cardBrand = res.card_brand;
      this.cardLast4 = res.card_last4;
      this.message = res.message;
    } catch (e) {
      this.scMessageService.error(e);
    } finally {
      this.cardFetched = true;
    }
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
      this.scMessageService.error(e);
    } finally {
      this.isLoading = false;
    }
  }

  saveStripeBillCard() {
    const name = this.form.get('name').value;
    this.stripeService
      .createToken(this.card.getCard(), { name })
      .subscribe(async result => {
        if (result.token) {
          try {
            const res = await this.settingsService.updateStripeBillCard(result.token.id);
            this.haveCard = res.got_card;
            this.cardBrand = res.card_brand;
            this.cardLast4 = res.card_last4;
            this.showForm = res.show_form;
          } catch (e) {
            this.scMessageService.error(e);
          }
        } else if (result.error) {
          this.toastr.error(result.error.message);
        }
      });
  }

  update() {
    this.showForm = true;
    this.haveCard = false;
  }

  onActivate(evt) {

  }

  min(x, y) {
    return Math.min(x, y);
  }

}
