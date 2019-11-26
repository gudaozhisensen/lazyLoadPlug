let axios = require('axios');
let urllib = require('url');
let cheerio = require('cheerio');
const fs = require('fs')
let {fsWrite,fsRead,fsDir} = require('./lcfs')


let httpUrl = "http://www.1kkk.com/manhua40946/";
let hostUrl = "http://www.1kkk.com/"

async function getPageData() {
   let pageHtml =  await axios.get(httpUrl);
   $ = cheerio.load(pageHtml.data,{decodeEntities: false});
   let tempc = $('a.block').each(async(item,i)=>{
       let chapterList = await getChaptersList(item);
        // console.log(i.children[0].data);
        // chapterList = JSON.stringify(chapterList, null, 2);
        // console.log(chapterList);
   });

async function getChaptersList(index){
    let pageHtml = await axios.get(httpUrl);
    $ = cheerio.load(pageHtml.data,{decodeEntities: false});
    
    let chapterList = [];
    //拿到连载和番外等列表的长度
    //根据列表分类循环拿到分类下的li数据 
    let num =1
    let length = $('.detail-list-select').eq(index).find('li a').length;

    $('.detail-list-select').eq(index).find('li a').each(async(item,i)=> {
         
        let chapterUrl =$(i).attr('href');
        //获取text文本数据但不包括子元素的文本
        let chapterNumber = $(i).children()[0].prev.data;
        let totalPage = $(i).find('span').text();
        chapterUrl = urllib.resolve(hostUrl,chapterUrl);
       
        let mhImages = await getMhImages('http://www.1kkk.com/ch39-924334/#ipg1');
        mhImages = JSON.stringify(mhImages, null, 2);
        let obj ={
            url: chapterUrl,
            chapter:chapterNumber,
            pages:totalPage,
            images:mhImages
        };
        
        // console.log(chapterUrl);
        // console.log(mhImages);
        chapterList.push(obj);
        num++;
        

        if(num==length){
            // console.log(chapterList);
        }
       
    })
    return chapterList;
  }

//获得图片
async function getMhImages(url){
    let pageHtml = await axios.get(url);
    $ = cheerio.load(pageHtml.data,{decodeEntities: false});
    // 网站图片的匹配语句
    let reg = eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('n 5(){2 6=4;2 8=\'9\';2 7="o://l-m-r-s-p.q.k/c/a/4";2 3=["/b.1","/h.1","/f.1","/g.1","/j.1","/e.1","/t.1","/C.1","/D.1","/B.1","/E.1","/H.1","/F.1","/G.1","/w.1","/v.1","/u.1"];x(2 i=0;i<3.A;i++){3[i]=7+3[i]+\'?6=4&8=9&z=\'}y 3}2 d;d=5();',44,44,'|jpg|var|pvalue|924334|dm5imagefun|cid|pix|key|b01190031112f8ad59b981fc0de491e5|40946|2_9946|41||7_7881|4_5610|5_2428|3_6594||6_4891|com|manhua1033|61|function|http|98|cdndm5|174|50|8_9302|18_9454|17_5056|16_8579|for|return|uk|length|11_1409|9_6895|10_6442|12_1096|14_9080|15_7352|13_4637'.split('|'),0,{}))
    // console.log(reg);

    let chapterImgList = [];
    // 页码
   let length = $('.chapterpager').eq(0).find('a').last().text();
//    console.log(length);
   for(let i=1;i<=length;i++){
        let chapterUrl ='/ch39-924334-p'+i+'/';
        chapterUrl = urllib.resolve(hostUrl,chapterUrl);
        let chapterImgUrl = reg[i-2];
        imagesName = 'ch39-924334-p'+i;
        let obj ={
            url: chapterUrl,
            img:chapterImgUrl,
            name:imagesName
        };
        chapterImgList.push(obj);
        // downLoad(chapterImgUrl,imagesName);
        console.log(chapterImgUrl);
        console.log(imagesName);
        }
       
        
   
    // return chapterImgList;
 }

async function downLoad(chapterImgUrl,imagesName){
    axios.get(chapterImgUrl, {responseType:'stream'}).then(function(res){
        let ws = fs.createWriteStream('./comics/'+imagesName+".jpg");
        res.data.pipe(ws)      
    });
}

}
getPageData();