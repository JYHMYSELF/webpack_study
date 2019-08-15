let str = require('./a.js')
require('./index.css')
require('./index.less')
console.log(str)
let fn = () => {
    console.log('=> 函数')
}
fn();

@log
class A {
    a =1;
}
let a = new A();
console.log(a.a);

function log(target) {
    console.log(target)
}
