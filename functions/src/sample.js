/*
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
//*/
console.log('hello world');
var fileName = "com_0001-24:0A:C4:22:34:FA-20210823222626-GMT+09:00.log";
var _arr = fileName.toString().replace(/\r\n/g, '\n').split('\-');
console.log(_arr[0]);
console.log(_arr[1]);
console.log(_arr[2]);
console.log(_arr[3]);
for (var _i = 0, _arr_1 = _arr; _i < _arr_1.length; _i++) {
    var i = _arr_1[_i];
    //  console.log(i);
}
