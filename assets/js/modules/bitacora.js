import {
    escuchar
} from "../services/database.js";

import {
    exportarExcel
} from "../utils/excel.js";

let datosBitacora = {};

export function initBitacora() {

    cargarBitacora();

    document
        .getElementById("btnExcelBitacora")
        .addEventListener("click", exportarBitacoraExcel);

}

function cargarBitacora() {

    escuchar("bitacora", (datos) => {

        datosBitacora = datos || {};

        const tbody = document.querySelector(
            "#tablaBitacora tbody"
        );

        tbody.innerHTML = "";

        if (!datos) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        No hay registros.
                    </td>
                </tr>
            `;

            return;

        }

        const registros = Object.entries(datos).reverse();

        registros.forEach(([id, registro]) => {

            let badgeModulo = "bg-secondary";

            switch (registro.modulo) {

                case "Usuarios":
                    badgeModulo = "bg-primary";
                    break;

                case "Comunidades":
                    badgeModulo = "bg-purple";
                    break;

                case "Pozos":
                    badgeModulo = "bg-info";
                    break;

                case "Bombas":
                    badgeModulo = "bg-success";
                    break;

                case "Mantenimientos":
                    badgeModulo = "bg-warning text-dark";
                    break;

            }

            let badgeAccion = "bg-secondary";

            switch (registro.accion) {

                case "Registro":
                    badgeAccion = "bg-success";
                    break;

                case "Edición":
                    badgeAccion = "bg-primary";
                    break;

                case "Eliminación":
                    badgeAccion = "bg-danger";
                    break;

            }

            tbody.innerHTML += `

                <tr>

                    <td>${registro.fecha}</td>

                    <td>

                        <span class="badge ${badgeModulo}">

                            ${registro.modulo}

                        </span>

                    </td>

                    <td>

                        <span class="badge ${badgeAccion}">

                            ${registro.accion}

                        </span>

                    </td>

                    <td>${registro.descripcion}</td>

                    <td>${registro.usuario}</td>

                </tr>

            `;

        });

    });

}

function exportarBitacoraExcel() {

    const datos = [];

    Object.values(datosBitacora).forEach(registro => {

        datos.push({

            Fecha: registro.fecha,

            Modulo: registro.modulo,

            Accion: registro.accion,

            Descripcion: registro.descripcion,

            Usuario: registro.usuario

        });

    });

    exportarExcel({

        titulo: "Bitácora del Sistema",

        archivo: "Bitacora.xlsx",

        hoja: "Bitácora",

        datos

    });

}