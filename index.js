
const puppeteer = require('puppeteer');

var express = require('express')
var app = express()
var bodyParser = require('body-parser');
const { getMeta } = require('./meta');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


const ignoreUrls = ['', 'javascript: void(0)', '#']

var URL =""
var urlList = new Set()
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
  await fetchURLS()
  console.log("after fetch urls", urlList)
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
  // console.log(metaList)
  // const robots = await page.evaluate(() => document.querySelectorAll("head > meta[name='robots']")[0].content);
  // // const description = await page.evaluate(() => document.querySelectorAll("head > meta[itemprop='description']")[0].content);
  // // const description = await page.evaluate(() => document.querySelectorAll("head > meta[itemprop='image']")[0].content);
  // const pageType = await page.evaluate(() => document.querySelectorAll("head > meta[property='pageType']")[0].content);
  // const subpageType = await page.evaluate(() => document.querySelectorAll("head > meta[property='subpageType']")[0].content);
  // const ogType = await page.evaluate(() => document.querySelectorAll("head > meta[property='og:type']")[0].content);
  // const ogDescription = await page.evaluate(() => document.querySelectorAll("head > meta[property='og:description']")[0].content);
  // const ogSitename = await page.evaluate(() => document.querySelectorAll("head > meta[property='og:site_name']")[0].content);
  // const ogImage = await page.evaluate(() => document.querySelectorAll("head > meta[property='og:image']")[0].content);
  // const ogTitle = await page.evaluate(() => document.querySelectorAll("head > meta[property='og:title']")[0].content);

// metaList = {
//   description,
//   robots,
//   subpageType,
//   pageType,
//   ogType,
//   ogDescription,
//   ogSitename,
//   ogImage,
//   ogTitle

// }


//   console.table({
//     description,
//     robots,
//     subpageType,
//     pageType
//   })
  // metaList = grupos
  await browser.close();

  // console.log(links, "links")
}
async function fetchURLS() {
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  console.log(URL, "weburl")
  let hrefs = await page.$$eval('a', as => as.map(a => 
    {
      return {
        "hrefs" :  a.href, 
        "label" : a.getAttribute('aria-label')
      }

    }));
  // hrefs = hrefs.filter(href =>   ignoreUrls.includes(href) || !href.includes(URL)  ? '' : href )
  urlList = [...new Set(hrefs)]
  console.log(urlList, "links and labels")

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
    // setTimeout(()=>{},1000);
    // let length = urlList.size;
    // console.log(length)
    // for(let url of urlList) {
    //     await page.goto(url);
    //     let hrefs = await page.$$eval('a', as => as.map(a => a.href));
    //     hrefs = hrefs.filter(href =>   ignoreUrls.includes(href) || !href.includes(URL)  ? '' : href )

    //     urlList.add(new Set(hrefs))
    //     console.log(hrefs, `URL List for ${url}`)
    //     setTimeout(()=>{},200);
    // } 
    // console.log("Final list")

//get Metadata


    //Get Audio Files


    //Get Video Content


    



    
    await browser.close();
};



// run()