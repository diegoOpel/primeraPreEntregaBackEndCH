import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import { productManager } from "./productManager.js";

class CartManager {
  constructor(path){
    this.path = path;
    this.carts = []
  }

  async #checkDB(){
    try{
      this.carts = JSON.parse(await fs.promises.readFile(this.path))
    }catch{
      error => {throw new Error(error)}
    }
  }
  async #updateDB(){
    try{
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
    }catch{
      error => {throw new Error(error)}
    }  
  }

  async addCart(products){
    await this.#checkDB()
    const productsArray = JSON.parse(products.products).map(product => {
      return {id:product.id, quantity:product.quantity}
    })
    this.carts.push({
      cartId: uuidv4(),
      products: productsArray
    })
    await this.#updateDB()
  }

  async getCartById(cartId){
    await this.#checkDB()
    const cart = this.carts.find(cart => cart.cartId === cartId)
    if(cart){
      return cart.products
    }else{
      return "Cart not found"
    }
  }
  async addProduct(cartId, productId){
    await this.#checkDB()
    const cartIndex = this.carts.findIndex(cart => cart.cartId === cartId)
    const productFound = await productManager.getProductById(productId)
    if(cartIndex!==-1){
      const productIndex = this.carts[cartIndex].products.findIndex(product => product.id === productId)
      if(productIndex!==-1){
        this.carts[cartIndex].products[productIndex].quantity+=1
      }else{
        this.carts[cartIndex].products.push({id:productId, quantity: 1})
      }
      await this.#updateDB()
    }else{
      return "Cart not found"
    }
  }
}

export const cartManager = new CartManager("./src/carts.json");