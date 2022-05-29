/////////////////////////////////////////////////////
const carousel = document.getElementById('carouselExampleDark');
const about = document.getElementById('us');

const carro = new Carrito();
const carrito = document.getElementById("carrito");
const productos = document.getElementById("lista-productos");
const listaProductos = document.querySelector("#lista-carrito");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const procesarPedidoBtn = document.getElementById("procesar-pedido");




//observador de entrada de datos a la pantalla.....
const cargarDatos = (entradas, observador) => {

    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');

        } else {
            entrada.target.classList.remove('visible');
        }
    });
}

cargarEventos();

function cargarEventos() {

    //efecto de opacidad a secciones....
    const observador = new IntersectionObserver(cargarDatos, {
        root: null,
        threshold: 0.5
    });

    observador.observe(carousel);
    observador.observe(about);

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

//ARRAY DE PRODRUCTOS TRAIDOS DEL JSON.......
busqueda = [];


const fetchProductos = async() => {

    fetch('https://raw.githubusercontent.com/RdOrtega/Rd-TECH/main/data/productos.json')
        .then(response => response.json())
        .then((result) => {
            //empujamos el json al array "busqueda"......
            busqueda.push(result);
            filtroNew();
        })
        .catch(error => console.log(error))
}

function filtroNew() {
    busqueda.forEach(object => {
        reflejarProductos(object.filter(e => e.new));
    });
}

//reflejamos productos de la pagina principal.....

const contenedorProductos = document.getElementById('lista-tendencias');

reflejarProductos = (data) => {
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
    contenedorProductos.appendChild(fragment);

}