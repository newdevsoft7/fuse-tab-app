import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

export enum CategoryAction{
    NONE = -1,
    GETLIST = 0,
    SELECT,
    CREATE,
    UPDATE,
    DELETE
}

@Injectable()
export class TrackingActionService {

    private CategoryAction = new Subject<any>();

    getCategoryActionState() {
        return this.CategoryAction.asObservable();
    }

    toggleCategoryActionState(CategoryAction: CategoryAction, param1?: any ) {
        this.CategoryAction.next({ action: CategoryAction, param1: param1 });
    }
}