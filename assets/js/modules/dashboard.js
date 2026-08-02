const cards = [

    {
        title: "Pozos Activos",
        value: 18,
        icon: "bi-water",
        color: "#1976D2",
        status: "Operando correctamente",
        trend: "+2"
    },

    {
        title: "Bombas Activas",
        value: 24,
        icon: "bi-gear-fill",
        color: "#2E7D32",
        status: "En funcionamiento",
        trend: "+1"
    },

    {
        title: "Mantenimientos",
        value: 5,
        icon: "bi-tools",
        color: "#F9A825",
        status: "Programados",
        trend: "Hoy"
    },

    {
        title: "Fallas",
        value: 2,
        icon: "bi-exclamation-triangle-fill",
        color: "#D32F2F",
        status: "Pendientes",
        trend: "-1"
    }

];

export function renderDashboard(){

    renderCards();

    renderChart();

}

function renderCards(){

    const container=document.getElementById("cardsContainer");

    container.innerHTML="";

    cards.forEach(card=>{

        container.innerHTML+=`

        <div class="col-12 col-sm-6 col-xl-3">

            <div class="dashboard-card">

                <div class="dashboard-icon"

                    style="background:${card.color};">

                    <i class="bi ${card.icon}"></i>

                </div>

                <div class="dashboard-trend">

                    ${card.trend}

                </div>

                <h6>

                    ${card.title}

                </h6>

                <h2>

                    ${card.value}

                </h2>

                <small>

                    ${card.status}

                </small>

            </div>

        </div>

        `;

    });

}

function renderChart() {

    const ctx = document.getElementById("chartMaintenances");

    if (!ctx) return;

    new Chart(ctx, {

        data: {

            labels: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago"
            ],

            datasets: [

                {
                    type: "bar",

                    label: "Preventivos",

                    data: [8, 10, 6, 12, 9, 11, 13, 8],

                    backgroundColor: "#1976D2",

                    borderRadius: 10,

                    borderSkipped: false

                },

                {

                    type: "line",

                    label: "Correctivos",

                    data: [3, 2, 5, 4, 2, 6, 3, 2],

                    borderColor: "#2E7D32",

                    backgroundColor: "#2E7D32",

                    tension: .4,

                    pointRadius: 5,

                    pointHoverRadius: 8,

                    fill: false

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                mode: "index",

                intersect: false

            },

            plugins: {

                legend: {

                    position: "bottom"

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    grid: {

                        color: "#ECEFF1"

                    }

                },

                x: {

                    grid: {

                        display: false

                    }

                }

            }

        }

    });

}