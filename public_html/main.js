/* global google, math */

import {
    drawColChart
} from "./charts.js";

google.charts.load('current', {'packages':['corechart'], 'language':'ru'});


// --------------line chart-----------------

const T = 250;
const Y_MIN = -Math.round(3 * Math.sqrt(T));
const Y_MAX = Math.round(3 * Math.sqrt(T));
const T_STEP = 1;
const T_DELAY = 1;

google.charts.setOnLoadCallback(initLine);

function initLine() {

    var options = {
        
        title: 'Dynamic line chart',
        
        hAxis: {    
            title: 'x',
            viewWindow: { max: 0, min: T}
        },

        vAxis: {
          title: 'y',
          viewWindow: { max: Y_MAX, min: Y_MIN}
        },

        backgroundColor: '#ffffff',
        width: 900,
        height: 500,
        
        animation: {
            duration: T_STEP
        },
        
        chartArea: { width: 800 },

        legend: {position: 'none'}
        
    };

    let lineBut = document.getElementById("lineButton");
    var chart = new google.visualization.AreaChart(document.getElementById('line'));

    function draw() {
        
        lineBut.disabled = true;
        
        let d = [[0, 0]];
        for (let i = 1; i <= T; i++) {
            let r = [i, d[i - 1][1] + Math.sign(Math.random()-0.5)];
            d.push(r);
        }
        
        let data = new google.visualization.DataTable();
        data.addColumn('number', 'x');
        data.addColumn('number', 'y');
        data.addRows([d[0]]);
        
        function go(i=1) {
            data.addRows([d[i++]]);
            data.addRows([d[i++]]);
            data.addRows([d[i++]]);
            data.addRows([d[i++]]);
            data.addRows([d[i++]]);
            chart.draw(data, options);
            setTimeout(function() {    
                if (i - 1 <= T - 5) go(i);
                else lineBut.disabled = false;
            }, T_DELAY);
        }

        go();
        
    }
    
    draw();
    
    lineBut.addEventListener("click", draw);

}
 
// ---------------histogram--------------------

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

google.charts.setOnLoadCallback(initHist);

function initHist() {
    
    let options = {
        
        title: 'Histogram',
        legend: { position: 'none' },
        width: 900,
        height: 500,

        chartArea: { width: 800 },

        bar: { gap: 0 },

        hAxis: {
            ticks: [-100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        },

        histogram: {
            bucketSize: 5,
            hideBucketItems: true
        }

    };
    
    let chart = new google.visualization.Histogram(document.getElementById('hist'));
        
    function draw() {
        let data = new google.visualization.DataTable();
        data.addColumn('number', 'y');
        data.addRows(rnorm(1000, 10, 20));
        chart.draw(data, options);
    }
    
    draw();
    
    let histBut = document.getElementById("histButton");
    histBut.addEventListener("click", draw);
    
}


// ---------------column chart---------------

google.charts.setOnLoadCallback(initCol);

function initCol() {
    
    let options = {
        
        title: 'Column chart',
        legend: { position: 'none' },
        width: 900,
        height: 500,
        
        chartArea: { width: 800 },
        
        animation: {
            duration: 300,
            startup: true
        },
        
        bar: { 
           groupWidth: '100%'
        },
        
        hAxis: {
            baselineColor: 'none'
        }
        
    };
    
    let chart = new google.visualization.ColumnChart(document.getElementById('col'));

    function draw() {
        let data = [];
        for (let i = -50; i <= 50; i++) {
            let d = math.random(50);
            data.push([i, d, d + ' in ' + i]);
        }
        let dataTable = new google.visualization.DataTable();
        dataTable.addColumn('number', 'x');
        dataTable.addColumn('number', 'y');
        dataTable.addColumn({type: 'string', role: 'tooltip'});
        dataTable.addRows(data);
        chart.draw(dataTable, options);
    }

    draw();

    let colBut = document.getElementById("colButton");
    colBut.addEventListener("click", draw);
        
}
    

// ---------------column chart 2---------------

function draw() {
    let data = [];
    for (let i = -50; i <= 50; i++) {
        let d = math.random(50);
        data.push([i, d, d + ' in ' + i]);
    }
    drawColChart(document.getElementById('col2'), data);
}

draw();

let col2But = document.getElementById("col2Button");
col2But.addEventListener("click", draw);

