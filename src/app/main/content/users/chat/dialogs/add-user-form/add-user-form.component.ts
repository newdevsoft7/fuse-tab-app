import { Component, ViewEncapsulation } from "@angular/core";
import { MatDialogRef } from "@angular/material";
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

  constructor(
    public dialogRef: MatDialogRef<AddUserFormDialogComponent>,
    private usersChatService: UsersChatService) {}

  isUserSelected(user: any): boolean {
    return this.selectedUsers.indexOf(user.id) > -1;
  }

  select(user: any): void {
    if (this.isUserSelected(user)) {
      const index = this.selectedUsers.indexOf(user.id);
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user.id);
    }
  }

  async searchUsers(): Promise<any> {
    if (!this.searchText) {
      this.users = [];
      return;
    }
    try {
      this.users = await this.usersChatService.searchRecipient(this.searchText);
    } catch (e) {
      console.error(e);
    }
  }
}
