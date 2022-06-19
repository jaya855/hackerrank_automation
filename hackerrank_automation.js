//npm install minimist
//npm install puppeteer
//node hackerrank_automation.js --url="https://www.hackerrank.com" --config=config.json

let minimist=require("minimist");
let args=minimist(process.argv);
let fs=require("fs");
let puppeteer=require("puppeteer");

let jsonfile=fs.readFileSync(args.config,"utf-8");
let JSO=JSON.parse(jsonfile);

async function run(){
let browser=await puppeteer.launch({

    headless:false,
    args:['--start-maximized'],
    defaultViewport:null

});
let pages=await browser.pages();
let page=pages[0];

await page.goto(args.url);

await page.waitForSelector("a[data-event-action='Login']");
await page.click("a[data-event-action='Login']");

await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
await page.click("a[href='https://www.hackerrank.com/login']");
         
await page.waitForSelector("input[name='username']");
await page.type("input[name='username']",JSO.id, {delay:50});


await page.waitForSelector("input[name='password']");
await page.type("input[name='password']",JSO.password, {delay:50});


await page.waitForSelector("button[data-analytics='LoginPassword']");
await page.click("button[data-analytics='LoginPassword']");

await page.waitForSelector("a[data-analytics='NavBarContests']");
await page.click("a[data-analytics='NavBarContests']");
  


await page.waitForSelector("a[href='/administration/contests/']");

await page.click("a[href='/administration/contests/']");




await page.waitForSelector("a[data-attr1='Last']");
 let numpages=await page.$eval("a[data-attr1='Last']",function(lasttag){
   let numpages=lasttag.getAttribute("data-page");
   return parseInt(numpages);
});


for(let i=0;i<numpages;i++){
  await  handlepage(browser,page);
   
}

await browser.close();
console.log("browser closed");
}

run();



async function handlepage(browser,page){
    await page.waitForSelector("a.backbone.block-center");
   let curls= await page.$$eval("a.backbone.block-center",function(atags){
        let urls=[];
for(let i=0;i<atags.length;i++){
    let url=atags[i].getAttribute("href");
urls.push(url);
}
return urls;
    });
    for(let i=0;i<curls.length;i++){

    await handlecontest(browser,page,curls[i]);

    }

    await page.waitFor(1500);
    await page.waitForSelector("a[data-attr1='Right']");
    await page.click("a[data-attr1='Right']");

}

 async function handlecontest(browser,page,curl){
 let npage=await browser.newPage();
 await npage.goto(args.url+curl);
 await npage.waitFor(2000);


 await npage.waitForSelector("li[data-tab='moderators']");
 await npage.click("li[data-tab='moderators']");

await npage.waitForSelector("input#moderator");
await npage.type("input#moderator",JSO.moderator, {delay:50});

await npage.keyboard.press("Enter");


 await npage.waitFor(2000);

 await npage.close();
 await page.waitFor(2000);

 }

