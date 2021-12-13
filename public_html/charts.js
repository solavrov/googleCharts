/* global google */

export {
    drawColChart
};

function drawColChart(div, data) {
    
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
    
    function init() {
        let dataTable = new google.visualization.DataTable();
        dataTable.addColumn('number', 'x');
        dataTable.addColumn('number', 'y');
        dataTable.addColumn({type: 'string', role: 'tooltip'});
        dataTable.addRows(data);

        let chart = new google.visualization.ColumnChart(div);

        function draw() {
            chart.draw(dataTable, options);
        }
        
        draw();
    }
    
    google.charts.setOnLoadCallback(init);
    
}



