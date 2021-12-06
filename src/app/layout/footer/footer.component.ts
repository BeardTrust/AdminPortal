import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
/**
 * the footer component renders the banner at the bottom of the page using footer.component.html and uses styling from footer.component.css
 */
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
