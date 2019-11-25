let axios = require('axios');
let urllib = require('url');
let cheerio = require('cheerio');
let {fsWrite,fsRead,fsDir} = require('./lcfs')


let httpUrl = "http://www.1kkk.com/manhua40946/";
let hostUrl = "http://www.1kkk.com/"

async function getPageData() {
   let pageHtml =  await axios.get(httpUrl);
   $ = cheerio.load(pageHtml.data,{decodeEntities: false});
   let tempc = $('a.block').each(async(item,i)=>{
    //    let chapterList = await getChaptersList(item);
    getMhImages('http://www.1kkk.com/ch39-924334/');
        // console.log(i.children[0].data);
        // chapterList = JSON.stringify(chapterList, null, 2);
        // console.log(chapterList);
   });
    //    let text = $(item).parent().html();

async function getChaptersList(index){
    let pageHtml = await axios.get(httpUrl);
    $ = cheerio.load(pageHtml.data,{decodeEntities: false});
    //拿到连载和番外等列表的长度
    let Chapter = $('.detail-list-select');
    
    let chapterList = [];
    //根据列表分类循环拿到分类下的li数据 
    $('.detail-list-select').eq(index).find('li a').each((item,i)=> {
        
        let chapterUrl =$(i).attr('href');
        //获取text文本数据但不包括子元素的文本
        let chapterNumber = $(i).children()[0].prev.data;
        let totalPage = $(i).find('span').text();
        chapterUrl = urllib.resolve(hostUrl,chapterUrl);
        let obj ={
            url: chapterUrl,
            chapter:chapterNumber,
            pages:totalPage
            

        };
        chapterList.push(obj);
    })
    getMhImages(obj.url)
    // return chapterList;
  }

async function getMhImages(url){
    let pageHtml = await axios.get(url);
    $ = cheerio.load(pageHtml.data,{decodeEntities: false});
    let chapterImgList = [];
    $('.chapterpager').find('a').each((item,i)=>{
        let chapterUrl =$(i).attr('href');
        chapterUrl = urllib.resolve(hostUrl,chapterUrl);
        let chapterImg = $('#cp_img').children();
        let obj ={
            url: chapterUrl,
            img:chapterImg
        }; 

        // console.log(chapterUrl);
        console.log(chapterImg);
    })
 }

}
getPageData();