const carro = new Carrito();
const carrito = document.getElementById("carrito");
const productos = document.getElementById("lista-productos");
const listaProductos = document.querySelector("#lista-carrito");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const procesarPedidoBtn = document.getElementById("procesar-pedido");

cargarEventos();

function cargarEventos() {

    //Se ejecuta cuando se presionar agregar carrito...
    productos.addEventListener("click", (e) => {
        carro.comprarProducto(e);
    });

    //Cuando se elimina productos del carrito....
    carrito.addEventListener("click", (e) => {
        carro.eliminarProductoModal(e);
    });

    //Al vaciar carrito....
    vaciarCarritoBtn.addEventListener("click", (e) => {
        carro.vaciarCarrito(e);
    });

    //Enviar pedido a otra pagina....
    procesarPedidoBtn.addEventListener("click", (e) => {
        carro.procesarPedido(e);
    });

    //Al cargar documento se muestra lo almacenado en LS...
    document.addEventListener("DOMContentLoaded", () => {
        carro.leerLocalStorage();
        fetchProductos();
    });
}


const filtroMarcas = (name) => {

    // hacemos el filtrado de todas las marca....
    filtrado.forEach(object => {
        reflejarFiltrado(object.filter(e => e.marca == "APPLE"));
        reflejarFiltrado(object.filter(e => e.marca == "ACER"));
        reflejarFiltrado(object.filter(e => e.marca == "LENOVO"));
        reflejarFiltrado(object.filter(e => e.marca == "HUAWEI"));
        reflejarFiltrado(object.filter(e => e.marca == "SAMSUNG"));
    });
}

const filtrado = [];

const fetchProductos = async() => {

    fetch('https://raw.githubusercontent.com/RdOrtega/Rd-TECH/main/data/productos.json')
        .then(response => response.json())
        .then((result) => {
            //empujamos el json al array "busqueda"......
            filtrado.push(result);
            filtroMarcas();
        })
        .catch(error => console.log(error))
}


//REFLEJAMOS LOS PRODUCTOS EN EL INDEX DESPUES DE FILTRARLOS EN LA FUNCION FILTROMARCAS.......

reflejarFiltrado = (data) => {

    const contenedor = document.getElementById('lista-marcas');

    const template = document.getElementById('template-productos').content;
    const fragment = document.createDocumentFragment();

    //recorremos el array de productos y los modificamos........ 

    data.forEach(producto => {
        template.querySelector('img').setAttribute('src', producto.imagen);
        template.querySelector('h4').textContent = producto.marca;
        template.querySelector('span ').textContent = producto.detalles;
        template.querySelector('p span').textContent = producto.precio;
        template.querySelector('button').dataset.id = producto.id;

        //clonamos los datos del template para luego mostrarlos el html.............
        const clone = template.cloneNode(true);
        fragment.appendChild(clone);
    })

    //aqui los mostramos en el html..................
    contenedor.appendChild(fragment);
}