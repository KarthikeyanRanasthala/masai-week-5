var mainTableBody = document.getElementById('main-table-body');

window.onload = function() {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr");
    xhr.send();
    xhr.onload = function() {
        if(xhr.status == 200) {
            resp = xhr.response;
            respObj = JSON.parse(resp);
            fillMainTable(respObj);
            fillCoinSelector(respObj);
        }
        else alert(xhr.status + ": Something Went Wrong");
    }
}

function fillMainTable(respObj) {
    for(var i = 0; i < 25; i++) {
        var tr = document.createElement("tr");

        var num = document.createElement("td");
        num.textContent = i+1;
        tr.appendChild(num);

        var name = document.createElement("td");
        name.textContent = respObj[i].name;
        tr.appendChild(name);

        var symbol = document.createElement("td");
        symbol.textContent = respObj[i].symbol;
        tr.appendChild(symbol);

        var inrPrice = document.createElement("td");
        inrPrice.setAttribute("data-toggle", "tooltip");
        inrPrice.setAttribute("data-placement", "bottom");
        var ath = "All time high is ₹ " + respObj[i].ath;
        inrPrice.setAttribute("title", ath);
        inrPrice.textContent = "₹ " + respObj[i].current_price;
        tr.appendChild(inrPrice);

        var pricePerChange = document.createElement("td");
        pricePerChange.setAttribute("data-toggle", "tooltip");
        pricePerChange.setAttribute("data-placement", "bottom");
        var pricePercent = respObj[i].price_change_percentage_24h + "% Change In Last 24hrs";
        pricePerChange.setAttribute("title", pricePercent);
        pricePerChange.textContent = "₹ " + respObj[i].price_change_24h;
        tr.appendChild(pricePerChange); 
        
        var marketCap = document.createElement("td");
        marketCap.textContent = respObj[i].circulating_supply;
        tr.appendChild(marketCap);

        var totalVolume = document.createElement("td");
        if(respObj[i].total_supply == null) {
            totalVolume.setAttribute("data-toggle", "tooltip");
            totalVolume.setAttribute("data-placement", "bottom");
            totalVolume.setAttribute("title", "No Set Block Limit");
            totalVolume.textContent = '∞';
        }
        else totalVolume.textContent = respObj[i].total_supply;
        
        tr.appendChild(totalVolume);
        mainTableBody.appendChild(tr);
    }
    
}

function fillCoinSelector(respObj) {
    var coinSelector = document.querySelectorAll(".coin-selector");
    for(var j = 0; j < coinSelector.length; j++) {
        for(var i = 0; i < respObj.length; i++) {
            var option = document.createElement("option");
            option.setAttribute("value", respObj[i].id);
            option.textContent = respObj[i].name;
            coinSelector[j].appendChild(option);
        }
    }
}

function checkExchange() {
    var selectedCoin = $('#selector-1').val();
    for(var i = 0; i < respObj.length; i++) {
        if(respObj[i].id == selectedCoin) {
            var exchangeOutput = '1 ' + respObj[i].symbol + ' = ' + "₹ " + respObj[i].current_price
            $('#exchange-output').text(exchangeOutput);
        }
    }
}

function requestChartData() {
    var chartXHR = new XMLHttpRequest();
    var selectedChart = $('#selector-2').val();
    var daysSelector = $('#days-selector').val();
    chartURL = 'https://api.coingecko.com/api/v3/coins/' + selectedChart + '/market_chart?vs_currency=inr&days=' + daysSelector;
    chartXHR.open("GET", chartURL);
    chartXHR.send();
    chartXHR.onload = function() {
        chartOBJ = JSON.parse(chartXHR.response);
        createChartArr(chartOBJ, selectedChart);
    }
}

function createChartArr(chartOBJ, selectedChart) {
        var chartDataArr = [];
        for(i = 0; i < chartOBJ.prices.length; i++) {
            var chartDataItem = {t: chartOBJ.prices[i][0], y: chartOBJ.prices[i][1]};
            chartDataArr.push(chartDataItem);
        }
        createChart(chartDataArr, selectedChart);
}

function createChart(chartDataArr, selectedChart) {
        var ctx = document.getElementById('chart').getContext('2d');
        ctx.canvas.width = 1000;
        ctx.canvas.height = 300;
        var config = {
            type: 'bar',
            data: {
                datasets: [{
                    label: selectedChart,
                    backgroundColor: '#007bff',
                    data: chartDataArr,
                    type: 'line',
                    pointRadius: 1,
                    fill: true,
                    lineTension: 0,
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'series',
                        display: false
                    }],
                    yAxes: [{
                        display: false
                    }]
                },
                tooltips: {
                    enabled: false
                }
            }
        };

        new Chart(ctx, config);
}