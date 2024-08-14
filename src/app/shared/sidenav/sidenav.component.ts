import { Router } from '@angular/router';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from '../urls';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      this.sideDrawer = "";
    });

  }

  Urls = URLS;
  sideDrawer: string = "";
  userPermissions = this.authService.user_permissions;
  is_vendor = this.authService.user.is_vendor;

  toggleDrawer(drawer) {
    this.sideDrawer = this.sideDrawer == drawer ? "" : drawer;
  }

  closeDrawer() {
    this.sideDrawer = '';
  }

  stopPropagation(event: PointerEvent) {
    event.stopPropagation();
  }

  ngOnInit(): void {
    document.body.onclick = (event: PointerEvent) => {
      this.sideDrawer = "";
    }
  }


}
