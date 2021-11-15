import {Component, OnDestroy, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class HeaderComponent implements OnInit, OnDestroy {
  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
  }
}
