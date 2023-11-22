import React from 'react'
import { FilaPedidos } from './FilaPedidos'
import {Item} from './Item'
export const Pedidos = () => {
    return (
        <div>
            <h1 className='text-center'>Pedidos</h1>
            <FilaPedidos />
            <Item/>
        </div>
    )
}
