import { AfterContentInit, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import dataTreeSimple from '../../assets/data-tree-simple';
import * as d3 from 'd3'
import { Router } from '@angular/router';
import { TreeMapService } from '../tree-map.service';
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
  newSiteLinks = []
  siteMapLinks = []
  metaTagLinks
  imageContent: any
  URL: any;
  data: any[];
  selectedNode: any;
  constructor(
    private treeMapService: TreeMapService,
    private http: HttpClient, private router: Router) {

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
        this.fetchSiteMap(url);
        break;
      default:
        break;
    }
  }
  async fetchSiteMap(url) {
    console.log("sitemap links")
    let links = this.http.post<any>('http://localhost:3000/url', { url: url, type: 'sitemap' }, { headers: this.headers }).toPromise()
    links.then(response => {
      this.siteMapLinks = response
      // this.refetchLinks();
      for (let i = 0; i < this.siteMapLinks.length; i++) {
        if (this.siteMapLinks[i].tooltip != '') {
          let links2 = this.http.post<any>('http://localhost:3000/url', { url: this.siteMapLinks[i].tooltip, type: 'sitemap' }, { headers: this.headers }).toPromise()
          links2.then(response2 => {
            this.siteMapLinks[i].children.push(response2)
          })
        }

      }


    })

    this.treeMapService.data = this.siteMapLinks
    console.log(this.siteMapLinks)

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





}
