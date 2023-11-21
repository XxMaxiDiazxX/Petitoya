import React from 'react'
import {Link} from 'react-router-dom'

export const PieDePagina = () => {
  return (
    <div>
        <footer className="bg-dark text-light py-4">
          <div className="container">
            <nav className="row justify-content-between">

                <ul className='col-12 col-md-3 list-unstyled'>
                  <li className='text-center'>ejemplo</li>
                  <li className='text-center'><Link to="/" className='text-reset'>Nombre_intragram</Link></li>
                  <li className='text-center'><Link to="/" className='text-reset'>Nombre_intragram</Link></li>
                </ul>
                
                <ul className='col-12 col-md-3 list-unstyled'>
                  <li className='text-center'>ejemplo</li>
                  <li className='text-center'><Link to="mailto:johansebastiavelezortiz@gmail.com" className='text-reset'>johansebastianvelezortiz@gmail.com</Link></li>
                  <li className='text-center'><Link to="tel:3214140078" className='text-reset'>321440078</Link></li>
                </ul>
                
                <ul className='col-12 col-md-3 list-unstyled'>
                  <li className='text-center'>ejemplo</li>
                  <li className='text-center'><Link to="" className='text-reset'>Misión</Link></li>
                  <li className='text-center'><Link to="" className='text-reset'>Visión</Link></li>
                  <li className='text-center'><Link to="" className='text-reset'>Términos y condicines</Link></li>
                </ul>

            </nav>
          </div>
        </footer>
    </div>
  )
}