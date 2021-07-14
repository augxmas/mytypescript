/*
function logName(name:string){
    console.log(name);
}

logName('Jack');
*/

let i = 5;

let student = {
    name: 'Jake',
    course: 'Getting started with TypeScript',
    codingIQ: 80,
    code : function(){
        console.log('brain is working hard')
    }
}


class Person{
    private name:string;
    age:number;
    static BLOOD_TYPE:number = 1;
    public constructor(name,age){
        this.name = name;
        this.age = age;
    }
}

class Employee extends Person{
    department:string;
    role:string;
}

console.log(Person.BLOOD_TYPE);

