export async function imagenBase64(ruta) {

    const respuesta = await fetch(ruta);

    const blob = await respuesta.blob();

    return new Promise((resolve) => {

        const lector = new FileReader();

        lector.onloadend = () => {

            resolve(lector.result.split(",")[1]);

        };

        lector.readAsDataURL(blob);

    });

}