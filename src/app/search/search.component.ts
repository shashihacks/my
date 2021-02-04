import { AfterContentInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import dataTreeSimple from '../../assets/data-tree-simple';
import * as d3 from 'd3'
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {



  content = 'Images'

  contentTypes = [
    "Images",
    "Audio",
    "Video",
    "Metadata",
    "Sitemap"
  ]
  headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

  siteMapLinks
  metaTagLinks
  imageContent: any
  URL: any;
  data: any[];
  selectedNode: any;
  constructor(private http: HttpClient) {

    // this.data = dataTreeSimple.result;


  }

  onSearch(searchURL) {
    console.log("clicked", searchURL.value)
    this.URL = searchURL.value
    this.http.post<any>('http://localhost:3000/url', { url: searchURL.value, }, { headers: this.headers }).subscribe(response => {
      console.log('response received', response)
      this.imageContent = response

    },
      (error) => {                              //Error callback
        console.error('error caught in component')
      }
    )
  }


  onContentFetch(contentType, url) {

    this.content = contentType
    switch (contentType) {
      case 'Images':
        this.fetchImages();
        break;
      case 'Audio':
        this.fetchAudio();
        break;
      case 'Video':
        this.fetchVideo();
        break;
      case 'Metadata':
        this.fetchMetaData(url);
        break;
      case 'Sitemap':
        this.fetchSiteMap();
        break;
      default:
        break;
    }
  }
  fetchSiteMap() {
    console.log("sitemap links")
    this.http.post<any>('http://localhost:3000/url', { url: this.URL, type: 'sitemap' }, { headers: this.headers }).subscribe(response => {

      this.siteMapLinks = response.slice(0, 11)
      console.log('sitemap received', this.siteMapLinks)
    },
      (error) => {                              //Error callback
        console.error('error caught in component')
      }
    )
  }
  fetchMetaData(url) {
    console.log("metadata links", url)
    this.http.post<any>('http://localhost:3000/url', { url: url, type: 'meta' }, { headers: this.headers }).subscribe(response => {

      this.metaTagLinks = response
      console.log('metadata received', this.metaTagLinks)
    },
      (error) => {                              //Error callback
        console.error('error caught in component')
      }
    )
  }
  fetchVideo() {
    console.log("video links")
  }
  fetchAudio() {
    console.log("audio links")
  }
  fetchImages() {
    console.log("image links")
  }

  // ngOnInit(): void {
  // }

  nodeUpdated(node: any) {
    console.info("app detected node change");
  }
  nodeSelected(node: any) {
    console.info("app detected node selected", node);
    this.selectedNode = node;

  }


}
