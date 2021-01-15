import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [clickNuevo, setClickNuevo] = useState(false);

  const [txtBtnNuevo, setTxtBtnNuevo] = useState("Nuevo");

  const [classBtnNuevo, setClassBtnNuevo] = useState("nuevo btn btn-success");

  const [personas, setPersonas] = useState([]); 

  const [nombreNuevo, setNombreNuevo] = useState("");

  const [edadNuevo, setEdadNuevo] = useState("");

  const [focusInputNuevo, setFocusInputNuevo] = useState("nombreNuevo");

  useEffect(() => {

    getPersonas()
  
  }, []);

  function eliminarHandleClick(e){


      fetch('https://crud-symfony-back.herokuapp.com/eliminarPersona',{
        method: 'POST',
        headers: new Headers({}),
        body: JSON.stringify({id: parseInt(e.target.name)}),
      })
      .then(response => response.text())
      .then((responseTxt)=> {

        getPersonas()

      })


  }


  function getPersonas(){

    fetch("https://crud-symfony-back.herokuapp.com/getPersonas",{})
    .then(response => response.text())
    .then((responseTxt)=> {

      setPersonas(JSON.parse(responseTxt).reverse())

    })

  }

  function nuevoHandleClick(e) {

    if(clickNuevo){

      fetch('https://crud-symfony-back.herokuapp.com/nuevaPersona',{
        method: 'POST',
        headers: new Headers({}),
        body: JSON.stringify({nombre: nombreNuevo, edad: edadNuevo}),
      })
      .then(response => response.text())
      .then((responseTxt)=> {

        getPersonas()

      })


      setClickNuevo(false)

      setTxtBtnNuevo("Nuevo")

      setClassBtnNuevo("nuevo btn btn-success")

    }else{

      setClickNuevo(true)

      setTxtBtnNuevo("Agregar")

      setClassBtnNuevo("nuevo btn btn-info")

    }

  }

  function handleNuevoInputChange(event){

    if (event.target.name === "nombreNuevo") {

      setFocusInputNuevo("nombreNuevo")

      setNombreNuevo(event.target.value)

    } else {

      setFocusInputNuevo("edadNuevo")

      setEdadNuevo(event.target.value)

    }

  }

  function Fila(props){

    const [editando, setEditando] = useState(false)

    const [nombre, setNombre] = useState(props.persona.nombre)

    const [edad, setEdad] = useState(props.persona.edad)

    const [focusNombre, setFocusNombre] = useState(false)

    const [focusEdad, setFocusEdad] = useState(false)

    if(editando){


      return(

            <tr>
              <th><div className="form-group"><input 
              value={nombre}
              autoFocus={focusNombre}
              onChange={event => {

                setFocusNombre(true)

                setFocusEdad(false)

                setNombre(event.target.value)

              }}
              className="form-control" type="text"/>

              </div></th>

              <th><div className="form-group"><input 
              value={edad}
              autoFocus={focusEdad}
              onChange={event => {

                setFocusEdad(true)

                setFocusNombre(false)

                setEdad(event.target.value)

              }}
              className="form-control" type="text"/>

              </div></th>

              <td>
                
                <button 
                onClick={()=>{

                  setEditando(false)

                  fetch('https://crud-symfony-back.herokuapp.com/editarPersona',{
                    method: 'POST',
                    headers: new Headers({}),
                    body: JSON.stringify({id: props.persona.id, nombre: nombre, edad: edad}),
                  })
                  .then(response => response.text())
                  .then((responseTxt)=> {

                    getPersonas()

                  })


                }} 
                type="button" className="btn btn-secondary">Guardar</button>
              
              </td>
              <td>

                <button type="button" className="btn btn-danger">Eliminar</button>

              </td>
            </tr>

      );
    }else{

      return (

              <tr>
                <th>{nombre}</th>
                <td>{edad}</td>
                <td>

                  <button 
                  onClick={()=>{setEditando(true)}} 
                  type="button" className="btn btn-warning">Editar</button>

                </td>
                <td>

                  <button 
                  onClick={eliminarHandleClick} 
                  name={props.persona.id}
                  type="button" className="btn btn-danger">Eliminar</button>

                </td>
              </tr>

      );

    }


    function editarHandleClick(e){


      if(e.target.innerText=="Editar"){

        e.target.className="btn btn-secondary"

        e.target.innerText="Guardar"

      }else{

        e.target.className="btn btn-warning"

        e.target.innerText="Editar"

      }


    }


  }

  function Nuevo(props){

    const click = props.click;

    if (click) {

      let focusNombre = false

      let focusEdad = false

      if(focusInputNuevo=="nombreNuevo"){

        focusNombre = true

      }else{

        focusEdad = true

      }

      return (

            <div className="datosNuevos">
                  <input autoFocus={focusNombre} name="nombreNuevo" 
                  onChange={event => handleNuevoInputChange(event)}
                  value={nombreNuevo} placeholder="Nombre" type="text"/>
                  <input autoFocus={focusEdad} name="edadNuevo" 
                  onChange={event => handleNuevoInputChange(event)}
                  value={edadNuevo} placeholder="Edad" type="text"/>
            </div>

            );

    }

    return <span />;

  }


  return (
    <div className="App">

      <h1 className="titulo">CRUD. React, Symfony, MySQL, Bootstrap.</h1>

      <button onClick={nuevoHandleClick} type="button" className={classBtnNuevo}>{txtBtnNuevo}</button>

      <Nuevo click={clickNuevo} />

      <table className="table table-dark table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>

          {personas.map((persona, index) => (

            <Fila key={persona.id} persona={persona} />

          ))}

        </tbody>
      </table>

    </div>
  );
}

export default App;
