import { TimeSlotRoutingModule } from './time-slot-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoggedInAuthGuard, LoggedOutAuthGuard } from 'src/app/auth/auth.guard';
import {MatTabsModule} from '@angular/material/tabs';
import { TimeSlotComponent, TimeSlotDeleteDialog } from './time-slot/time-slot.component';
import { CreateTimeSlotComponent } from './create-time-slot/create-time-slot.component';
import { EditTimeSlotComponent, TimeSlotDetailDeleteDialog } from './edit-time-slot/edit-time-slot.component';



@NgModule({
  declarations: [
    TimeSlotComponent,
    TimeSlotDeleteDialog,
    TimeSlotDetailDeleteDialog,
    CreateTimeSlotComponent,
    EditTimeSlotComponent
  ],
  imports: [
    CommonModule,
    TimeSlotRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    AngularFileUploaderModule,

    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTableModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule,
    MatMenuModule,
    MatChipsModule,
    MatExpansionModule,
    MatListModule,
    MatProgressSpinnerModule,
    DragDropModule,
    NgxDropzoneModule,
    SharedModule,
    MatTabsModule
  ],
  providers: [LoggedInAuthGuard, LoggedOutAuthGuard],

})
export class TimeSlotModule { }
