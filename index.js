let fs = require('fs');
let os = require('os');

var data = {
    "name":"elise",
    "age": 23,
    "sex": "男"
};

function writeFs(path,data){
    return new Promise((resolve,reject) =>{
        data = JSON.stringify(data);
        fs.writeFile(path,data,{flag:'a',encoding:'utf-8'},(err) =>{
            if(err){
                reject(err);
            }else{
                resolve(data);
                console.log("文件添加成功");
                
            }
        })
    })
}

async function writeFsList(){
    await writeFs("./text.json",data);
}
// writeFsList();

// fs.writeFile('./text.txt',data,{flag:'a',encoding:'utf-8'},(err) =>{
//     if(err)
//     throw err;
//     console.log(data);
//     console.log("文件添加成功");
// })

// fs.readFile('./text.json',(err,data) =>{
//     if(err){
//         console.log(err);
//     }
//     console.log(data.toString());
// })

// console.log(os);
// console.log(os.cpus());
console.log(os.hostname());
console.log(os.freemem());