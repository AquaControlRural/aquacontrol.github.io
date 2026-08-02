import {
    agregar,
    actualizar,
    eliminar,
    escuchar
} from "../services/database.js";

let idEditar = null;

let datosPozos = {};
let modal;
export function initPozos() {

    modal = new bootstrap.Modal(
        document.getElementById("modalPozo")
    );

    cargarComunidades();
    cargarPozos();
    document
    .getElementById("btnGuardarPozo")
    .addEventListener("click", guardarPozo);
    document.addEventListener("click", (e) => {

    const btnEditar = e.target.closest(".btn-edit");

    if (btnEditar) {

        editarPozo(btnEditar.dataset.id);

        return;

    }

    const btnEliminar = e.target.closest(".btn-delete");

    if (btnEliminar) {

        eliminarPozo(btnEliminar.dataset.id);

    }

});

}

async function guardarPozo() {

    const nombre = document
        .getElementById("txtPozo")
        .value.trim();

    const comunidadId = document
        .getElementById("cmbComunidad")
        .value;

    const comunidadNombre = document
        .getElementById("cmbComunidad")
        .options[
            document.getElementById("cmbComunidad").selectedIndex
        ].text;

    const tipo = document
        .getElementById("cmbTipo")
        .value;

    const profundidad = parseFloat(
        document.getElementById("txtProfundidad").value
    ) || 0;

    const caudal = parseFloat(
        document.getElementById("txtCaudal").value
    ) || 0;

    const estado = document
        .getElementById("cmbEstadoPozo")
        .value;

    if (!nombre || !comunidadId) {

        Swal.fire({

            icon: "warning",

            title: "Completa los campos obligatorios"

        });

        return;

    }

    const datos = {

        nombre,

        comunidadId,

        comunidadNombre,

        tipo,

        profundidad,

        caudal,

        estado,

        fechaRegistro: new Date().toISOString()

    };

    if (idEditar) {

        await actualizar(
            "pozos",
            idEditar,
            datos
        );

    } else {

        await agregar(
            "pozos",
            datos
        );

    }

    Swal.fire({

        icon: "success",

        title: "Pozo registrado",

        timer: 1200,

        showConfirmButton: false

    });

    document.getElementById("txtPozo").value = "";
    document.getElementById("txtProfundidad").value = "";
    document.getElementById("txtCaudal").value = "";
    document.getElementById("cmbTipo").selectedIndex = 0;
    document.getElementById("cmbEstadoPozo").selectedIndex = 0;
    document.getElementById("cmbComunidad").selectedIndex = 0;
    idEditar = null;

    document.querySelector(".modal-title").textContent =
        "Nuevo Pozo";

    document.getElementById("btnGuardarPozo").textContent =
        "Guardar";
    modal.hide();

}

function cargarComunidades() {

    const combo = document.getElementById("cmbComunidad");

    escuchar("comunidades", (datos) => {

        combo.innerHTML = "";

        if (!datos) {

            combo.innerHTML = `
                <option value="">
                    No hay comunidades registradas
                </option>
            `;

            return;

        }

        Object.entries(datos).forEach(([id, comunidad]) => {

            combo.innerHTML += `

                <option value="${id}">

                    ${comunidad.nombre}

                </option>

            `;

        });

    });

}

function cargarPozos() {

    escuchar("pozos", (datos) => {

        datosPozos = datos || {};

        const tbody = document.querySelector("#tablaPozos tbody");

        tbody.innerHTML = "";

        if (!datos) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted">
                        No hay pozos registrados.
                    </td>
                </tr>
            `;

            return;

        }

        let contador = 1;

        Object.entries(datos).forEach(([id, pozo]) => {

            let badge = "bg-success";

            if (pozo.estado === "Mantenimiento") {

                badge = "bg-warning text-dark";

            }

            if (pozo.estado === "Fuera de servicio") {

                badge = "bg-danger";

            }

            tbody.innerHTML += `

                <tr>

                    <td>${contador++}</td>

                    <td><strong>${pozo.nombre}</strong></td>

                    <td>${pozo.comunidadNombre}</td>

                    <td>${pozo.tipo}</td>

                    <td>${pozo.profundidad} m</td>

                    <td>${pozo.caudal} L/s</td>

                    <td>

                        <span class="badge ${badge}">

                            ${pozo.estado}

                        </span>

                    </td>

                    <td class="text-center">

                        <button
                            class="btn-action btn-edit"
                            data-id="${id}">

                            <i class="bi bi-pencil"></i>

                        </button>

                        <button
                            class="btn-action btn-delete"
                            data-id="${id}">

                            <i class="bi bi-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

        });

    });

}

function editarPozo(id) {

    idEditar = id;

    const pozo = datosPozos[id];

    document.getElementById("txtPozo").value =
        pozo.nombre;

    document.getElementById("cmbComunidad").value =
        pozo.comunidadId;

    document.getElementById("cmbTipo").value =
        pozo.tipo;

    document.getElementById("txtProfundidad").value =
        pozo.profundidad;

    document.getElementById("txtCaudal").value =
        pozo.caudal;

    document.getElementById("cmbEstadoPozo").value =
        pozo.estado;

    document.querySelector(".modal-title").textContent =
        "Editar Pozo";

    document.getElementById("btnGuardarPozo").textContent =
        "Actualizar";

    modal.show();

}