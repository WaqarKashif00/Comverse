import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-logistics-configuration',
  templateUrl: './logistics-configuration.component.html',
  styleUrls: ['./logistics-configuration.component.scss']
})
export class LogisticsConfigurationComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) { }

  URLS = URLS;
  loading: boolean = false;
  is_vendor = this.authService.user.is_vendor;

  ngOnInit(): void {
  }

}
