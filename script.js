document.addEventListener('DOMContentLoaded', () => {
    const inputs = [
        'priceA', 'mileageA',
        'priceB', 'mileageB',
        'annualDist', 'fuelPrice', 'interestRate'
    ];

    // Region Data Configuration
    const regionData = {
        'LKR': { symbol: 'Rs.', fuelPrice: 370, priceA: 15000000, priceB: 10000000, interestRate: 12 },
        'USD': { symbol: '$', fuelPrice: 0.95, priceA: 35000, priceB: 25000, interestRate: 5 },
        'GBP': { symbol: '£', fuelPrice: 1.45, priceA: 30000, priceB: 20000, interestRate: 4 },
        'EUR': { symbol: '€', fuelPrice: 1.80, priceA: 32000, priceB: 22000, interestRate: 3 },
        'INR': { symbol: '₹', fuelPrice: 100, priceA: 2000000, priceB: 1200000, interestRate: 7 }
    };

    let currentCurrencySymbol = 'Rs.';
    let comparisonChart = null;

    // Element References
    const regionSelect = document.getElementById('regionSelect');

    // Event Listener for Region Change
    regionSelect.addEventListener('change', (e) => {
        const region = regionData[e.target.value];
        if (region) {
            currentCurrencySymbol = region.symbol;
            document.getElementById('fuelPrice').value = region.fuelPrice;
            document.getElementById('priceA').value = region.priceA;
            document.getElementById('priceB').value = region.priceB;
            document.getElementById('interestRate').value = region.interestRate;

            const currencyFields = ['priceA', 'priceB', 'fuelPrice'];
            currencyFields.forEach(id => {
                const el = document.getElementById(id);
                if (el && el.previousElementSibling && el.previousElementSibling.classList.contains('input-group-text')) {
                    el.previousElementSibling.textContent = region.symbol;
                }
            });
            calculate();
        }
    });

    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculate);
    });

    document.getElementById('calcBtn').addEventListener('click', calculate);

    calculate();

    function calculate() {
        // 1. Get Values
        const val = {};
        inputs.forEach(id => {
            val[id] = parseFloat(document.getElementById(id).value) || 0;
        });

        if (val.mileageA <= 0) val.mileageA = 1;
        if (val.mileageB <= 0) val.mileageB = 1;

        // 2. Core Logic Variables
        const initialDiff = val.priceA - val.priceB; 
        const annualFuelA = (val.annualDist / val.mileageA) * val.fuelPrice;
        const annualFuelB = (val.annualDist / val.mileageB) * val.fuelPrice;
        const annualFuelSavings = annualFuelB - annualFuelA;

        // Arrays for Chart
        const labels = [];
        const dataCostA = [];
        const dataCostB = [];
        
        // Table Data
        const tableBody = document.getElementById('resultsBody');
        tableBody.innerHTML = '';

        let cumulativeFuelA = 0;
        let cumulativeFuelB = 0;
        let accumulatedInterest = 0;
        let breakEvenYear = null;
        
        let currentPot = Math.abs(initialDiff); 
        const isAExpensive = val.priceA >= val.priceB;

        // --- YEAR 0 (Initial Purchase) ---
        labels.push(`Year 0`);
        dataCostA.push(val.priceA);
        dataCostB.push(val.priceB);

        const rowZero = document.createElement('tr');
        rowZero.className = 'table-light';
        rowZero.innerHTML = `
            <td>0</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td class="fw-bold">Initial Price Difference:<br>${currentCurrencySymbol} ${Math.abs(initialDiff).toLocaleString()}</td>
        `;
        tableBody.appendChild(rowZero);

        // --- YEAR 1 to 10 ---
        for (let year = 1; year <= 10; year++) {
            labels.push(`Year ${year}`);

            cumulativeFuelA += annualFuelA;
            cumulativeFuelB += annualFuelB;

            let interestForYear = currentPot * (val.interestRate / 100);
            currentPot += interestForYear;
            accumulatedInterest += interestForYear;

            let totalCostA = val.priceA + cumulativeFuelA;
            let totalCostB = val.priceB + cumulativeFuelB;

            if (isAExpensive) {
                totalCostA += accumulatedInterest;
            } else {
                totalCostB += accumulatedInterest;
            }

            dataCostA.push(totalCostA);
            dataCostB.push(totalCostB);

            if (breakEvenYear === null) {
                if (isAExpensive && totalCostB > totalCostA) breakEvenYear = year;
                if (!isAExpensive && totalCostA > totalCostB) breakEvenYear = year;
            }
            
            let netPosition = totalCostB - totalCostA;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${year}</td>
                <td>${currentCurrencySymbol} ${annualFuelA.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                <td>${currentCurrencySymbol} ${annualFuelB.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                <td class="text-success">+${currentCurrencySymbol} ${annualFuelSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                <td class="text-danger">-${currentCurrencySymbol} ${interestForYear.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                <td class="${netPosition >= 0 ? 'text-pos' : 'text-neg'} fw-bold">
                    ${netPosition >= 0 ? 'A Better by ' : 'A Worse by '}<br>${currentCurrencySymbol} ${Math.abs(netPosition).toLocaleString(undefined, {maximumFractionDigits: 0})}
                </td>
            `;
            tableBody.appendChild(row);
        }

        // 3. Update Break-Even UI
        const beTitle = document.getElementById('breakEvenTitle');
        const beText = document.getElementById('breakEvenText');

        if (initialDiff === 0) {
            beTitle.textContent = "Same Price";
            beTitle.className = "card-title fw-bold text-secondary";
            beText.textContent = "Just compare fuel efficiency directly.";
        } else if (breakEvenYear !== null) {
            beTitle.textContent = `Pays for itself in ~${breakEvenYear} Years`;
            beTitle.className = "card-title fw-bold text-success";
            beText.textContent = `At year ${breakEvenYear}, the Total Cost of Ownership for the cheaper car exceeds the efficient car.`;
        } else {
            beTitle.textContent = "Does not pay for itself in 10 years";
            beTitle.className = "card-title fw-bold text-danger";
            beText.textContent = "The fuel savings never overcome the initial price difference + lost investment yield.";
        }

        updateChart(labels, dataCostA, dataCostB);
    }

    function updateChart(labels, dataA, dataB) {
        const ctx = document.getElementById('costChart').getContext('2d');
        if (comparisonChart) comparisonChart.destroy();

        comparisonChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Cost: Car A (Efficient)',
                        data: dataA,
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        borderWidth: 3,
                        tension: 0.1, // Straighter lines for year 0 start
                        pointRadius: 4
                    },
                    {
                        label: 'Total Cost: Car B (Cheaper)',
                        data: dataB,
                        borderColor: '#fd7e14',
                        backgroundColor: 'rgba(253, 126, 20, 0.1)',
                        borderWidth: 3,
                        tension: 0.1,
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += currentCurrencySymbol + ' ' + context.parsed.y.toLocaleString(undefined, {maximumFractionDigits: 0});
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: `Total Cumulative Cost (${currentCurrencySymbol})` },
                        ticks: {
                            callback: function(value) {
                                return currentCurrencySymbol + ' ' + value.toLocaleString(undefined, {notation: "compact"});
                            }
                        }
                    },
                    x: {
                        title: { display: true, text: 'Time (Years)' }
                    }
                }
            }
        });
    }
});