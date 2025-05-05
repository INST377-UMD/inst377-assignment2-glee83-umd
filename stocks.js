let stockChart = null;

function initializeStocks() {
    fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
    .then(res => res.json())
    .then(data => {
        const top5 = data.slice(0, 5);
        const table = document.getElementById('stockList');

        top5.forEach(stock => {
            const row = document.createElement('tr');

            const sentiment = stock.sentiment === 'Bullish'
            ? '<img src="https://static.thenounproject.com/png/3328202-200.png" width="80"/>'
            : '<img src="https://cdn.iconscout.com/icon/free/png-256/free-bearish-icon-download-in-svg-png-gif-file-formats--downtrend-animal-stocks-finance-investment-pack-business-icons-1570417.png" width="80"/>';

            row.innerHTML = `
            <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
            <td>${stock.no_of_comments}</td>
            <td style="text-align: center;">${sentiment}</td>
            `;
            table.appendChild(row);
        });
    });

    const chartScript = document.createElement('script');
    chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    chartScript.onload = () => {
        window.lookupStock = function(tickerFromVoice = null) {
            const apiKey = 'VnQ7hKCRNSlz2XRtkM8ZqnrfWHOEEWrD';
            const input = tickerFromVoice || document.getElementById('ticker').value;
            const days = document.getElementById('days').value.split(' ')[0];

            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - parseInt(days));

            const format = date => date.toISOString().split('T')[0];

            fetch(`https://api.polygon.io/v2/aggs/ticker/${input.toUpperCase()}/range/1/day/${format(startDate)}/${format(endDate)}?apiKey=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                if (!data.results || !Array.isArray(data.results)) {
                    alert('No data available. You may have hit the API limit or used an invalid ticker.');
                    return;
                }

                const ctx = document.getElementById('myChart').getContext('2d');

                if (stockChart) {
                    stockChart.destroy();
                }

                const dates = data.results.map(d => new Date(d.t).toLocaleDateString());
                const prices = data.results.map(d => d.c);

                stockChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: `${input.toUpperCase()} Stock Price`,
                            data: prices,
                            backgroundColor: 'lightblue',
                            borderColor: 'lightblue'
                        }]
                    }
                });

                document.getElementById('myChart').style.display = 'block';
            });

        };

        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            lookupStock();
            return false;
        });
    };
    document.head.appendChild(chartScript);

    const voiceScript = document.createElement('script');
    voiceScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/annyang/2.6.1/annyang.min.js';
    voiceScript.onload = () => {
        const commands = {
            'hello': () => alert('Hello'),
            'change the color to *color': color => document.body.style.backgroundColor = color,
            'navigate to *page': page => {
                const p = page.toLowerCase();
                if (p.includes('home')) location.href = 'home.html';
                else if (p.includes('stock')) location.href = 'stocks.html';
                else if (p.includes('dog')) location.href = 'dogs.html';
            },
            'lookup *stock': stock => {
                const input = document.getElementById('ticker');
                if (input) {
                input.value = stock;
                window.lookupStock(stock);
                }
            }
        };

        annyang.addCommands(commands);
    };
    document.head.appendChild(voiceScript);
}

window.onload = initializeStocks;  