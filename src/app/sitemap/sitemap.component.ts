import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit, AfterContentInit {





  constructor() {


  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }
  ngAfterContentInit() {
    // d3.selectAll(".map").style("color", "red");


  }
}
