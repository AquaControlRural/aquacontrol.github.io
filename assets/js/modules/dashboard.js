// =====================================================
// DASHBOARD - AQUACONTROL RURAL
// =====================================================

import { db } from "../firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-database.js";

let chart = null;
let intervaloDashboard = null;

let datosDashboard = {

    pozos: {},

    bombas: {},

    mantenimientos: {},

    inventario: {},

    bitacora: {}

};

//======================================================
// FUNCION PRINCIPAL
//======================================================

export async function renderDashboard() {

    try {

        await cargarDatos();

        crearTarjetas();

        cargarActividadReciente();

        cargarAlertas();

        cargarProximosMantenimientos();

        cargarGrafica();

        configurarEventos();

        iniciarActualizacionAutomatica();

    }

    catch (error) {

        console.error("Dashboard:", error);

    }

}

//======================================================
// CARGAR TODOS LOS DATOS
//======================================================

async function cargarDatos() {

    const [

        pozos,

        bombas,

        mantenimientos,

        inventario,

        bitacora

    ] = await Promise.all([

        get(ref(db, "pozos")),

        get(ref(db, "bombas")),

        get(ref(db, "mantenimientos")),

        get(ref(db, "inventario")),

        get(ref(db, "bitacora"))

    ]);


    datosDashboard.pozos =
        pozos.exists() ? pozos.val() : {};

    datosDashboard.bombas =
        bombas.exists() ? bombas.val() : {};

    datosDashboard.mantenimientos =
        mantenimientos.exists() ? mantenimientos.val() : {};

    datosDashboard.inventario =
        inventario.exists() ? inventario.val() : {};

    datosDashboard.bitacora =
        bitacora.exists() ? bitacora.val() : {};

}

//======================================================
// TARJETAS
//======================================================

function crearTarjetas() {

    const cards = document.getElementById("cardsContainer");

    if (!cards) return;

    let pozosActivos = 0;
    let bombasActivas = 0;
    let mantenimientosPendientes = 0;
    let inventarioBajo = 0;

    Object.values(datosDashboard.pozos).forEach(pozo => {

        if (pozo.estado === "Activo") {

            pozosActivos++;

        }

    });

    Object.values(datosDashboard.bombas).forEach(bomba => {

        if (bomba.estado !== "Fuera de servicio") {

            bombasActivas++;

        }

    });

    Object.values(datosDashboard.mantenimientos).forEach(m => {

        if (m.estado === "Pendiente") {

            mantenimientosPendientes++;

        }

    });

    Object.values(datosDashboard.inventario).forEach(material => {

        const cantidad = Number(material.cantidad || 0);
        const minimo = Number(material.stockMinimo || 0);

        if (cantidad <= minimo) {

            inventarioBajo++;

        }

    });

    cards.innerHTML = `

        <div class="col-12 col-md-6 col-xl-3">

            <div class="dashboard-card">

                <div class="card-icon bg-primary">

                    <i class="bi bi-water"></i>

                </div>

                <div class="card-content">

                    <small>Pozos Activos</small>

                    <h2>${pozosActivos}</h2>

                    <span>En operación</span>

                </div>

            </div>

        </div>



        <div class="col-12 col-md-6 col-xl-3">

            <div class="dashboard-card">

                <div class="card-icon bg-success">

                    <i class="bi bi-gear-fill"></i>

                </div>

                <div class="card-content">

                    <small>Bombas Activas</small>

                    <h2>${bombasActivas}</h2>

                    <span>Funcionando</span>

                </div>

            </div>

        </div>



        <div class="col-12 col-md-6 col-xl-3">

            <div class="dashboard-card">

                <div class="card-icon bg-warning">

                    <i class="bi bi-tools"></i>

                </div>

                <div class="card-content">

                    <small>Mantenimientos</small>

                    <h2>${mantenimientosPendientes}</h2>

                    <span>Pendientes</span>

                </div>

            </div>

        </div>



        <div class="col-12 col-md-6 col-xl-3">

            <div class="dashboard-card">

                <div class="card-icon bg-danger">

                    <i class="bi bi-box-seam"></i>

                </div>

                <div class="card-content">

                    <small>Inventario Bajo</small>

                    <h2>${inventarioBajo}</h2>

                    <span>Materiales</span>

                </div>

            </div>

        </div>

    `;

}



//======================================================
// ACTIVIDAD RECIENTE
//======================================================

function cargarActividadReciente() {

    const contenedor = document.getElementById("recentActivity");

    if (!contenedor) return;

    const actividades = Object.values(datosDashboard.bitacora);

    if (actividades.length === 0) {

        contenedor.innerHTML = `

            <div class="text-center text-muted py-5">

                No hay actividad reciente.

            </div>

        `;

        return;

    }

    actividades.sort((a, b) =>

        new Date(b.fechaRegistro) - new Date(a.fechaRegistro)

    );

    contenedor.innerHTML = "";

    actividades.slice(0, 6).forEach(item => {

        let color = "primary";
        let icono = "bi-clock-history";

        if (item.accion === "Registro") {

            color = "success";
            icono = "bi-plus-circle-fill";

        }

        if (item.accion === "Edición") {

            color = "warning";
            icono = "bi-pencil-fill";

        }

        if (item.accion === "Eliminación") {

            color = "danger";
            icono = "bi-trash-fill";

        }

        contenedor.innerHTML += `

            <div class="d-flex mb-4">

                <div class="me-3">

                    <span class="badge bg-${color} rounded-circle p-2">

                        <i class="bi ${icono}"></i>

                    </span>

                </div>

                <div>

                    <strong>${item.modulo}</strong>

                    <br>

                    <small class="text-muted">

                        ${item.descripcion}

                    </small>

                    <br>

                    <small class="text-primary">

                        ${item.fecha}

                    </small>

                </div>

            </div>

        `;

    });

}

