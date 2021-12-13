/* global math */

export {
    runif,
    rnorm,
    makeHistData
}

function runif(n) {
    let r = [];
    for (let i = 0; i < n; i++) {
        let x = 0;
        while(x === 0) x = Math.random();
        r.push(x);
    }
    return r;
}

function rnorm(n, m=0, sd=1) {
    let u, v;    
    u = runif(n);
    v = runif(n);
    let x = math.sqrt(math.multiply(-2, math.log(u)));
    let y = math.cos(math.multiply(2 * Math.PI, v));
    let sample = math.add(math.multiply(sd, math.dotMultiply(x, y)), m);
    return math.transpose([sample]);
}

function makeHistData(array, min_val, max_val, step) {    
    let b = [];
    for (let v = min_val; v <= max_val; v += step) b.push(v);
    let arr = array.slice(0);
    let hist = [];
    for (let j = 0; j < b.length; j++) {
        let n = arr.filter(e => e < b[j]).length;
        let row;
        if (j === 0) row = [b[0], n, n + " outcomes < " + b[0]];
        else row = [b[j], n, n + " outcomes in [" + b[j-1] + ", " + b[j] + ")"];
        hist.push(row);
        arr = arr.filter(e => e >= b[j]);
    }
    hist.push([b[b.length - 1] + step, arr.length, arr.length + " outcomes >= " + b[b.length - 1]]);
    return hist;
}



