// Clase Pato
class Pato {
  constructor(tipo, nombre, apellido, edad, genero, imagen) {
    this.tipo = tipo || "UNDEFINED";
    this.nombre = nombre || "UNDEFINED";
    this.apellido = apellido || "UNDEFINED";
    this.edad = edad || "UNDEFINED";
    this.genero = genero || "UNDEFINED";
    this.imagen = imagen || "undefined.png";
    this.hijos = [];
    this.pareja = null;
  }

  agregarHijo(hijo) {
    this.hijos.push(hijo);
  }

  agregarPareja(pareja) {
    this.pareja = pareja;
  }

  // Método que genera la representación en HTML de cada pato
  generarHTML(relacion = "") {
    if (this.genero == "Masculino") {
      return `
      <div class="pato">
          <img src="/img/${this.imagen}" alt="${this.nombre
        }" loading="lazy" class="pato-img masculino">
          <div class="pato-info">
              <h3>${this.nombre} ${this.apellido} ${relacion ? `<br>(${relacion})` : ""} </h3>
              <p>Edad: ${this.edad}</p>
              <p>Género: ${this.genero}</p>
          </div>
      </div>
    `;

    }
    else if (this.genero == "Femenino") {
      return `
      <div class="pato">
          <img src="/img/${this.imagen}" alt="${this.nombre
        }" loading="lazy" class="pato-img femenino">
          <div class="pato-info">
              <h3>${this.nombre} ${this.apellido} ${relacion ? `<br>(${relacion})` : ""} </h3>
              <p>Edad: ${this.edad}</p>
              <p>Género: ${this.genero}</p>
          </div>
      </div>
    `;

    } else {
      return `
      <div class="pato">
          <img src="/img/${this.imagen}" alt="${this.nombre
        }" loading="lazy" class="pato-img">
          <div class="pato-info">
              <h3>${this.nombre} ${this.apellido} ${relacion ? `<br>(${relacion})` : ""} </h3>
              <p>Edad: ${this.edad}</p>
              <p>Género: ${this.genero}</p>
          </div>
      </div>
    `;
    }

  }
}

class PatoFamoso extends Pato {
  constructor(tipo, nombre, apellido, edad, genero, imagen) {
    super(tipo, nombre, apellido, edad, genero, imagen);
  }
  generarFama() {
    this.generarHTML()

  }
}

// Clase Familia
class Familia {
  constructor() {
    this.raiz = null;
  }

  setRaiz(pato) {
    this.raiz = pato;
  }

  generarArbolHTML(pato = this.raiz) {
    if (!pato) return "";

    let html = `<div class="arbol-nodo"><div class="arbol-contenedor">`;
    html += pato.generarHTML();

    // Si tiene pareja, la mostramos junto al pato
    if (pato.pareja) {
      html += pato.pareja.generarHTML(`Pareja de ${pato.nombre}`);
    }

    html += `</div>`; // Cerramos el contenedor de la pareja

    // Procesar los hijos si existen
    if (pato.hijos.length > 0) {
      html += '<div class="arbol-hijos">';
      pato.hijos.forEach((hijo) => {
        html += this.generarArbolHTML(hijo);
      });
      html += "</div>";
    }

    html += "</div>"; // Cerramos el nodo de la pato principal
    return html;
  }
}

// Clase PatoCiudad
class PatoCiudad {
  constructor() {
    this.cargarFicheroJson();
  }

  cargarFicheroJson(fichero = "patociudad.json") {
    function crearArbolDesdeJson(datos) {
      const { id, tipo, nombre, apellido, edad, genero, imagen, hijos, pareja, fama } =
        datos;

      function siFamoso() {
        if (tipo == "famoso") { 
          return new PatoFamoso(tipo, nombre, apellido, edad, genero, imagen)
        }else{
          return new Pato(tipo, nombre, apellido, edad, genero, imagen)
        }
      }
      
      const pato = siFamoso()


  // Si tiene una pareja, la agregamos
  if(pareja) {
    const parejaObjeto = new Pato(
      pareja.tipo,
      pareja.nombre,
      pareja.apellido,
      pareja.edad,
      pareja.genero,
      pareja.imagen
    );
    pato.agregarPareja(parejaObjeto);
  }

  if(hijos && hijos.length > 0) {
  hijos.forEach((hijo) => {
    const hijoObjeto = crearArbolDesdeJson(hijo); // Recursivamente crea hijos
    pato.agregarHijo(hijoObjeto);
  });
}

return pato;
    }

fetch(fichero)
  .then((response) => response.json())
  .then((data) => {
    this.familiaPato = new Familia();
    this.familiaPato.setRaiz(crearArbolDesdeJson(data));
    document.getElementById("arbol-genealogico").innerHTML =
      this.familiaPato.generarArbolHTML();
  })
  .catch((error) => console.error("Error al cargar el JSON:", error));
  }
}

window.onload = function () {
  new PatoCiudad();
};
