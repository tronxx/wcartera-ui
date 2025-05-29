import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from './core/instances/services/config.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { MatCardModule} from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from '@angular/material/snack-bar'
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { DatePipe } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
//import { DateFnsModule, DateFnsAdapter} from '@angular/material-date-fns-adapter';
//import { es } from 'date-fns/locale';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

export const MAT_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: 'dd-MM-yyyy'},
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel:'MM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel:  'MMMM YYYY',
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgChartsModule,
    MatDialogModule,
    NgChartsModule,
    HttpClientModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CdkMenu,
    CdkMenuTrigger,
    FormsModule,
    StoreModule.forRoot({}, {}),
    MatNativeDateModule,
    WebcamModule,
  ],
  providers: [
    ConfigService,
    DatePipe,
    //{ provide: DateAdapter, useClass: DateFnsAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FORMATS},
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    //{ provide: LOCALE_ID, useValue: 'es' },
    //{provide: MAT_DATE_LOCALE, useValue: es}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
