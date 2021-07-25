//#!/usr/bin/env node
let inputArr=process.argv.slice(2);
let fs=require("fs");
const { dir } = require("node:console");
let path = require("path");
//console.log(inputArr);


let command=inputArr[0];
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}
switch(command){
    case "tree":
        treefn(inputArr[1]);
        break;
    case "organize":
        organizefn(inputArr[1]);
        break;
    case "help":
        helpfn();
        break;
    default:
        console.log("please input right command");
        break;
}

function treefn(dirpath){
    let destpath;
    if(dirpath==undefined){
      
        treeHelper(  process.cwd(),"");
        return;
    }else{
        let doesExist=fs.existsSync(dirpath);
        if(doesExist){
           treeHelper(dirpath,"");
           }
        else{
            console.log("kindly enter thr path");
            return;
        }
    }
}
function treeHelper(dirpath,indent){
   let isfile= fs.lstatSync(dirpath).isFile();
    if(isfile == true) {
       let fileName= path.basename(dirpath);
       console.log(indent+"|----"+fileName);
    }
    else{
        let dirName=path.basename(dirpath)
        console.log(indent+"|____"+dirName);
        let childrens=fs.readdirSync(dirpath);
        for(let i=0;i<childrens.length;i++){
            let childpath=path.join(dirpath,childrens[i]);
            treeHelper(childpath,indent+"\t");
        }
    }
}




function organizefn(dirpath){
    //console.log("organize command implemented for ",dirpath);
    let destpath;
     if(dirpath==undefined){
         destPath=process.cwd();
         return;
     }else{
         let doesExist=fs.existsSync(dirpath);
         if(doesExist){
            destPath= path.join(dirpath,"organized_files");
            if(fs.existsSync(destPath)==false){
                fs.mkdirSync(destPath);

            }


         }
         else{
             console.log("kindly enter thr path");
             return;
         }
     }

 
organizedHelper(dirpath,destPath);

}
function organizedHelper(src,dest){
    let childNames=fs.readdirSync(src);
    for(let i=0;i<childNames.length;i++){
        let childAddress=path.join(src,childNames[i]);
        let isfile=fs.lstatSync(childAddress).isfile();
        if(isfile){
            //console.log(childNames[i]);
            let category=getCategory(childNames[i]);
            console.log(childNames[i],"belongs to--->",category);
        }
    }

}
function sendFiles(srcfilepath,dest,category){
    let categoryPath=path.join(dest,category);
    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
   let fileName=path.basename(srcfilepath);
   let destfilePath=path.join(categoryPath,fileName);
   fs.copyFileSync(srcfilepath,destfilePath);
   fs.unlinkSync(srcfilepath);





}
function getCategory(name){
    let ext=path.extname(name);
    ext=ext.slice(1);
    for(let type in types){
        let cTypearray=types[type];
        for(let i=0;i<cTypearray.length;i++){
            if(ext==cTypearray[i]){
                return type;
            }
        }
    }
    return "others";
}
function helpfn(){
    console.log(`
    list of all the commands:
            node main.js tree "directorypath"
            node main.js organize "directorypath"
            node main.js help
    `);
}