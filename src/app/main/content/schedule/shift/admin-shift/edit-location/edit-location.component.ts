import {
	Component, OnInit, ViewEncapsulation,
	Input, Output, EventEmitter,
	ViewChild,
	ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ScheduleService } from '../../../schedule.service';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
	selector: 'app-admin-shift-edit-location',
	templateUrl: './edit-location.component.html',
	styleUrls: ['./edit-location.component.scss']
})
export class AdminShiftEditLocationComponent implements OnInit {

	formActive = false;
	form: FormGroup;

	@Input() shift;
	@Output() onLocationChanged = new EventEmitter;
	@ViewChild('input') input: ElementRef;
	locationControl: FormControl = new FormControl();
	filteredLocations: any[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private scheduleService: ScheduleService
	) { }

	ngOnInit() {
		this.scheduleService.getLocations('').subscribe(res => {
			this.filteredLocations = res;
		});

		// Location Autocomplete
		this.locationControl.valueChanges
			.debounceTime(300)
			.distinctUntilChanged()
			.subscribe(val => {
				if (typeof val === 'string') {
					this.form.patchValue({
						location_id: null,
						location: val
					});

					this.scheduleService.getLocations(val.trim().toLowerCase()).subscribe(res => {
						this.filteredLocations = res;
					});
				}
			});
	}

	display() {
		return this.shift.location ? this.shift.location : 'Empty';
	}

	openForm() {
		this.form = this.formBuilder.group({
			location_id: [this.shift.location_id],
			location: [this.shift.location]
		});
		this.formActive = true;
		setTimeout(() => this.input.nativeElement.value = this.shift.location);
	}

	saveForm() {
		const locationId = this.form.getRawValue().location_id;
		if (locationId !== this.shift.location_id) {
			let param: any = {
				location_id: locationId
			};
			if (locationId === null) {
				param = {
					...param,
					location: null
				};
			} else {
				const location = this.filteredLocations.find(v => v.id === locationId);
				param = {
					...param,
					location: location ? location.lname : null,
					address: location ? location.address : null
				};
			}
			this.scheduleService.updateShift(this.shift.id, param).subscribe(res => {
				let location: any;
				if (locationId !== null) {
					const index = this.filteredLocations.findIndex(v => v.id === locationId);
					location = index < 0 ? null : this.filteredLocations[index];
				} else {
					location = null;
				}
				this.onLocationChanged.next(location);
			});
		}
		this.formActive = false;
	}

	selectLocation(event: MatAutocompleteSelectedEvent): void {
		const location = event.option.value;
		this.form.patchValue({
			location_id: location.id,
			location: location.lname
		});
	}

	closeForm() {
		this.formActive = false;
	}

	locationDisplayFn(value: any): string {
		return value && typeof value === 'object' ? value.lname : value;
	}

}
