import {
    agregar,
    actualizar,
    eliminar,
    escuchar,
    registrarBitacora
} from "../services/database.js";

let modal;

let idEditar = null;

let datosBombas = {};

export function initBombas() {

    modal = new bootstrap.Modal(
        document.getElementById("modalBomba")
    );

    cargarPozos();

    cargarBombas();

    document
        .getElementById("btnGuardarBomba")
        .addEventListener("click", guardarBomba);

    document.addEventListener("click", (e) => {

        const btnEditar = e.target.closest(".btn-edit");

        if (btnEditar) {

            editarBomba(btnEditar.dataset.id);

            return;

        }

        const btnEliminar = e.target.closest(".btn-delete");

        if (btnEliminar) {

            eliminarBomba(btnEliminar.dataset.id);

        }

    });

}

function cargarPozos() {

    const combo = document.getElementById("cmbPozo");

    escuchar("pozos", (datos) => {

        combo.innerHTML = "";

        if (!datos) {

            combo.innerHTML = `
                <option value="">
                    No hay pozos registrados
                </option>
            `;

            return;

        }

        Object.entries(datos).forEach(([id, pozo]) => {

            combo.innerHTML += `

                <option value="${id}">

                    ${pozo.nombre}

                </option>

            `;

        });

    });

}

async function guardarBomba() {

    const nombre = txtBomba.value.trim();

    const pozoId = cmbPozo.value;

    const pozoNombre =
        cmbPozo.options[cmbPozo.selectedIndex].text;

    const potencia = txtPotencia.value.trim();

    const marca = txtMarca.value.trim();

    const modelo = txtModelo.value.trim();

    const estado = cmbEstadoBomba.value;

    if (!nombre || !pozoId) {

        Swal.fire({

            icon: "warning",

            title: "Completa los campos obligatorios"

        });

        return;

    }

    const datos = {

        nombre,

        pozoId,

        pozoNombre,

        potencia,

        marca,

        modelo,

        estado,

        fechaRegistro: new Date().toISOString()

    };

    if (idEditar) {

        await actualizar(
            "bombas",
            idEditar,
            datos
        );
        await registrarBitacora(

            "Bombas",

            "Edición",

            `Se editó la bomba ${nombre}`

        );

    } else {

        await agregar(
            "bombas",
            datos
        );
        await registrarBitacora(

            "Bombas",

            "Registro",

            `Se registró la bomba ${nombre}`

        );

    }

    limpiarFormulario();

    idEditar = null;

    document.querySelector(".modal-title").textContent =
        "Nueva Bomba";

    btnGuardarBomba.textContent = "Guardar";

    modal.hide();

    Swal.fire({

        icon: "success",

        title: "Información guardada",

        timer: 1200,

        showConfirmButton: false

    });

}

function cargarBombas() {

    escuchar("bombas", (datos) => {

        datosBombas = datos || {};

        const tbody = document.querySelector(
            "#tablaBombas tbody"
        );

        tbody.innerHTML = "";

        if (!datos) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted">
                        No hay bombas registradas.
                    </td>
                </tr>
            `;

            return;

        }

        let contador = 1;

        Object.entries(datos).forEach(([id, bomba]) => {

            let badge = "bg-success";

            if (bomba.estado === "Mantenimiento") {

                badge = "bg-warning text-dark";

            }

            if (bomba.estado === "Fuera de servicio") {

                badge = "bg-danger";

            }

            tbody.innerHTML += `

                <tr>

                    <td>${contador++}</td>

                    <td><strong>${bomba.nombre}</strong></td>

                    <td>${bomba.pozoNombre}</td>

                    <td>${bomba.potencia} HP</td>

                    <td>${bomba.marca}</td>

                    <td>${bomba.modelo}</td>

                    <td>

                        <span class="badge ${badge}">

                            ${bomba.estado}

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

function editarBomba(id) {

    idEditar = id;

    const bomba = datosBombas[id];

    txtBomba.value = bomba.nombre;

    cmbPozo.value = bomba.pozoId;

    txtPotencia.value = bomba.potencia;

    txtMarca.value = bomba.marca;

    txtModelo.value = bomba.modelo;

    cmbEstadoBomba.value = bomba.estado;

    document.querySelector(".modal-title").textContent =
        "Editar Bomba";

    btnGuardarBomba.textContent = "Actualizar";

    modal.show();

}

async function eliminarBomba(id) {

    const respuesta = await Swal.fire({

        title: "¿Eliminar bomba?",

        text: "Esta acción no se puede deshacer.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Eliminar",

        cancelButtonText: "Cancelar"

    });

    if (!respuesta.isConfirmed) return;
    await registrarBitacora(

        "Bombas",

        "Eliminación",

        `Se eliminó la bomba ${datosBombas[id].nombre}`

    );

    await eliminar("bombas", id);

    Swal.fire({

        icon: "success",

        title: "Bomba eliminada",

        timer: 1200,

        showConfirmButton: false

    });

}

function limpiarFormulario() {

    txtBomba.value = "";

    txtPotencia.value = "";

    txtMarca.value = "";

    txtModelo.value = "";

    cmbPozo.selectedIndex = 0;

    cmbEstadoBomba.selectedIndex = 0;

}