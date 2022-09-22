import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { ClientComponent } from './layouts/client/client.component';
import { AuthComponent } from './layouts/auth/auth.component';

// material imports
import {MatCardModule } from "@angular/material/card";
import {MatSidenavModule} from "@angular/material/sidenav";
import { SharedComponentsModule } from '@components/shared-components.module';
import { NavbarComponent } from './layouts/client/navbar/navbar.component';
import { SidebarComponent } from './layouts/client/sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    AuthComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSidenavModule,
    SharedComponentsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
