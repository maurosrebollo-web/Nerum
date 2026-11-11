document.addEventListener('DOMContentLoaded', () => {

    // 0. CARGAR IMÁGENES GLOBALES DEL SITIO
    const bannerImg = localStorage.getItem('nerum_img_banner');
    if (bannerImg) {
        document.querySelectorAll('#img-site-banner, .header-banner-fixed img').forEach(img => img.src = bannerImg);
    }

    const homeVelasImg = localStorage.getItem('nerum_img_velas');
    if (homeVelasImg) {
        const el = document.getElementById('img-site-home-velas');
        if (el) el.src = homeVelasImg;
    }

    const homeCajasImg = localStorage.getItem('nerum_img_cajas');
    if (homeCajasImg) {
        const el = document.getElementById('img-site-home-cajas');
        if (el) el.src = homeCajasImg;
    }

    // 1. INICIALIZAR CATÁLOGO VACÍO (SIN PRODUCTOS FICTICIOS)
    let productos = JSON.parse(localStorage.getItem('nerum_catalogo'));
    if (!productos || !Array.isArray(productos)) {
        productos = [];
        localStorage.setItem('nerum_catalogo', JSON.stringify(productos));
    }

    // 2. OPCIONES DE DESPLEGABLES
    let op = JSON.parse(localStorage.getItem('nerum_opciones_avanzadas')) || {
        coloresVela: ["Blanco Marfil", "Rosa Pastel", "Beige Natural"],
        fragancias: ["Vainilla", "Lavanda", "Coco", "Rosa Fresca"],
        tamanosCaja: ["Pequeña (10x10)", "Mediana (15x15)", "Grande (20x20)"],
        disenosCaja: ["Geométrico", "Minimalista", "Rústico"],
        coloresCaja: ["Kraft Natural", "Bordó", "Blanco"],
        tiposCaja: ["Tapa con lazo", "Deslizante", "Cofre"]
    };

    const selColorVela = document.getElementById('color-vela');
    if(selColorVela) {
        selColorVela.innerHTML = '';
        op.coloresVela.forEach(c => selColorVela.innerHTML += `<option value="${c}">${c}</option>`);
    }

    const selFragancia = document.getElementById('fragancia-vela');
    if(selFragancia) {
        selFragancia.innerHTML = '';
        op.fragancias.forEach(f => selFragancia.innerHTML += `<option value="${f}">${f}</option>`);
    }

    const selTamanoCaja = document.getElementById('tamano-caja');
    if(selTamanoCaja) {
        selTamanoCaja.innerHTML = '';
        op.tamanosCaja.forEach(t => selTamanoCaja.innerHTML += `<option value="${t}">${t}</option>`);
    }

    const selDisenoCaja = document.getElementById('diseno-caja');
    if(selDisenoCaja) {
        selDisenoCaja.innerHTML = '';
        op.disenosCaja.forEach(d => selDisenoCaja.innerHTML += `<option value="${d}">${d}</option>`);
    }

    const selColorCaja = document.getElementById('color-caja');
    if(selColorCaja) {
        selColorCaja.innerHTML = '';
        op.coloresCaja.forEach(c => selColorCaja.innerHTML += `<option value="${c}">${c}</option>`);
    }

    const selTipoCaja = document.getElementById('tipo-caja');
    if(selTipoCaja) {
        selTipoCaja.innerHTML = '';
        op.tiposCaja.forEach(tp => selTipoCaja.innerHTML += `<option value="${tp}">${tp}</option>`);
    }

    // 3. RENDERIZAR VELAS (MÁXIMO 6)
    const contenedorVelas = document.getElementById('contenedor-velas');
    const selectModeloVela = document.getElementById('modelo-vela');

    if (contenedorVelas || selectModeloVela) {
        let velas = productos.filter(p => p && p.categoria && p.categoria.trim().toLowerCase() === 'vela').slice(0, 6);

        if (contenedorVelas) {
            contenedorVelas.innerHTML = velas.length === 0 ? '<p style="text-align:center; grid-column: 1/-1; color:#666;">No hay velas publicadas aún.</p>' : '';
            velas.forEach(v => {
                contenedorVelas.innerHTML += `
                    <div class="service-card">
                        <img src="${v.imagen}" alt="${v.nombre}">
                        <div class="card-body">
                            <h3>${v.nombre}</h3>
                            <p>${v.desc}</p>
                            <div class="card-footer"><span class="price">${v.precio}</span></div>
                        </div>
                    </div>`;
            });
        }

        if (selectModeloVela) {
            selectModeloVela.innerHTML = '';
            velas.forEach(v => {
                selectModeloVela.innerHTML += `<option value="${v.nombre}">${v.nombre}</option>`;
            });
        }
    }

    // 4. RENDERIZAR CAJAS (MÁXIMO 6)
    const contenedorCajas = document.getElementById('contenedor-cajas');
    const selectModeloCaja = document.getElementById('modelo-caja');

    if (contenedorCajas || selectModeloCaja) {
        let cajas = productos.filter(p => p && p.categoria && p.categoria.trim().toLowerCase() === 'caja').slice(0, 6);

        if (contenedorCajas) {
            contenedorCajas.innerHTML = cajas.length === 0 ? '<p style="text-align:center; grid-column: 1/-1; color:#666;">No hay cajitas publicadas aún.</p>' : '';
            cajas.forEach(c => {
                contenedorCajas.innerHTML += `
                    <div class="service-card">
                        <img src="${c.imagen}" alt="${c.nombre}">
                        <div class="card-body">
                            <h3>${c.nombre}</h3>
                            <p>${c.desc}</p>
                            <div class="card-footer"><span class="price">${c.precio}</span></div>
                        </div>
                    </div>`;
            });
        }

        if (selectModeloCaja) {
            selectModeloCaja.innerHTML = '';
            cajas.forEach(c => {
                selectModeloCaja.innerHTML += `<option value="${c.nombre}">${c.nombre}</option>`;
            });
        }
    }

    // 5. FORMULARIOS DE ENCARGO
    const formVela = document.getElementById('form-encargo-vela');
    if (formVela) {
        formVela.addEventListener('submit', (e) => {
            e.preventDefault();
            let encargos = JSON.parse(localStorage.getItem('nerum_encargos')) || [];
            encargos.push({
                id: Date.now(),
                tipo: "Vela: " + document.getElementById('modelo-vela').value,
                detalle: `Color: ${document.getElementById('color-vela').value}, Fragancia: ${document.getElementById('fragancia-vela').value}`,
                cantidad: document.getElementById('cantidad-vela').value,
                nombre: document.getElementById('nombre-vela').value,
                contacto: document.getElementById('contacto-vela').value
            });
            localStorage.setItem('nerum_encargos', JSON.stringify(encargos));
            alert("¡Encargo de vela registrado con éxito!");
            formVela.reset();
        });
    }

    const formCaja = document.getElementById('form-encargo-caja');
    if (formCaja) {
        formCaja.addEventListener('submit', (e) => {
            e.preventDefault();
            let encargos = JSON.parse(localStorage.getItem('nerum_encargos')) || [];
            encargos.push({
                id: Date.now(),
                tipo: "Caja: " + document.getElementById('modelo-caja').value,
                detalle: `Tamaño: ${document.getElementById('tamano-caja').value}, Diseño: ${document.getElementById('diseno-caja').value}, Color: ${document.getElementById('color-caja').value}, Tipo: ${document.getElementById('tipo-caja').value}`,
                cantidad: document.getElementById('cantidad-caja').value,
                nombre: document.getElementById('nombre-caja').value,
                contacto: document.getElementById('contacto-caja').value
            });
            localStorage.setItem('nerum_encargos', JSON.stringify(encargos));
            alert("¡Encargo de cajita registrado con éxito!");
            formCaja.reset();
        });
    }
});