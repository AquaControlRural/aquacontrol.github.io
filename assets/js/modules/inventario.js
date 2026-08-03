import {
    agregar,
    actualizar,
    eliminar,
    escuchar,
    registrarBitacora
} from "../services/database.js";

let modal;

let idEditar = null;

let datosInventario = {};

export function initInventario() {

    modal = new bootstrap.Modal(
        document.getElementById("modalInventario")
    );

    cargarInventario();

    document
        .getElementById("btnGuardarMaterial")
        .addEventListener("click", guardarMaterial);

    document.addEventListener("click", (e) => {

        const editar = e.target.closest(".btn-edit");

        if (editar) {

            editarMaterial(editar.dataset.id);

            return;

        }

        const eliminarBtn = e.target.closest(".btn-delete");

        if (eliminarBtn) {

            eliminarMaterial(eliminarBtn.dataset.id);

        }

    });

}

async function guardarMaterial() {

    const nombre = txtMaterial.value.trim();

    const categoria = cmbCategoria.value;

    const cantidad = Number(txtCantidad.value);

    const unidad = txtUnidad.value.trim();

    const precio = Number(txtPrecio.value);

    const stockMinimo = Number(txtStock.value);

    const proveedor = txtProveedor.value.trim();

    const descripcion = txtDescripcion.value.trim();

    if (!nombre || cantidad < 0 || precio < 0) {

        Swal.fire({

            icon: "warning",

            title: "Completa los datos correctamente"

        });

        return;

    }

    const datos = {

        nombre,

        categoria,

        cantidad,

        unidad,

        precio,

        stockMinimo,

        proveedor,

        descripcion,

        fechaRegistro: new Date().toISOString()

    };

    if (idEditar) {

        await actualizar(
            "inventario",
            idEditar,
            datos
        );

        await registrarBitacora(

            "Inventario",

            "Edición",

            `Se editó el material ${nombre}`

        );

    } else {

        await agregar(
            "inventario",
            datos
        );

        await registrarBitacora(

            "Inventario",

            "Registro",

            `Se registró el material ${nombre}`

        );

    }

    limpiarFormulario();

    idEditar = null;

    document.querySelector("#modalInventario .modal-title").textContent =
        "Nuevo Material";

    btnGuardarMaterial.textContent = "Guardar";

    modal.hide();

    Swal.fire({

        icon: "success",

        title: "Información guardada",

        timer: 1200,

        showConfirmButton: false

    });

}

function cargarInventario() {

    escuchar("inventario", (datos) => {

        datosInventario = datos || {};

        const tbody =
            document.querySelector("#tablaInventario tbody");

        tbody.innerHTML = "";

        let total = 0;

        let bajoStock = 0;

        let valor = 0;

        const categorias = new Set();

        if (!datos) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        No hay materiales registrados.
                    </td>
                </tr>
            `;

            actualizarResumen(0,0,0,0);

            return;

        }

        let contador = 1;

        Object.entries(datos).forEach(([id, material]) => {

            total++;

            categorias.add(material.categoria);

            valor += material.cantidad * material.precio;

            let badge = "bg-success";

            let texto = "Disponible";

            if (material.cantidad <= material.stockMinimo) {

                badge = "bg-warning text-dark";

                texto = "Bajo Stock";

                bajoStock++;

            }

            if (material.cantidad === 0) {

                badge = "bg-danger";

                texto = "Agotado";

            }

            tbody.innerHTML += `
                <tr>

                    <td>${contador++}</td>

                    <td><strong>${material.nombre}</strong></td>

                    <td>${material.categoria}</td>

                    <td>${material.cantidad}</td>

                    <td>${material.unidad}</td>

                    <td>$${material.precio}</td>

                    <td>

                        <span class="badge ${badge}">
                            ${texto}
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

        actualizarResumen(

            total,

            bajoStock,

            valor,

            categorias.size

        );

    });

}

function actualizarResumen(total, bajo, valor, categorias) {

    totalMateriales.textContent = total;

    bajoStock.textContent = bajo;

    valorInventario.textContent =
        "$" + valor.toLocaleString();

    totalCategorias.textContent = categorias;

}

function editarMaterial(id) {

    idEditar = id;

    const material = datosInventario[id];

    txtMaterial.value = material.nombre;

    cmbCategoria.value = material.categoria;

    txtCantidad.value = material.cantidad;

    txtUnidad.value = material.unidad;

    txtPrecio.value = material.precio;

    txtStock.value = material.stockMinimo;

    txtProveedor.value = material.proveedor;

    txtDescripcion.value = material.descripcion;

    document.querySelector("#modalInventario .modal-title").textContent =
        "Editar Material";

    btnGuardarMaterial.textContent =
        "Actualizar";

    modal.show();

}

async function eliminarMaterial(id) {

    const respuesta = await Swal.fire({

        title: "¿Eliminar material?",

        text: "Esta acción no se puede deshacer.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Eliminar",

        cancelButtonText: "Cancelar"

    });

    if (!respuesta.isConfirmed) return;

    await registrarBitacora(

        "Inventario",

        "Eliminación",

        `Se eliminó el material ${datosInventario[id].nombre}`

    );

    await eliminar(
        "inventario",
        id
    );

    Swal.fire({

        icon: "success",

        title: "Material eliminado",

        timer: 1200,

        showConfirmButton: false

    });

}

function limpiarFormulario() {

    txtMaterial.value = "";

    cmbCategoria.selectedIndex = 0;

    txtCantidad.value = "";

    txtUnidad.value = "";

    txtPrecio.value = "";

    txtStock.value = "";

    txtProveedor.value = "";

    txtDescripcion.value = "";

}

