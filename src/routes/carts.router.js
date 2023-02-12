import { Router } from "express";
import {cartManager} from "../cartManager.js";
const routerCarts = Router()

routerCarts.post('/', (req,res) => {
  const products = req.body
  cartManager.addCart(products).then(res.status(200).send({status: 'success', message: 'cart added'})).catch(error=>console.log(error))
})

routerCarts.get('/:cid', (req,res)=>{
  const cartId = req.params.cid
  cartManager.getCartById(cartId).then(products=> res.status(200).send(products)).catch(error => console.log(error))
})

routerCarts.post('/:cid/product/:pid', (req,res)=>{
  const cartId = req.params.cid
  const productId = req.params.pid
  cartManager.addProduct(cartId,productId).then(res.status(200).send({status: 'success', message: 'product added'})).catch(error=>console.log(error))
})
export default routerCarts