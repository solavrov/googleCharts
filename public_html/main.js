/* global google, math */

import {
    runif,
    rnorm,
    makeHistogramData
} from "./funs.js";

import {
    drawColChart
} from "./charts.js";

google.charts.load('current', {'packages':['corechart'], 'language':'ru'});


// --------------line chart-----------------

const T = 250;
const Y_MIN_START = -Math.round(1 * Math.sqrt(T));
const Y_MAX_START = Math.round(1 * Math.sqrt(T));
//const T_STEP = 1;
const T_DELAY = 20;

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
          viewWindow: { max: Y_MAX_START, min: Y_MIN_START}
        },
        
        series: {
            1: { color: 'blue' }
        },

        backgroundColor: '#ffffff',
        width: 900,
        height: 500,
        
//        animation: {
//            duration: T_STEP
//        },
        
        chartArea: {width: 800},

        legend: {position: 'none'}
        
    };
    
    let lineBut = document.getElementById("lineButton");
    var chart = new google.visualization.LineChart(document.getElementById('line'));

    function draw() {
        
        lineBut.disabled = true;
        
        let y_max =  Y_MAX_START;
        let y_min =  Y_MIN_START;
        options.vAxis.viewWindow.max = y_max;
        options.vAxis.viewWindow.min = y_min;
        
        let d = [
            [0, null, null, 0],
            [250, null, null, 10],
            [0, 0, 'color: green', null]
        ];
        let k = d.length;
        for (let i = k; i < T + k; i++) {
            let p = d[i - 1][1] + Math.sign(Math.random()-0.5) + 1/25;
            if (p > 0) d.push([i - k + 1, p, 'color: green', null]);
            if (p < 0) d.push([i - k + 1, p, 'color: red', null]);
            if (p === 0) d.push([i - k + 1, p, d[i - 1][2], null]);
        }
        
        let data = new google.visualization.DataTable();
        data.addColumn('number', 'x');
        data.addColumn('number', 'y');
        data.addColumn({type: 'string', role: 'style'});
        data.addColumn('number', 'y2');
        data.addRows([d[0]]);
        
        function go(i=1) {
            for (let k = 0; k < 5; k++) {
                if (d[i][1] > y_max) {
                    options.vAxis.viewWindow.max = y_max = d[i][1]; 
                }
                if (d[i][1] < y_min) {
                    options.vAxis.viewWindow.min = y_min = d[i][1];
                }
                data.addRows([d[i++]]);
            }
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
        let data = makeHistogramData(rnorm(1000, 0, 50), -100, 100, 5);     
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
    let data = makeHistogramData(rnorm(1000, 0, 50), -100, 100, 5);
    drawColChart(document.getElementById('col2'), data);
}

draw();

let col2But = document.getElementById("col2Button");
col2But.addEventListener("click", draw);

