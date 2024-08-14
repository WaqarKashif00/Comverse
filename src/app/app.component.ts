import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    public authService: AuthService
  ) { }

  title = 'ces-dashboard';

  ngOnInit() {
    document.title = environment.client_name + " dashboard";
    console.log("Version 5.7");
  }
}
