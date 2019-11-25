let axios = require('axios');
let https = require('https');
let urllib = require('url');
let cheerio = require('cheerio');
let {fsWrite,fsRead,fsDir} = require('./lcfs')
// let request = require('request')

let httpUrl = "http://www.1kkk.com/manhua-list/";
let hostUrl = "http://www.1kkk.com/"
// console.log(axios);

function getHttps(url){
    return new Promise((resolve, reject)=> {
        axios.get(url,{
            headers: {
                "upgrade-insecure-requests": 1,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
            }
        }).then((res)=>{
            resolve(res);
            reject(res);
        })
    })
}

//获取起始页面的所有分类地址
async function getData(){
    let getRes = await axios.get(httpUrl);
    let getData = getRes.data;

    let navList = [];
    $ = cheerio.load(getData,{decodeEntities: false});
     $('#tags dd').each(async function(i, item){
        // 获得各个分类的url，并格式化url，加上协议和主机名
        let navTabUrl = item.children[0].attribs.href;
        navTabUrl = urllib.resolve(hostUrl,navTabUrl);
        let type = $(this).text();

            let obj = {
                url: navTabUrl,
                type
        }
        //压入数组
        navList.push(obj);
        
        // console.log(obj.url);
       
        //创建文件
        // await fsDir('./comics/'+type);
        let page = await getPage(obj.url, getData);
        console.log("obj.type:",obj.type);
        console.log("page:",page);
        getDetail(obj.url, obj.type);
    });
}

//通过分类,获得页面中的的漫画链接
async function getDetail(url, mhType){
    // console.log(url);
    let getRes = await axios.get(url);
    let getData = getRes.data;
    console.log(url);
    $ = cheerio.load(getData, {decodeEntities: false});
    var list = $('.mh-list li').html();
    // console.log(list);
    // 获得漫画链接代码
    await $('.mh-list li a').each(function(item,i){
        //   let mhItem= $(this).parent().html();
          let mhItem= $(this).html();
          let mhList = [];
            console.log(mhItem);
            // getMhInfo(mhItem,mhType);
        });
}

//通过漫画链接,获得具体的漫画信息
async function getMhInfo(data,type){
    $ = cheerio.load(data, {decodeEntities: false});

    var mhImg = $('p.mh-cover').attr("style");
   let mhDetail = $('.mh-item-detali h2').html();
   let mhUrl = $('a',mhDetail).attr("href");
   let mhTitle = $('a',mhDetail).attr("title");
   let leastData = $('.chapter').find('a').attr("title");
    mhUrl = urllib.resolve(hostUrl,mhUrl);
    let mhData = {
        mhImg, 
        mhUrl,
        mhTitle,
        leastData
    }
3
    let arrMhData = JSON.stringify(mhData, null, 2);
    fsWrite('./comics/'+type+"/"+mhTitle+".json",arrMhData);
}


// 获得分页url
async function getPage(url,data){
    // console.log(url);
    let getRes = await axios.get(url);
    
    $ = cheerio.load(getRes.data, {decodeEntities: false});
   let pageLength = $('.page-pagination ul li','header').length;
   if(pageLength == 0){
       return pageLength;
   }else{
       ;
        return pageLength-1;
   }
        // let pageUrl = $(item).attr('href');
        // pageUrl = urllib.resolve(hostUrl,pageUrl);
        // console.log(pageLength);
        
    // })
}

getData();