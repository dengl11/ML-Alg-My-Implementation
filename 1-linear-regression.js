var Model = {
    a: Math.random(),
    b: Math.random(),
    c: Math.random(),
};

var _TrueModel = {
    a: 1,
    b: 2,
    c: 3
};

const eta = 1e-1
const nClient = 1000

var map = (point) => {
    //point: [x, y] - y: groud truth
    var [x, y] = point;
    var ybar = Model.a * (x ** 2) + Model.b * x + Model.c;
    var diff = 2 * (ybar - y);
    //console.log(diff);
    var gradient = [(x**2)*diff, x * diff, diff];
    return [Math.abs(diff), gradient];
};


var reduce = (key, gradients) => {
   //gradients:  [[da, db, dc], ...]
    var avg = [...Array(gradients[0].length)];
    avg = avg.map(x=>0);
    var n = gradients.length;
    for (var i in gradients) {
        var gradient = gradients[i];
        for (var j in gradient) {
            avg[j] += gradient[j]/n;
        }
    }
    //console.log(avg);
    return avg;
};

var gd_generater = ()=>{
    var x = Math.random();
    var [a, b, c] = [_TrueModel.a, _TrueModel.b, _TrueModel.c];
    var y = a * x ** 2 + b * x + c;
    return [x, y];
};


for (var i = 1; i <= 1000; i ++) {
    var totalCost = 0;
    var gradients = [];
    for (var c = 1; c <= nClient; c ++) {
        var point = gd_generater();
        var mapResult = map(point);
        totalCost += mapResult[0];
        gradients.push(mapResult[1]);
    }
    totalCost /= nClient;
    if (i % 100 == 0) {
        console.log(`Iter ${i}: Cost = ${totalCost.toFixed(4)}`);
    }
    var globalGradient = reduce(null, gradients);
    var [da, db, dc] = globalGradient;
    Model.a -= da * eta;
    Model.b -= db * eta;
    Model.c -= dc * eta; 
}

console.log(Model);
