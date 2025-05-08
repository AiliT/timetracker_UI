import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
            SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'webprog_bead';
  sidebarVisible = false;
  hamburgerColor = "#000";

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.hamburgerColor = (this.hamburgerColor == "#000" ? "#fff" : "#000");
  }
}
