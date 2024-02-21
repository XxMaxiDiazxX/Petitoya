import React from 'react'
import { Item } from './Item'
import { useAuth } from '../autenticacion/AuthContext'

export const Pedidos = () => {

    const { user } = useAuth();

    return (
        <div>
            <h1 className='text-center cuerpo'>Pedidos</h1>
            {user ? (
                <Item id_cliente={user.id} />
            ) : (
                <p>Cargando información del usuario...</p>
            )}
        </div>
    )
}
