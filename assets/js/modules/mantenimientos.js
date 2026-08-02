import {
    agregar,
    actualizar,
    eliminar,
    escuchar
} from "../services/database.js";

let modal;

let idEditar = null;

let datosMantenimientos = {};

export function initMantenimientos() {

    modal = new bootstrap.Modal(
        document.getElementById("modalMantenimiento")
    );

    cargarBombas();
    cargarMantenimientos();
    document
        .getElementById("btnGuardarMantenimiento")
        .addEventListener("click", guardarMantenimiento);

    document.addEventListener("click", (e) => {

        const btnEditar = e.target.closest(".btn-edit");

        if (btnEditar) {

            editarMantenimiento(btnEditar.dataset.id);

            return;

        }

        const btnEliminar = e.target.closest(".btn-delete");

        if (btnEliminar) {

            eliminarMantenimiento(btnEliminar.dataset.id);

        }

    });

}
function editarMantenimiento(id) {

    idEditar = id;

    const mantenimiento = datosMantenimientos[id];

    document.getElementById("cmbBomba").value =
        mantenimiento.bombaId;

    document.getElementById("txtFecha").value =
        mantenimiento.fecha;

    document.getElementById("cmbTipoMantenimiento").value =
        mantenimiento.tipo;

    document.getElementById("txtTecnico").value =
        mantenimiento.tecnico;

    document.getElementById("txtCosto").value =
        mantenimiento.costo;

    document.getElementById("txtDescripcion").value =
        mantenimiento.descripcion;

    document.getElementById("cmbEstadoMantenimiento").value =
        mantenimiento.estado;

    document.querySelector(".modal-title").textContent =
        "Editar Mantenimiento";

    document.getElementById("btnGuardarMantenimiento").textContent =
        "Actualizar";

    modal.show();

}


function cargarBombas() {

    const combo = document.getElementById("cmbBomba");

    escuchar("bombas", (datos) => {

        combo.innerHTML = "";

        if (!datos) {

            combo.innerHTML = `
                <option value="">
                    No hay bombas registradas
                </option>
            `;

            return;

        }

        Object.entries(datos).forEach(([id, bomba]) => {

            combo.innerHTML += `
                                <option
                                    value="${id}"
                                    data-pozoid="${bomba.pozoId}"
                                    data-pozonombre="${bomba.pozoNombre}">
                                    ${bomba.nombre}
                                </option>
                            `;

        });

    });

    

}

async function eliminarMantenimiento(id) {

    const respuesta = await Swal.fire({

        title: "¿Eliminar mantenimiento?",

        text: "Esta acción no se puede deshacer.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Eliminar",

        cancelButtonText: "Cancelar"

    });

    if (!respuesta.isConfirmed) return;

    await eliminar(
        "mantenimientos",
        id
    );

    Swal.fire({

        icon: "success",

        title: "Mantenimiento eliminado",

        timer: 1200,

        showConfirmButton: false

    });

}

async function guardarMantenimiento() {

    const cmbBomba = document.getElementById("cmbBomba");

    const opcion = cmbBomba.options[cmbBomba.selectedIndex];

    const bombaId = cmbBomba.value;

    const bombaNombre = opcion.text;

    const pozoId = opcion.dataset.pozoid;

    const pozoNombre = opcion.dataset.pozonombre;

    const fecha = document
        .getElementById("txtFecha")
        .value;

    const tipo = document
        .getElementById("cmbTipoMantenimiento")
        .value;

    const tecnico = document
        .getElementById("txtTecnico")
        .value.trim();

    const costo = parseFloat(
        document.getElementById("txtCosto").value
    ) || 0;

    const descripcion = document
        .getElementById("txtDescripcion")
        .value.trim();

    const estado = document
        .getElementById("cmbEstadoMantenimiento")
        .value;

    if (!bombaId || !fecha) {

        Swal.fire({

            icon: "warning",

            title: "Completa los campos obligatorios"

        });

        return;

    }

    const datos = {

        bombaId,

        bombaNombre,

        pozoId,

        pozoNombre,

        fecha,

        tipo,

        tecnico,

        costo,

        descripcion,

        estado,

        fechaRegistro: new Date().toISOString()

    };

    if (idEditar) {

        await actualizar(
            "mantenimientos",
            idEditar,
            datos
        );

    } else {

        await agregar(
            "mantenimientos",
            datos
        );

    }

    limpiarFormulario();

    idEditar = null;

    document.querySelector(".modal-title").textContent =
        "Nuevo Mantenimiento";

    document.getElementById("btnGuardarMantenimiento").textContent =
        "Guardar";
    modal.hide();

    Swal.fire({

        icon: "success",

        title: "Mantenimiento registrado",

        timer: 1200,

        showConfirmButton: false

    });

}
function limpiarFormulario() {

    document.getElementById("cmbBomba").selectedIndex = 0;

    document.getElementById("txtFecha").value = "";

    document.getElementById("cmbTipoMantenimiento").selectedIndex = 0;

    document.getElementById("txtTecnico").value = "";

    document.getElementById("txtCosto").value = "";

    document.getElementById("txtDescripcion").value = "";

    document.getElementById("cmbEstadoMantenimiento").selectedIndex = 0;

}

function cargarMantenimientos() {

    escuchar("mantenimientos", (datos) => {

        datosMantenimientos = datos || {};

        const tbody = document.querySelector(
            "#tablaMantenimientos tbody"
        );

        tbody.innerHTML = "";

        if (!datos) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        No hay mantenimientos registrados.
                    </td>
                </tr>
            `;

            return;

        }

        let contador = 1;

        Object.entries(datos).forEach(([id, mantenimiento]) => {

            let badge = "bg-secondary";

            if (mantenimiento.estado === "Pendiente") {

                badge = "bg-warning text-dark";

            }

            if (mantenimiento.estado === "En proceso") {

                badge = "bg-primary";

            }

            if (mantenimiento.estado === "Finalizado") {

                badge = "bg-success";

            }

            tbody.innerHTML += `

                <tr>

                    <td>${contador++}</td>

                    <td>${mantenimiento.fecha}</td>

                    <td><strong>${mantenimiento.bombaNombre}</strong></td>

                    <td>${mantenimiento.tipo}</td>

                    <td>${mantenimiento.tecnico}</td>

                    <td>

                        <span class="badge ${badge}">

                            ${mantenimiento.estado}

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