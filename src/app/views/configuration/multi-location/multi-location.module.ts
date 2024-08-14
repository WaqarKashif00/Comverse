import { MultiLocationtRoutingModule } from './multi-location-routing.module';
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
import { MultiLocationComponent } from './multi-location/multi-location.component';
import { LocationsComponent, DeleteLocationDialog} from './locations/locations.component';
import { CreateLocationComponent } from './create-location/create-location.component';
import { LocationDetailComponent,AddSubLocationDialog,EditSubLocationDialog,DeleteSubLocationDialog,AddSubLocationGroupDialog ,EditSubLocationGroupDialog,DeleteSubLocationGroupDialog} from './location-detail/location-detail.component';
import { EditLocationComponent } from './edit-location/edit-location.component';




@NgModule({
  declarations: [
  
    MultiLocationComponent,
    LocationsComponent,
    CreateLocationComponent,
    LocationDetailComponent,
    AddSubLocationDialog,
    EditSubLocationDialog,
    EditLocationComponent,
    DeleteSubLocationDialog,
    DeleteLocationDialog,
    AddSubLocationGroupDialog,
    EditSubLocationGroupDialog,
    DeleteSubLocationGroupDialog
    
  ],
  imports: [
    CommonModule,
    MultiLocationtRoutingModule,
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
export class MultiLocationModule { }
