import {Component, OnDestroy, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {AuthService} from "@services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

/**
 * The header coimponent renders the navbar at the top of the page using header.component.html and uses styling from header.component.css
 */
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