//======================================================
// ALERTAS DEL SISTEMA
//======================================================

function cargarAlertas() {

    const contenedor = document.getElementById("systemAlerts");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    let hayAlertas = false;



    // Bombas fuera de servicio

    Object.values(datosDashboard.bombas).forEach(bomba => {

        if (bomba.estado === "Fuera de servicio") {

            hayAlertas = true;

            contenedor.innerHTML += `

                <div class="alert alert-danger d-flex align-items-center">

                    <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>

                    <div>

                        <strong>${bomba.nombre}</strong>

                        <br>

                        <small>La bomba se encuentra fuera de servicio.</small>

                    </div>

                </div>

            `;

        }

    });



    // Inventario bajo

    Object.values(datosDashboard.inventario).forEach(material => {

        const cantidad = Number(material.cantidad || 0);
        const minimo = Number(material.stockMinimo || 0);

        if (cantidad <= minimo) {

            hayAlertas = true;

            contenedor.innerHTML += `

                <div class="alert alert-warning d-flex align-items-center">

                    <i class="bi bi-box-seam fs-4 me-3"></i>

                    <div>

                        <strong>${material.nombre}</strong>

                        <br>

                        <small>

                            Stock bajo (${cantidad} disponibles)

                        </small>

                    </div>

                </div>

            `;

        }

    });



    if (!hayAlertas) {

        contenedor.innerHTML = `

            <div class="alert alert-success d-flex align-items-center">

                <i class="bi bi-check-circle-fill fs-4 me-3"></i>

                <div>

                    <strong>No existen alertas.</strong>

                    <br>

                    <small>Todo el sistema opera correctamente.</small>

                </div>

            </div>

        `;

    }

}



//======================================================
// PROXIMOS MANTENIMIENTOS
//======================================================

function cargarProximosMantenimientos() {

    const contenedor = document.getElementById("nextMaintenance");

    if (!contenedor) return;

    const lista = Object.values(datosDashboard.mantenimientos);

    if (lista.length === 0) {

        contenedor.innerHTML = `

            <div class="text-center text-muted py-5">

                No hay mantenimientos registrados.

            </div>

        `;

        return;

    }



    lista.sort((a, b) =>

        new Date(a.fecha) - new Date(b.fecha)

    );



    contenedor.innerHTML = "";



    lista.slice(0, 5).forEach(m => {

        const fecha = new Date(m.fecha);

        const textoFecha = fecha.toLocaleDateString("es-MX", {

            day: "2-digit",

            month: "short"

        });



        let color = "success";



        if (m.estado === "Pendiente") {

            color = "warning text-dark";

        }

        if (m.estado === "Cancelado") {

            color = "danger";

        }



        contenedor.innerHTML += `

            <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">

                <div>

                    <strong>

                        ${m.bombaNombre || "Sin bomba"}

                    </strong>

                    <br>

                    <small class="text-muted">

                        ${m.tipo || ""}

                    </small>

                </div>

                <span class="badge bg-${color}">

                    ${textoFecha}

                </span>

            </div>

        `;

    });

}

//======================================================
// GRAFICA DE MANTENIMIENTOS
//======================================================

function cargarGrafica() {

    const canvas = document.getElementById("chartMaintenances");

    if (!canvas) return;

    const year = document.getElementById("yearChart").value;
    const tipo = document.getElementById("typeChart").value;

    const datos = new Array(12).fill(0);

    Object.values(datosDashboard.mantenimientos).forEach(m => {

        if (!m.fecha) return;

        const fecha = new Date(m.fecha);

        if (isNaN(fecha)) return;

        if (fecha.getFullYear().toString() !== year) return;

        if (tipo !== "todos") {

            if ((m.tipo || "").toLowerCase() !== tipo.slice(0, -1)) {

                return;

            }

        }

        datos[fecha.getMonth()]++;

    });

    if (chart) {

        chart.destroy();

    }

    chart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: [

                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic"

            ],

            datasets: [

                {

                    label: "Mantenimientos",

                    data: datos,

                    backgroundColor: "#0d6efd",

                    borderRadius: 8

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        precision: 0

                    }

                }

            }

        }

    });

}



//======================================================
// EVENTOS
//======================================================

function configurarEventos() {

    const year = document.getElementById("yearChart");
    const tipo = document.getElementById("typeChart");

    if (year) {

        year.onchange = cargarGrafica;

    }

    if (tipo) {

        tipo.onchange = cargarGrafica;

    }

}



//======================================================
// ACTUALIZAR DASHBOARD
//======================================================

async function actualizarDashboard() {

    try {

        await cargarDatos();

        crearTarjetas();

        cargarActividadReciente();

        cargarAlertas();

        cargarProximosMantenimientos();

        cargarGrafica();

    }

    catch (error) {

        console.error(error);

    }

}



//======================================================
// ACTUALIZACION AUTOMATICA
//======================================================

function iniciarActualizacionAutomatica() {

    if (intervaloDashboard) {

        clearInterval(intervaloDashboard);

    }

    intervaloDashboard = setInterval(() => {

        actualizarDashboard();

    }, 60000);

}