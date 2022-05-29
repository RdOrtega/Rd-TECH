//barra menu carrito......
const cerrarCarrito = document.getElementById('cerrarCarrito');
const abrirCarrito = document.getElementById('abrirCarrito');
const menuCarrito = document.getElementById("menuCarrito");


listener();

function listener() {
    //menu carrito........
    abrirCarrito.addEventListener('click', (e) => {
        e.preventDefault();
        menuCarrito.classList.add('active');
        cerrarCarrito.classList.add('active');
    });
    cerrarCarrito.addEventListener('click', () => {
        menuCarrito.classList.remove('active');
    });
}