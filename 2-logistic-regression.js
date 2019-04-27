var Model = {
    a: Math.random(),
    b: Math.random(),
};

var _TrueModel = {
    a: 1,
    b: -2,
};

const eta = 1e-3;
const nClient = 1000

var logistic = (x) => {
    return 1/(1 + Math.exp(-x))
}

var logistic_gradient = (x) => {
    var f = logistic(x);
    return f * (1 - f);
}

var map = (point) => {
    //point: [x, y] - y: groud truth
    var [x, y] = point;
    var ybar = Model.a * x  + Model.b;
    //reference: http://cs229.stanford.edu/notes/cs229-notes1.pdf
    //console.log(logistic(ybar));
    var correct = logistic(ybar) > 0.5 ? (y == 1) : (y == 0);
    var diff = (y - logistic(ybar));
    var gradient = [x*diff, diff];
    return [correct, gradient];
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
    return avg;
};

var gd_generater = ()=>{
    var x = 2 * (Math.random() - 0.5);
    var [a, b] = [_TrueModel.a, _TrueModel.b];
    var y = a * x + b;
    if (Math.random() < logistic(y)) {
        y = 1;
    } else {
        y = 0;
    }
    return [x, y];
};


for (var i = 1; i <= 100000; i ++) {
    var totalCorrect = 0;
    var gradients = [];
    for (var c = 1; c <= nClient; c ++) {
        var point = gd_generater();
        var mapResult = map(point);
        totalCorrect += mapResult[0];
        gradients.push(mapResult[1]);
    }
    totalCorrect /= nClient;
    if (i % 1000 == 0) {
        console.log(`Iter ${i}: Accuracy = ${totalCorrect.toFixed(4)}`);
    }
    var globalGradient = reduce(null, gradients);
    var [da, db] = globalGradient;
    Model.a += da * eta;
    Model.b += db * eta;
}

console.log(Model);
