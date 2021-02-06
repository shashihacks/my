import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TreeMapService {
  data: object = {
    "name": "A1",
    "tooltip": "A1 tooltip",
    "contextMenu": {
      "title": "A1",
      "content": "https://www.bookmyshow.com",
      "subContent": ""
    },
    "value": 100,
    "children": [
      {
        "name": "B1",
        "tooltip": "B1 tooltip",
        "contextMenu": {
          "title": "B1 | A1",
          "content": "",
          "subContent": ""
        },
        "value": 100,
        "children": [
          {
            "name": "C1",
            "tooltip": "C1 tooltip",
            "contextMenu": {
              "title": "C1 | B1 | A1",
              "content": "",
              "subContent": ""
            },
            "value": 100
          },
          {
            "name": "C2",
            "tooltip": "C2 tooltip",
            "contextMenu": {
              "title": "C2 | B1 | A1",
              "content": "",
              "subContent": ""
            },
            "value": 300
          },
          {
            "name": "C3",
            "tooltip": "C3 tooltip",
            "contextMenu": {
              "title": "C3 | B1 | A1",
              "content": "",
              "subContent": ""
            },
            "value": 200
          }
        ]
      },
      {
        "name": "B2",
        "tooltip": "B2 tooltip",
        "contextMenu": {
          "title": "B2 | A1",
          "content": "",
          "subContent": ""
        },
        "value": 200,
        "children": [
          {
            "name": "C4",
            "tooltip": "C4 tooltip",
            "contextMenu": {
              "title": "C4 | B2 | A1",
              "content": "",
              "subContent": ""
            },
            "value": 100
          },
          {
            "name": "C5",
            "tooltip": "C5 tooltip",
            "contextMenu": {
              "title": "C5 | B2 | A1",
              "content": "",
              "subContent": ""
            },
            "value": 300
          },


          {
            "name": "C15",
            "tooltip": "C15 tooltip",
            "contextMenu": {
              "title": "C15 | B2 | A1",
              "content": "",
              "subContent": ""
            },
            "value": 300
          },

        ]
      },
      {
        "name": "B3",
        "tooltip": "B3 tooltip",
        "contextMenu": {
          "title": "B3 | A1",
          "content": "",
          "subContent": ""
        },
        "value": 200,
        "children": [
          {
            "name": "C27",
            "tooltip": "C27 tooltip",
            "contextMenu": {
              "title": "C27 | B3 | A1",
              "content": "",
              "subContent": ""
            },
            "value": 100
          },
          {
            "name": "C28",
            "tooltip": "C28 tooltip",
            "contextMenu": {
              "title": "C28 | B3 | A1",
              "content": "",
              "subContent": ""
            },
            "value": 300
          },
          {
            "name": "C29",
            "tooltip": "C29 tooltip",
            "contextMenu": {
              "title": "C29 | B3 | A1",
              "content": "",
              "subContent": "https://www.bookmyshow.com"
            },
            "value": 200
          }
        ]
      }
    ]
  }
  constructor() {

  }
}
