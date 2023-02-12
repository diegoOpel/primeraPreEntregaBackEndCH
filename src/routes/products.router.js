import { Router } from "express";
import { productManager } from "../productManager.js";
const routerProducts = Router()

routerProducts.get('/', (req,res) => {
  const {limit} = req.query
  try{
    productManager.getProducts().then((products)=>{
      if(products.length===0) return res.send('No items')
      if(limit){
        return res.send(products.slice(0,limit))
      }
      res.send(products)
    })
  }catch{err => {
    res.send(`Ha ocurrido un error ${err} al cargar la página`)
  }}
})

routerProducts.get('/:productId',(req,res)=>{
  const id = req.params.productId
  try{
    productManager.getProductById(id).then(product=>{
      res.status(200).send(product)
    })
  }catch{err => {
    res.send(`Ha ocurrido un error ${err} al cargar la página`)
  }}
})

routerProducts.post('/',(req,res)=>{
  const product = req.body
  if(!product.title || !product.description || !product.price || !product.stock || !product.category || !product.code){
    return res.status(400).send({status: 'error', error: 'incomplete values'})
  }
  try{
    productManager.addProduct(product).then(res.send({status:'success', message: 'product created'}))
  }catch{(error)=>res.status(400).send({status: "error", error: error})}
})

routerProducts.put('/:productId', (req,res)=>{
  const id = req.params.productId
  const product= {id, ...req.body}
  if(!product.title || !product.description || !product.price || !product.stock || !product.category || !product.code){
    return res.status(400).send({status: 'error', error: 'incomplete values'})
  }
  try{
    productManager.updateProduct(product).then(res.send({status:'success', message: 'product updated'}))
  }catch{error=>console.log(error)}
})

routerProducts.delete('/:productId', (req,res)=>{
  const id = req.params.productId
  try{
    productManager.deleteProduct(id).then(res.send({status:'success', message: 'product deleted'}))
  }catch{
    error=>console.log(error)
  }
})
export default routerProducts