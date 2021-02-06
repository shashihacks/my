
const puppeteer = require('puppeteer');

var express = require('express')
var app = express()
var bodyParser = require('body-parser');
const { getMeta } = require('./meta');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

var count = 0
const ignoreUrls = ['', 'javascript: void(0)', '#']

var URL =""
var imageList
var metaList

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
  await page.goto(URL);
  console.log(URL, "weburl", urlList)

  let hrefs = await page.$$eval('a', as => as.map(a => {
    return{
      // link : a.href,
      // class: a.classList,
      // name: a.textContent,
      // title:a.getAttribute('title'),
      // type: a.getAttribute('type'),
      // media: a.getAttribute('media'),
      "name": a.textContent.trim() + Math.random(1),
      "tooltip": a.href,
      "contextMenu": {
        "title": a.textContent.trim(),
        "content": a.href,
        "subContent": ""
      },
      "value": 100,
      "children":[]
    
    }
  
 
  }));
  urlList = hrefs.slice(0,5)
  hrefs=""
  console.log(urlList)
  await browser.close();

}


async function run(){
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL);
  // get Images
  console.log("getting Images")
  imageList = [...new Set(await page.evaluate(
    () =>Array.from(document.querySelectorAll('img'),
                   a =>  { return {source: a.getAttribute('src'), label: a.getAttribute('alt')}  }   )))];
    console.log(imageList, "list in run")


// Get URLS
    // let hrefs = await page.$$eval('a', as => as.map(a => a.href));
    // hrefs = hrefs.filter(href =>   ignoreUrls.includes(href) || !href.includes(URL)  ? '' : href )
    // urlList = new Set(hrefs)

    // console.log(urlList, "url list")
//     setTimeout(()=>{},1000);
//     let length = urlList.size;
//     console.log(length)
//     for(let url of urlList) {
//         await page.goto(url);
//         let hrefs = await page.$$eval('a', as => as.map(a => a.href));
//         hrefs = hrefs.filter(href =>   ignoreUrls.includes(href) || !href.includes(URL)  ? '' : href )

//         urlList.add(new Set(hrefs))
//         console.log(hrefs, `URL List for ${url}`)
//         setTimeout(()=>{},200);
//     } 
//     console.log("Final list")

//get Metadata


    //Get Audio Files


    //Get Video Content


    



    
    await browser.close();
};



// run()