import * as fs from 'fs';

const file = fs.readFileSync("C:\\eclipse\\workspace\\ts\\functions\\src\\sample.log");
console.log("hello");
console.log(file.length);
//const str:string = file.toString();
const arr = file.toString().replace(/\r\n/g,'\n').split('\n');

 for(let i of arr) {
     //console.log(i);
     const str  = i.toString().replace(/\r\n/g,'\n').split('|');
     //for(let j of str){
        console.log(str[0]);
     //}
 }


