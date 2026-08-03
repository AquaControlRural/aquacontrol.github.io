import { escuchar } from "../services/database.js";

let grafEstado = null;
let grafCategoria = null;
let grafCostos = null;
let grafBombas = null;

export function initReportes() {

    cargarReportes();

    document
        .getElementById("btnExcel")
        ?.addEventListener("click", exportarExcel);

}
function cargarReportes() {

    Promise.all([

        new Promise(resolve => escuchar("mantenimientos", resolve)),
        new Promise(resolve => escuchar("inventario", resolve)),
        new Promise(resolve => escuchar("bombas", resolve))

    ]).then(([mantenimientos, inventario, bombas]) => {

        procesarDatos(

            mantenimientos || {},
            inventario || {},
            bombas || {}

        );

    });

}

function procesarDatos(mantenimientos, inventario, bombas) {

    let totalMant = 0;

    let costoTotal = 0;

    let bajoStock = 0;

    let totalMaterial = 0;

    let totalBombas = 0;

    const estadoMant = {

        Pendiente: 0,

        "En proceso": 0,

        Finalizado: 0

    };

    const categoriaInv = {};

    const estadoBomba = {};

    const costosMes = new Array(12).fill(0);

    // ---------------- MANTENIMIENTOS ----------------

    Object.values(mantenimientos).forEach(m => {

        totalMant++;

        costoTotal += Number(m.costo || 0);

        estadoMant[m.estado]++;

        if (m.fecha) {

            const mes = new Date(m.fecha).getMonth();

            costosMes[mes] += Number(m.costo || 0);

        }

    });

    // ---------------- INVENTARIO ----------------

    Object.values(inventario).forEach(i => {

        totalMaterial++;

        if (i.cantidad <= i.stockMinimo)

            bajoStock++;

        categoriaInv[i.categoria] =
            (categoriaInv[i.categoria] || 0) + 1;

    });

    // ---------------- BOMBAS ----------------

    Object.values(bombas).forEach(b => {

        totalBombas++;

        estadoBomba[b.estado] =
            (estadoBomba[b.estado] || 0) + 1;

    });

    actualizarTarjetas(

        totalMant,

        costoTotal,

        totalBombas,

        totalMaterial,

        bajoStock

    );

    crearGraficas(

        estadoMant,

        categoriaInv,

        costosMes,

        estadoBomba

    );

}

function actualizarTarjetas(

    mant,

    costo,

    bombas,

    materiales,

    bajo

) {

    document.getElementById("repMantenimientos").textContent = mant;

    document.getElementById("repCosto").textContent =
    "$" + costo.toLocaleString();

    document.getElementById("repBombas").textContent = bombas;

    document.getElementById("repInventario").textContent = materiales;

    document.getElementById("repBajoStock").textContent = bajo;

}

function crearGraficas(

    estadoMant,

    categoriaInv,

    costosMes,

    estadoBomba

) {

    if (grafEstado) grafEstado.destroy();

    if (grafCategoria) grafCategoria.destroy();

    if (grafCostos) grafCostos.destroy();

    if (grafBombas) grafBombas.destroy();

    new Chart(
    document.getElementById("grafEstadoCanvas"),
    {

            type: "pie",

            data: {

                labels: Object.keys(estadoMant),

                datasets: [{

                    data: Object.values(estadoMant)

                }]

            }

        }

    );

    grafCategoria = new Chart(

        document.getElementById("grafCategoriaCanvas"),

        {

            type: "doughnut",

            data: {

                labels: Object.keys(categoriaInv),

                datasets: [{

                    data: Object.values(categoriaInv)

                }]

            }

        }

    );

    grafCostos = new Chart(

        document.getElementById("grafCostosCanvas"),

        {

            type: "line",

            data: {

                labels: [

                    "Ene","Feb","Mar","Abr","May","Jun",

                    "Jul","Ago","Sep","Oct","Nov","Dic"

                ],

                datasets: [{

                    label: "Costo",

                    data: costosMes

                }]

            }

        }

    );

    grafBombas = new Chart(

        document.getElementById("grafBombasCanvas"),

        {

            type: "bar",

            data: {

                labels: Object.keys(estadoBomba),

                datasets: [{

                    label: "Bombas",

                    data: Object.values(estadoBomba)

                }]

            }

        }

    );

}

function exportarExcel() {

    Swal.fire({

        icon: "info",

        title: "Próximamente",

        text: "La exportación a Excel se agregará en el siguiente paso."

    });

}

