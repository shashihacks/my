import { AfterContentInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as d3 from 'd3'
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  contentTypes = [
    "Images",
    "Audio",
    "Video",
    "Meta Data",
    "Sitemap"
  ]
  headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });


  images: any
  constructor(private http: HttpClient) { }

  onSearch(searchURL) {
    console.log("clicked", searchURL.value)
    this.http.post<any>('http://localhost:3000/url', { url: searchURL.value, }, { headers: this.headers }).subscribe(response => {
      console.log('response received', response)
      this.images = response

    },
      (error) => {                              //Error callback
        console.error('error caught in component')
      }
    )
  }


  onContentFetch(contentType) {
    console.log("get", contentType)
    if (contentType == '') {

    }
  }

  ngOnInit(): void {
  }


}
