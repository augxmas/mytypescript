"use strict";
exports.__esModule = true;
var fs = require("fs");
var file = fs.readFileSync("C:\\eclipse\\workspace\\ts\\functions\\src\\sample.log");
console.log("hello");
console.log(file.length);
//const str:string = file.toString();
var arr = file.toString().replace(/\r\n/g, '\n').split('\n');
for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
    var i = arr_1[_i];
    //console.log(i);
    var str = i.toString().replace(/\r\n/g, '\n').split('|');
    //for(let j of str){
    console.log(str[0]);
    //}
}
