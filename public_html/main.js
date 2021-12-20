/* global google, math */

import {
    runif,
    rnorm,
    makeHistogramData
} from "./funs.js";

import {
    drawColChart
} from "./charts.js";

google.charts.load('current', {'packages':['corechart'], 'language':'en'});


// --------------line chart-----------------

const T = 250;
const ALFA_95 = 1.645;
const MEAN = 10;
const T_DELAY = 20;
const Y_MIN_START = MEAN - ALFA_95 * Math.sqrt(T);
const Y_MAX_START = MEAN + ALFA_95 * Math.sqrt(T);

google.charts.setOnLoadCallback(initLine);

function initLine() {
    
    let lineBut = document.getElementById("lineButton");
    var chart = new google.visualization.ComboChart(document.getElementById('line'));
    
    ///////////////
    
    var options0 = {
        
        title: 'Dynamic line chart',
        
        hAxis: {    
            title: 'time',
            titleTextStyle: { italic: false },
            viewWindow: { max: 0, min: T}
        },

        vAxis: {
          title: 'return',
          titleTextStyle: { italic: false },
          viewWindow: { max: Y_MAX_START, min: Y_MIN_START}
        },
        
        series: {
            0: { type: 'line', color: 'blue' }
        },
        
        lineWidth: 2,
        width: 900,
        height: 500,
        
        chartArea: { width: 800 },

        legend: { position: 'none' },
        
        intervals: { 
            style: 'bars',
            barWidth: 0.1,
            lineWidth: 2
//            fillOpacity: 1
        }
        
    };

    function draw0() {

        let d = [];
        
        for (let t = 0; t <= T; t+=50) {
            let mean = MEAN * t / T;
            let div = Math.sqrt(t) * ALFA_95;
            d.push([t, mean, mean - div, mean + div]);
        }
        
        let data = new google.visualization.DataTable();
        data.addColumn('number', 'time');
        data.addColumn('number', 'mean');
        data.addColumn({type:'number', role:'interval'});
        data.addColumn({type:'number', role:'interval'});
        
        data.addRows(d);
        
        chart.draw(data, options0);
        
    }
    
    
    ///////////////////////////////

    var options = {
        
        title: 'Dynamic line chart',
        
        hAxis: {    
            title: 'time',
            titleTextStyle: { italic: false },
            viewWindow: { max: 0, min: T}
        },

        vAxis: {
          title: 'return',
          titleTextStyle: { italic: false },
          viewWindow: { max: Y_MAX_START, min: Y_MIN_START}
        },
        
        series: {
            0: { type: 'area' },
            1: { type: 'line', color: 'blue' }
        },

        lineWidth: 2,
        width: 900,
        height: 500,
        
        chartArea: { width: 800 },

        legend: { position: 'none' },
        
        intervals: { 
            style: 'bars',
            barWidth: 10,
            lineWidth: 2
//            fillOpacity: 1
        }
        
    };

    function draw() {
        
        lineBut.disabled = true;
        
        let y_max = Y_MAX_START;
        let y_min = Y_MIN_START;
        
        options.vAxis.viewWindow.max = y_max;
        options.vAxis.viewWindow.min = y_min;
        
        let d = [];
        
        for (let t = 0; t <= T; t+=50) {
            let mean = MEAN * t / T;
            let div = Math.sqrt(t) * ALFA_95;
            d.push([t, null, null, mean, mean - div, mean + div]);
        }
        
        d.push([0, 0, 'color: green', null, null, null]);
        
        let pathStart = d.length;
        for (let i = pathStart; i < T + pathStart; i++) {
            //let p = d[i - 1][1] + Math.sign(Math.random()-0.5) + MEAN/T;
            let p = d[i - 1][1] + rnorm(1)[0][0] + MEAN/T;
            if (p > 0) d.push([i - pathStart + 1, p, 'color: green', null, null, null]);
            if (p < 0) d.push([i - pathStart + 1, p, 'color: red', null, null, null]);
            if (p === 0) d.push([i - pathStart + 1, p, d[i - 1][2], null, null, null]);
        }
        
        let data = new google.visualization.DataTable();
        data.addColumn('number', 'time');
        data.addColumn('number', 'return');
        data.addColumn({type: 'string', role: 'style'});
        data.addColumn('number', 'mean');
        data.addColumn({type:'number', role:'interval'});
        data.addColumn({type:'number', role:'interval'});
                
        for (let i = 0; i < pathStart; i++) data.addRows([d[i]]);
        
        function go(j) {
            for (let i = j; i < j + 5; i++) {
                if (d[i][1] > y_max) {
                    options.vAxis.viewWindow.max = y_max = d[i][1]; 
                }
                if (d[i][1] < y_min) {
                    options.vAxis.viewWindow.min = y_min = d[i][1];
                }
                data.addRows([d[i]]);
            }
            chart.draw(data, options);
            setTimeout(function() {    
                if (j + 5 <= T + pathStart - 5) go(j + 5);
                else lineBut.disabled = false;
            }, T_DELAY);
        }

        go(pathStart);
        
    }
    
    //////////////
    
    draw0();
    
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

