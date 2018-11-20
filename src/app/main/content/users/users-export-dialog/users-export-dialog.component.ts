import {
  Component, Inject, OnInit,
  ViewEncapsulation, AfterViewInit,
  ViewChild
} from '@angular/core';
import { UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialogRef, MatInput, MatAutocompleteSelectedEvent } from '@angular/material';
import { UserService } from '@main/content/users/user.service';
import { FilterService } from '@shared/services/filter.service';
import { Observable } from 'rxjs/Observable';
import { ScheduleService } from '@main/content/schedule/schedule.service';
import { Tag } from '@main/content/users/search-bar/search-bar.component';
import { from } from 'rxjs/observable/from';

export interface Tag {
  id: string;
  text: string;
}

export function arrayDiffObj(s: any[] | any, v: any[], key: string) {
  if (!s) { return []; }
  s = Array.isArray(s) ? s : [s];
  const reducedIds = v.map(k => k.id);
  return s.filter((obj: any) => reducedIds.indexOf(obj[key]) === -1);
}

@Component({
  selector: 'app-users-export-dialog',
  templateUrl: './users-export-dialog.component.html',
  styleUrls: ['./users-export-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersExportDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('chipInput') chipInput: MatInput;

  types: any[] = [];
  selectedType = 'utype:=:all';

  source = []; // User Filters
  filters = [];

  extraUserInfo$;
  extraUserInfo: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<UsersExportDialogComponent>,
    private userService: UserService,
    private scheduleService: ScheduleService,
    private filterService: FilterService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit() {
    this.init();
    this.getFilters();

    this.extraUserInfo$ = (text: string): Observable<any> => {
      return from(this.filterService.getExtraUserInfoFilter(text));
    };
  }

  ngAfterViewInit() {
    Observable.fromEvent(this.chipInput['nativeElement'], 'keyup')
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((event: KeyboardEvent) => {
        if (![UP_ARROW, DOWN_ARROW].includes(event.keyCode)) {
          this.getFilters(this.chipInput['nativeElement'].value.toLowerCase());
        }
      });
  }

  export() {
    this.dialogRef.close();
    const payloads: any = {
      user_type: this.selectedType.split(':=:')[1]
    };
    if (this.filters.length > 0) {
      payloads.filters = this.filters.map(v => v.id);
    }
    if (this.extraUserInfo.length > 0) {
      payloads.extra_info = this.extraUserInfo.map(v => v.id);
    }
    this.userService.export(payloads);
  }

  private async init() {
    try {
      this.types = await this.userService.getUsersTypeFilters();
    } catch (e) {
      console.log(e);
    }
  }

  add(event: MatAutocompleteSelectedEvent): void {
    const t: Tag = event.option.value;
    this.filters.push(t);
    this.chipInput['nativeElement'].value = '';
    this.chipInput['nativeElement'].blur();
    this.getFilters('');

  }

  addNew(input: MatInput): void {
    let inputValue = input.value.trim();
    let searchedTag: Tag;

    this.source.forEach(group => {
      if (group.children.findIndex(o => o.text == inputValue) >= 0) {
        searchedTag = group.children.find(o => o.text == inputValue);
        return;
      }
    });

    let newTag: Tag;

    if (inputValue != '') {
      if (searchedTag) {
        if (this.filters.findIndex(v => v.id == searchedTag.id) < 0) {
          newTag = { ...searchedTag };
          this.filters.push(newTag);
        }
      } else {
        if (this.filters.findIndex(v => v.id == inputValue) < 0) {
          newTag = { id: input.value, text: input.value };
          this.filters.push(newTag);
        }
      }
    }

    this.chipInput['nativeElement'].value = '';
    this.getFilters('');
  }

  remove(tag: Tag): void {
    this.filters = this.filters.filter((i: Tag) => i.id !== tag.id);
    this.filters = this.filters;
    this.chipInput['nativeElement'].blur();
    this.getFilters('');
  }

  sourceFiltered(groupItems: Tag[]): Tag[] {
    return arrayDiffObj(groupItems, this.filters, 'id');
  }

  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.text : value;
  }

  private async getFilters(query = '') {
    try {
      this.source = await this.userService.getUsersFilters(query);
    } catch (e) { }
  }

}
