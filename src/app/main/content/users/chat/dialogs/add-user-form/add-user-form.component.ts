import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UsersChatService } from "../../chat.service";

@Component({
  selector: 'add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUserFormDialogComponent {
  
  selectedUsers: any = [];

  users: any = [];
  searchText: string = '';

  currentUserIds: any = [];

  constructor(
    public dialogRef: MatDialogRef<AddUserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private usersChatService: UsersChatService) {

    this.currentUserIds = data;
  }

  isUserSelected(user: any): boolean {
    return this.selectedUsers.indexOf(user) > -1;
  }

  select(user: any): void {
    if (this.isUserSelected(user)) {
      const index = this.selectedUsers.indexOf(user);
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user);
    }
  }

  async searchUsers(): Promise<any> {
    if (!this.searchText) {
      this.users = [];
      return;
    }
    try {
      this.users = (await this.usersChatService.searchRecipient(this.searchText)).filter(user => this.currentUserIds.indexOf(user.id) === -1);
    } catch (e) {
      console.error(e);
    }
  }
}
