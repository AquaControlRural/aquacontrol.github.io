import {
    agregar,
    actualizar,
    eliminar,
    escuchar
} from "../services/database.js";

let modal;

let idEditar = null;

let datosComunidades = {};

export function initComunidades() {

    modal = new bootstrap.Modal(
        document.getElementById("modalComunidad")
    );

    cargarComunidades();

    document
        .getElementById("btnGuardarComunidad")
        .addEventListener("click", guardarComunidad);

    document.addEventListener("click", (e) => {

        const btnEditar = e.target.closest(".btn-edit");

        if (btnEditar) {

            editarComunidad(btnEditar.dataset.id);

            return;

        }

        const btnEliminar = e.target.closest(".btn-delete");

        if (btnEliminar) {

            eliminarComunidad(btnEliminar.dataset.id);

        }

    });

}

async function guardarComunidad() {

    const nombre = document
        .getElementById("txtComunidad")
        .value.trim();

    const municipio = document
        .getElementById("txtMunicipio")
        .value.trim();

    const habitantes = parseInt(
        document.getElementById("txtHabitantes").value
    ) || 0;

    const responsable = document
        .getElementById("txtResponsable")
        .value.trim();

    const estado = document
        .getElementById("cmbEstado")
        .value;

    if (!nombre || !municipio) {

        Swal.fire({

            icon: "warning",

            title: "Completa los campos obligatorios"

        });

        return;

    }

    const datos = {

        nombre,

        municipio,

        habitantes,

        responsable,

        estado,

        fechaRegistro: new Date().toISOString()

    };

    if (idEditar) {

        await actualizar(
            "comunidades",
            idEditar,
            datos
        );

        Swal.fire({

            icon: "success",

            title: "Comunidad actualizada",

            timer: 1200,

            showConfirmButton: false

        });

    } else {

        await agregar(
            "comunidades",
            datos
        );

        Swal.fire({

            icon: "success",

            title: "Comunidad registrada",

            timer: 1200,

            showConfirmButton: false

        });

    }

    limpiarFormulario();

    idEditar = null;

    document.querySelector(".modal-title").textContent =
        "Nueva Comunidad";

    document.getElementById("btnGuardarComunidad").textContent =
        "Guardar";

    modal.hide();

}

function cargarComunidades() {

    escuchar("comunidades", (datos) => {

        datosComunidades = datos || {};

        const tbody = document.querySelector(
            "#tablaComunidades tbody"
        );

        tbody.innerHTML = "";

        if (!datos) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        No hay comunidades registradas.
                    </td>
                </tr>
            `;

            return;

        }

        let contador = 1;

        Object.entries(datos).forEach(([id, comunidad]) => {

            tbody.innerHTML += `

            <tr>

                <td>${contador++}</td>

                <td>

                    <strong>${comunidad.nombre}</strong>

                </td>

                <td>

                    ${comunidad.municipio}

                </td>

                <td>

                    ${comunidad.habitantes}

                </td>

                <td>

                    ${comunidad.responsable}

                </td>

                <td>

                    <span class="badge ${comunidad.estado === "Activa" ? "bg-success" : "bg-secondary"}">

                        ${comunidad.estado}

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

function editarComunidad(id) {

    idEditar = id;

    const comunidad = datosComunidades[id];

    document.getElementById("txtComunidad").value =
        comunidad.nombre;

    document.getElementById("txtMunicipio").value =
        comunidad.municipio;

    document.getElementById("txtHabitantes").value =
        comunidad.habitantes;

    document.getElementById("txtResponsable").value =
        comunidad.responsable;

    document.getElementById("cmbEstado").value =
        comunidad.estado;

    document.querySelector(".modal-title").textContent =
        "Editar Comunidad";

    document.getElementById("btnGuardarComunidad").textContent =
        "Actualizar";

    modal.show();

}

async function eliminarComunidad(id) {

    const respuesta = await Swal.fire({

        title: "¿Eliminar comunidad?",

        text: "Esta acción no se puede deshacer.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Eliminar",

        cancelButtonText: "Cancelar"

    });

    if (!respuesta.isConfirmed) return;

    await eliminar(
        "comunidades",
        id
    );

    Swal.fire({

        icon: "success",

        title: "Comunidad eliminada",

        timer: 1200,

        showConfirmButton: false

    });

}

function limpiarFormulario() {

    document.getElementById("txtComunidad").value = "";

    document.getElementById("txtMunicipio").value = "";

    document.getElementById("txtHabitantes").value = "";

    document.getElementById("txtResponsable").value = "";

    document.getElementById("cmbEstado").selectedIndex = 0;

}