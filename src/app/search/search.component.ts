import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('chart4', { static: true }) private chartContainer: ElementRef;
  treemap: boolean = false
  data: any
  name: any;
  root: any;
  svg: any;
  nodeGroupTooltip: any;
  nodeGroupContextMenu: any;
  margin = { top: 30, right: 10, bottom: 30, left: 20 };
  width = 960;
  barHeight = 30;
  barRadius = 15;
  //let barWidth = (width - margin.left - margin.right) * 0.8;
  widthAndDepth = 140;
  barWidth = this.widthAndDepth * 0.8;
  barDepth = this.widthAndDepth + 40;
  verticalSpace = 15;
  barEndStartPointDistance = 100;
  tooltip = { width: 200, height: 24, textMargin: 5 };

  element: any;
  duration = 400;
  links: any;
  nodes: any[];
  i = 0;




  content = 'Images'

  contentTypes = [
    "Images",
    "Audio",
    "Video",
    "Metadata",
    "Sitemap"
  ]
  URL: any;
  headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  newSiteLinks = []
  siteMapLinks = {
    "name": "Home",
    "tooltip": "Index Page",
    "contextMenu": {
      "title": "Home",
      "content": URL,
      "subContent": ""
    },
    "value": URL,
    "children": []
  }
  metaTagLinks
  imageContent: any

  // data: any[];
  selectedNode: any;
  loading: boolean;
  audioContent: any;
  videoContent: any;
  constructor(
    private treeMapService: TreeMapService,
    private http: HttpClient, private router: Router) {

    // this.data = dataTreeSimple.result;

    //Sample dummy data for graph
    // this.data = this.treeMapService.data
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
        this.fetchImages(url);
        break;
      case 'Audio':
        this.fetchAudio(url);
        break;
      case 'Video':
        this.fetchVideo(url);
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
    this.loading = true
    console.log("sitemap links")
    let links = this.http.post<any>('http://localhost:3000/url', { url: url, type: 'sitemap' }, { headers: this.headers }).toPromise()
    links.then(response => {
      console.log("response")
      console.log(response)
      this.siteMapLinks.children = response
      // this.refetchLinks();
      let count = 0;
      for (let i = 0; i < this.siteMapLinks.children.length; i++) {
        if (this.siteMapLinks.children[i].tooltip != '') {
          let links2 = this.http.post<any>('http://localhost:3000/url', { url: this.siteMapLinks.children[i].tooltip, type: 'sitemap' }, { headers: this.headers }).toPromise()
          links2.then(response2 => {
            console.log(response2, "received children", i)
            count += 1
            console.log(count, " no.count")
            this.siteMapLinks.children[i].children = response2
          })

        }

      }
      this.data = this.siteMapLinks
      console.log("tree data")
      console.log(this.treeMapService.data)
      console.log("site data")
      console.log(this.siteMapLinks)
      let treeInterval = setInterval(() => {
        console.log("waiting for render", count)
        if (count >= 4) {

          //remove for level 2 
          let level3count = 0
          //render inner children
          for (let i = 0; i < this.siteMapLinks.children.length; i++) {
            for (let j = i; j < this.siteMapLinks.children[i].children.length; j++) {
              if (this.siteMapLinks.children[i].children[j].tooltip != '') {
                let links3 = this.http.post<any>('http://localhost:3000/url', { url: this.siteMapLinks.children[i].children[j].tooltip, type: 'sitemap' }, { headers: this.headers }).toPromise()
                links3.then(response3 => {
                  level3count += 1
                  this.siteMapLinks.children[i].children[j].children = response3
                  console.log(response3, "level 3 depth")
                })
              }
            }

          }

          console.log("rendering")

          if (level3count >= 25) {
            this.loading = false
            console.log("final sitemap links")
            this.renderTreeChart()
            clearInterval(treeInterval)
          }

        }
      }, 500)

    })

    console.log("sitemap links 3 levels", this.siteMapLinks)
  }

  fetchMetaData(url) {
    // this.treemap = false
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
  fetchVideo(url) {
    console.log("video links")
    this.http.post<any>('http://localhost:3000/url', { url: url, type: 'video' }, { headers: this.headers }).subscribe(response => {

      this.videoContent = response
      console.log('Video content received', this.videoContent)
    },
      (error) => {                              //Error callback
        console.error('error caught in video/component')
      }
    )
  }
  fetchAudio(url) {
    console.log("audio links")
    this.http.post<any>('http://localhost:3000/url', { url: url, type: 'audio' }, { headers: this.headers }).subscribe(response => {

      this.audioContent = response
      console.log('audio content received', this.audioContent)
    },
      (error) => {                              //Error callback
        console.error('error caught in audio/component')
      }
    )
  }
  fetchImages(url) {
    console.log("image links")
    console.log("clicked", url)
    this.URL = url
    this.http.post<any>('http://localhost:3000/url', { url: url, }, { headers: this.headers }).subscribe(response => {
      console.log('response received', response)
      this.imageContent = response

    },
      (error) => {                              //Error callback
        console.error('error caught in component')
      }
    )
  }

  navigateToSource(url) {
    console.log(url)
    // window.location.href = url
    window.open(url, '_blank')
    // this.router.navigateByUrl(url)
  }
  ngAfterViewInit(): void {

    // this.renderTreeChart();
  }
  getSelectedItem(d) {
    this.name = d.data.name;;
  }

  renderTreeChart() {

    this.element = this.chartContainer.nativeElement;
    this.svg = d3.select(this.element).append("svg")
      .attr("width", this.element.offsetWidth) //+ margin.left + margin.right)
      .attr('height', this.element.offsetHeight)
      .attr("id", "chart4svg")
      .append("g")
      .attr("class", "nodes")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.nodeGroupTooltip = d3.select('svg#chart4svg').append('g')
      .attr("class", "tooltip-group")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.nodeGroupContextMenu = d3.select('svg#chart4svg').append('g')
      .attr("class", "context-group")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // open close context menu
    d3.select("body").on("click.context-menu-g", function () {

      console.log("data-type", d3.event.target.getAttribute('data-type'));
      if (d3.event.target.getAttribute('data-type') !== 'contextMenu') {
        d3.selectAll(".context-menu-g").style('display', 'none');
      }

    }.bind(this));

    this.root = d3.hierarchy(this.data);
    this.root.x0 = 0;
    this.root.y0 = 0;
    this.collapseAllChildren(this.root);
    this.update(this.root);

  }

  customDiagonal(d: any) {
    let path = "M" + (d.source.y + this.barWidth) + "," + d.source.x
      + "C" + ((this.barWidth / 2) + (d.source.y + d.target.y) / 2) + "," + d.source.x
      + " " + ((this.barWidth / 2) + (d.source.y + d.target.y) / 2) + "," + d.target.x
      + " " + d.target.y + "," + d.target.x;
    return path;
  }

  diagonalCurvedPath(s, d) {
    const path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`
    return path
  }
  // Toggle children on click.
  click = (d, i, n) => {
    console.log(d, "d node clicked")
    this.resetRootPath(d);
    d3.selectAll('.node').select('rect').classed("selected-node", false);

    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }

    //d3.select(this).classed("selected-node", d3.select(this).classed("selected-node") ? false : true); // for toggle
    d3.select(n[i]).classed("selected-node", true);

    // If the node has a parent, then collapse its child nodes except for this clicked node.
    if (d.parent) {
      d.parent.children.forEach(function (element) {
        if (d.data.name !== element.data.name) {
          this.collapseOtherChildren(element);
        }
      }.bind(this));
    }

    this.update(d);
    setTimeout(function () {
      let tooltip = d3.selectAll(".tooltip-g");
      tooltip.transition()
        .duration(this.duration)
        .attr('transform', function (d: any) { return 'translate(' + d.y + ',' + d.x + ')'; });

      d3.selectAll(".tooltip-g rect").attr('visibility', 'hidden');
      d3.selectAll(".tooltip-g text").attr('visibility', 'hidden');
    }, 500)

  }

  update(source) {
    // Compute the flattened node list.
    this.nodes = this.root.descendants();
    let height = Math.max(500, this.nodes.length * this.barHeight * 2 + this.margin.top + this.margin.bottom);

    console.log(this.nodes);
    d3.select("svg#chart4svg").transition()
      .duration(this.duration)
      .attr("height", height);

    d3.select(self.frameElement).transition()
      .duration(this.duration)
      .style("height", height + "px");

    let index = -1;
    this.root.eachBefore(function (d) {
      ++index;
      let setXAxis = index * (this.barHeight + this.verticalSpace);

      //top left tree view from root
      if (d.depth > 0 && index > 0) {
        setXAxis = setXAxis - (this.barHeight + this.verticalSpace);
      }

      if (d.depth > 1 && index > 0) {
        setXAxis = setXAxis - (this.barHeight + this.verticalSpace);
      }

      if (d.depth > 2 && index > 0) {
        setXAxis = setXAxis - (this.barHeight + this.verticalSpace);
      }

      d.x = setXAxis;
      d.y = d.depth * this.barDepth;
    }.bind(this));

    // Update the nodes…
    let node = this.svg.selectAll("g.node")
      .data(this.nodes, (d) => { return d.id || (d.id = ++this.i); });

    let nodesTooltip = this.nodeGroupTooltip.selectAll('g')
      .data(this.nodes, (d) => { return d.id || (d.id = ++this.i); });

    let nodesContextMenu = this.nodeGroupContextMenu.selectAll('g')
      .data(this.nodes, (d) => { return d.id || (d.id = ++this.i); });

    let nodeEnter = node.enter().append("g")
      //let nodeEnter = node.enter().insert('g', 'g.node')
      .attr("class", "node")
      .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .style("opacity", 0)

    let nodeEnterTooltip = nodesTooltip.enter().append('g')
      .attr("class", "tooltip-g")
      .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });

    let nodeEnterContextMenu = nodesContextMenu.enter().append('g')
      .attr("class", "context-menu-g")
      .attr('id', function (d: any) { return 'nodeContextMenuGroup' + d.id; })
      .style('display', 'none')
      .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });

    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
      .attr("y", -this.barHeight / 2)
      .attr("height", this.barHeight)
      .attr("width", this.barWidth)
      .style("fill", this.color)
      .style('rx', this.barRadius)
      .on("mouseover", this.mouseover)
      //.on("mouseup", this.mouseup)
      .on("mousemove", this.mousemove)
      .on("mouseout", this.mouseout)
      .on("contextmenu", this.contextmenu)
      .on("click", this.click);

    nodeEnter.append("text")
      .attr("dy", 5)
      .attr("dx", 15)
      .style("fill", this.fontColor)
      .text(function (d: any) { return d.data.name; });

    //Tooltip group

    nodeEnterTooltip.append("rect")
      .attr('id', function (d: any) { return 'nodeInfoID' + d.id; })
      .attr('x', 120)
      .attr('y', -12)
      .attr('rx', 12)
      .attr("width", function (d: any) {
        let container = d3.select(this.element).append("svg");
        container.append('text')
          .attr("x", -99999)
          .attr("y", -99999)
          .text(d.data.tooltip);
        var size = container.node().getBBox();
        container.remove();
        return size.width;
      }.bind(this))
      .attr('height', this.tooltip.height)
      .attr('class', 'tooltip-rect')
      .style('fill-opacity', 1)
      .attr('visibility', 'hidden');

    nodeEnterTooltip.append("text")
      .attr('id', function (d: any) { return 'nodeInfoTextID' + d.id; })
      .attr('x', 128)
      .attr('y', 4)
      .attr('class', 'tooltip-text')
      .attr('visibility', 'hidden')
      .append("tspan")
      .text(function (d: any) { return d.data.tooltip; })

    //ContextMenu group
    nodeEnterContextMenu.append("rect")
      .attr('id', function (d: any) { return 'nodeContextMenuID' + d.id; })
      .attr('x', 120)
      .attr('y', -12)
      .attr('rx', 12)
      .attr("width", 250)
      .attr('height', 200)
      .attr('class', 'context-menu-rect')
      .attr('data-type', 'contextMenu')
      .style('fill-opacity', 1);

    nodeEnterContextMenu.append("text")
      .attr('id', function (d: any) { return 'nodeContextMenuTextID' + d.id; })
      .attr('x', 135)
      .attr('y', 12)
      .attr('class', 'context-menu-title')
      .attr('data-type', 'contextMenu')
      .on("click", this.getSelectedItem.bind(this))
      .style('fill', '#000')
      .text(function (d: any) { return d.data.contextMenu.title; });

    // .append("tspan")
    // .attr('data-type', 'contextMenu')
    // .attr('x', 135)
    // .attr('dy', '1.5em')
    // .text(function (d: any) { return 'Info: ' + d.data.name; });

    nodeEnterContextMenu.append('foreignObject')
      .attr('x', 135)
      .attr('y', 18)
      .attr("width", 220)
      .attr('height', 200)
      .attr('data-type', 'contextMenu')
      .append('xhtml').html(function (d) {
        return '<div class="node-text wordwrap" data-type="contextMenu">'
          + '<div class="divider" data-type="contextMenu"></div>'
          + '<div data-type="contextMenu" class="menu-heading"><b data-type="contextMenu">Attributes</b></div>'
          + '<div data-type="contextMenu" class="menu-content">URL: <span data-type="contextMenu">' + d.data?.value + '</span></div>'
          + '<div data-type="contextMenu" class="menu-sub-content">Link Type:  <span data-type="contextMenu">' + d.data.contextMenu.subContent + '</span></div>'
          + '<div data-type="contextMenu" class="menu-heading"><b data-type="contextMenu">Heading</b></div>'
          + '<div data-type="contextMenu" class="menu-content">className <span data-type="contextMenu">' + d.data.contextMenu.content + '</span></div>'
          + '<div data-type="contextMenu" class="menu-sub-content">Info:  <span data-type="contextMenu">--</span></div>'
          + '</div>';
      })


    // Transition nodes to their new position.
    nodeEnter.transition()
      .duration(this.duration)
      .attr("transform", function (d: any) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);

    // Transition tooltip to their new position.
    nodeEnterTooltip.transition()
      //nodesTooltip.transition()
      .duration(this.duration)
      .attr('transform', function (d: any) { return 'translate(' + d.y + ',' + d.x + ')'; });
    //.style("opacity", 1);

    // Transition context to their new position.
    nodeEnterContextMenu.transition()
      .duration(this.duration)
      .attr('transform', function (d: any) { return 'translate(' + d.y + ',' + d.x + ')'; });

    node.transition()
      .duration(this.duration)
      .attr("transform", function (d: any) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
      .select("rect")
      .style("fill", this.color);

    node.transition()
      .duration(this.duration)
      .attr("transform", function (d: any) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
      .select("text")
      .style("fill", this.fontColor);

    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
      .duration(this.duration)
      .attr("transform", function (d: any) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 0)
      .remove();

    nodeEnterTooltip.exit().transition().duration(this.duration)
      .attr('transform', function (d) { return 'translate(' + source.y + ',' + source.x + ')'; })
      .remove();

    nodeEnterContextMenu.exit().transition().duration(this.duration)
      .attr('transform', function (d) { return 'translate(' + source.y + ',' + source.x + ')'; })
      .remove();


    // Update the links…
    var link = this.svg.selectAll(".linkChart4")
      .data(this.root.links(), function (d: any) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "linkChart4")
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', '1px')
      .attr("d", function (d) {
        var o = { x: source.x0, y: source.y0 };
        return this.customDiagonal(<any>{ source: o, target: o });
      }.bind(this))
      .transition()
      .duration(this.duration)
      .attr("d", this.customDiagonal.bind(this));

    d3.selectAll("path.linkChart4").style("stroke", function (d: any) {
      if (d.target.color) {
        return d.target.color;
      } else {
        return "#ccc";
      }
    })

    d3.selectAll("path.linkChart4").style("stroke-width", function (d: any) {
      if (d.target.strokeWidth) {
        return d.target.strokeWidth;
      } else {
        return "1px";
      }
    })

    // Transition links to their new position.
    link.transition()
      .duration(this.duration)
      .attr("d", this.customDiagonal.bind(this));

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(this.duration)
      .attr("d", function (d) {
        var o = { x: source.x, y: source.y };
        return this.customDiagonal(<any>{ source: o, target: o });
      }.bind(this))
      .remove();

    // Stash the old positions for transition.
    this.root.each(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  color(d) {
    if (d.parent != null) {
      return d._children ? "#fff" : d.children ? "#00BE4F" : "";
    }
    return "#00BE4F";
  }

  fontColor(d) {
    if (d.parent != null) {
      return d._children ? "#000" : d.children ? "#fff" : "";
    }
    return '#fff';
  }

  collapseAllChildren(node) {
    if (node.children) {
      node.children.forEach(function (c) {
        this.collapseAllChildren(c);
      }.bind(this));
      node._children = node.children;
      node.children = null;
    }
  }

  collapseOtherChildren(d) {
    if (d.children) {
      d.children.forEach(function (c) { this.collapseOtherChildren(c) }.bind(this));
      d._children = d.children;
      d.children = null;
    }
  }

  resetRootPath(d) {

    let findRoot = d;
    while (findRoot.parent) {
      findRoot = findRoot.parent;
    }
    this.doResetPath(findRoot);

    let find = d;
    while (find.parent) {
      find.color = "00BE4F";
      find.strokeWidth = '3';
      find = find.parent;
    }
  }

  // Returns a list of all nodes under the root.
  doResetPath(d) {
    if (d.children) {
      d.children.forEach(function (c) { this.doResetPath(c); }.bind(this));
      d.color = undefined;
      d.strokeWidth = undefined;
    }
    d.color = undefined;
    d.strokeWidth = undefined;
  }

  mouseover(d) {

    let tooltip = d3.selectAll(".tooltip-g");
    tooltip.transition()
      .duration(this.duration)
      .attr('transform', function (d: any) { return 'translate(' + d.y + ',' + d.x + ')'; });

    d3.selectAll(".tooltip-g rect").attr('visibility', 'hidden');
    d3.selectAll(".tooltip-g text").attr('visibility', 'hidden');
    d3.select('#nodeInfoID' + d.id).attr('visibility', 'visible');
    d3.select('#nodeInfoTextID' + d.id).attr('visibility', 'visible');

  }

  mousemove(d) {
    let tooltip = d3.selectAll(".tooltip-g");
    tooltip.transition()
      .duration(this.duration)
      .attr('transform', function (d: any) { return 'translate(' + d.y + ',' + d.x + ')'; });

    d3.selectAll(".tooltip-g rect").attr('visibility', 'hidden');
    d3.selectAll(".tooltip-g text").attr('visibility', 'hidden');
    d3.select('#nodeInfoID' + d.id).attr('visibility', 'visible');
    d3.select('#nodeInfoTextID' + d.id).attr('visibility', 'visible');
  }

  mouseout(d) {
    d3.selectAll(".tooltip-g rect").attr('visibility', 'hidden');
    d3.selectAll(".tooltip-g text").attr('visibility', 'hidden');
  }

  mouseup(d) { }

  contextmenu(d) {
    let contextMenu = d3.selectAll(".context-menu-g");
    contextMenu.transition()
      .duration(this.duration)
      .attr('transform', function (d: any) { return 'translate(' + d.y + ',' + d.x + ')'; });

    d3.selectAll(".context-menu-g").style('display', 'none');
    d3.select('#nodeContextMenuGroup' + d.id).style('display', 'block');
    d3.event.preventDefault();
  }
}



