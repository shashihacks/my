
const puppeteer = require('puppeteer');

var express = require('express')
var app = express()
var bodyParser = require('body-parser');
// const { getMeta } = require('./meta');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

var count = 0
const ignoreUrls = ['', 'javascript: void(0)', '#']

var URL =""
var imageList
var metaList
var audioList

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  next();
  });


app.get('/', function (req, res) {
  res.send('Hello World')
 
})

app.post('/url',(async (req, res)=> {
  const { url, type } = req.body;

  URL = url
  console.log(type, "type")
if(type=='sitemap') {
  console.log("sitemap requested")
  urlList=[]
  await fetchURLS()
  return res.status(200).json( urlList )

}
if(type=='audio') {
  console.log("audio content requested on" , URL)
  await fetchAudioContent()
  return res.status(200).json( audioList)
}

if(type=='meta') {
  console.log("meta info requested")
  await fetchMetaTags()
  return res.status(200).json( metaList )

}


  if(url) {
    console.log('Got body:', req.body);
    await run()
    // console.log(imageList, "list")
    return res.status(200).json( imageList );


  }
}))
 



app.listen(3000, ()=> {
  console.log("server running on 3000")
})


async function fetchAudioContent() {
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL, {waitUntil: 'load', timeout: 0});
  console.log(URL, "aduio fetch url")
  let audioLinks = await page.$$eval('audio', as => as.map(a => {

    return {
      source: a.getAttribute('src'),
      preload: a.getAttribute('preload') ?  a.getAttribute('preload') :  'unspecified',
      className: a.getAttribute('class') ?  a.getAttribute('class') : a.getAttribute('id') ? a.getAttribute('id') : 'Unknown identifier',
      type: a.getAttribute('type') ? a.getAttribute('type') : 'Unspecified Type'
    }
  }))

  audioList = audioLinks;
  console.log("fetched audio content")
  console.log(audioList)
  await browser.close();


}

async function fetchMetaTags() {
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL, {waitUntil: 'networkidle0'});
   metaList = await page.evaluateHandle(() => {
    return Array.from(document.getElementsByTagName('meta')).map(a => {
      return { 
        name:a.name ? a.name : '',
        content:a.content,
      }
    } );
  });
  console.log(await metaList.jsonValue());  
  metaList = await metaList.jsonValue()

  await browser.close();

}
var urlList = []

async function fetchURLS() {
  urlList=[]

  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL, {waitUntil: 'load', timeout: 0});
  console.log(URL, "weburl", urlList)

  let hrefs = await page.$$eval('a', as => as.map(a => {
    return{
      "name":  (Math.floor(Math.random() * (1000 - 0+ 1)) + 0).toString() +". " + a.textContent.trim(),
      "tooltip": a.href,
      "contextMenu": {
        "title": a.textContent.trim(),
        "content": a.getAttribute('id') || a.getAttribute('class') || 'No Identifier',
        "subContent": a.getAttribute('type') || 'text/html'
      },
      "value": a.href,
      "children":[]
    
    }
  
 
  }));
  urlList = hrefs.slice(0,10)
  hrefs=""
  console.log(urlList)
  await browser.close();

}


async function run(){
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL, {waitUntil: 'load', timeout: 0});
  // get Images
  console.log("getting Images")
  imageList = [...new Set(await page.evaluate(
    () =>Array.from(document.querySelectorAll('img'),
                   a =>  { return {source: a.getAttribute('src'), label: a.getAttribute('alt')}  }   )))];
    console.log(imageList, "list in run")
    await browser.close();
};



// run()