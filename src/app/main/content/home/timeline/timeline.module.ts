import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../core/modules/shared.module";
import { TimelineComponent } from "./timeline.component";
import { EditPostDialogComponent } from "./edit-post-dialog/edit-post-dialog.component";
import { EditCommentDialogComponent } from "./edit-comment-dialog/edit-comment-dialog.component";
import { PinPostDialogComponent } from "./pin-post-dialog/pin-post-dialog.component";
import { PostDialogComponent } from "./post-dialog/post-dialog.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    TimelineComponent,
    EditPostDialogComponent,
    EditCommentDialogComponent,
    PinPostDialogComponent,
    PostDialogComponent
  ],
  exports: [
    TimelineComponent
  ],
  entryComponents: [
    EditPostDialogComponent,
    EditCommentDialogComponent,
    PinPostDialogComponent,
    PostDialogComponent
  ]
})
export class TimelineModule {}
