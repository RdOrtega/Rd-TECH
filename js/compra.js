const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');
const celular = document.getElementById('celular');
const btnCarrito = document.getElementById('carritoFinal');

cargarEventos();

function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    //Eliminar productos del carrito....
    carrito.addEventListener('click', (e) => {
        compra.eliminarProductoCarrito(e)
    });

    compra.calcularTotal();

    //cuando se selecciona procesar Compra
    procesarCompraBtn.addEventListener('click', procesarCompra);

    carrito.addEventListener('change', (e) => { compra.obtenerEvento(e) });
    carrito.addEventListener('keyup', (e) => { compra.obtenerEvento(e) });

}

function procesarCompra() {

    if (compra.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'No hay productos, selecciona alguno!',
            showConfirmButton: false,
            timer: 3000
        }).then(function() {
            window.location = "productos.html";
        })
    } else if (cliente.value === '' || correo.value === '' || celular.value === '') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Necesitamos tus datos para que puedas recibir el paquete!',
            showConfirmButton: false,
            timer: 4000
        })
    } else {

        //aqui se coloca el user id generado en el emailJS....
        emailjs.init('user_CEozz2F39lJJOLF5mJiDA')

        /* AGREGAR DATOS DETALLE DEL PEDIDO A UN TEXT AREA */
        const textArea = document.createElement('textarea');
        textArea.id = "detalleCompra";
        textArea.name = "detalleCompra";
        textArea.cols = 60;
        textArea.rows = 10;
        textArea.hidden = true;
        productosLS = compra.obtenerProductosLocalStorage();

        //Send email.......
        textArea.innerHTML = generarTabla(productosLS).innerHTML;

        carrito.appendChild(textArea);

        document.getElementById('procesar-pago')
            .addEventListener('submit', function(event) {
                event.preventDefault();

                const serviceID = 'default_service';
                const templateID = 'template_3SA9LsqQ';

                emailjs.sendForm(serviceID, templateID, this)
                    .then(() => {

                        document.querySelector('#loaders').appendChild(enviado);

                        setTimeout(() => {
                            compra.vaciarLocalStorage();
                            enviado.remove();
                            window.location = "index.html";
                        }, 2000);
                    }, (err) => {

                        alert("Error al enviar el email\r\n Response:\n " + JSON.stringify(err));
                    });
            });
    }
}


function generarTabla(productosLS) {

    let div = document.createElement("div");

    let tabla = document.createElement("table");

    tabla.innerHTML += `<table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Sub total</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>`;

    const body = tabla.childNodes[3];

    productosLS = compra.obtenerProductosLocalStorage();
    productosLS.forEach(producto => {

        const row = document.createElement("tr");
        row.innerHTML += `
                            <td>${producto.titulo}</td>
                            <td>${producto.precio}</td>
                            <td>${producto.cantidad}</td>
                            <td>${producto.precio * producto.cantidad}</td>
                        `;
        body.appendChild(row);
    });

    tabla.appendChild(body);
    return div.appendChild(tabla);
}