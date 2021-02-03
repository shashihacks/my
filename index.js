
const puppeteer = require('puppeteer');
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


const ignoreUrls = ['', 'javascript: void(0)', '#']

var URL =""
var urlList = new Set()
var imageList


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
  const { url } = req.body;
console.log(url, "rec oved")
URL = url
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



async function run(){
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(URL);
//   get Images
  // console.log("getting Images")
  // imageList = [...new Set(await page.evaluate(
  //   () =>Array.from(document.querySelectorAll('img'),
  //                  a => a.getAttribute('src'))))];
  //   console.log(imageList, "list in run")


//Get URLS
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
    // console.log(urlList)

//get Metadata


    //Get Audio Files


    //Get Video Content


    



    
    await browser.close();
};



// run()