import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import { productManager } from "./productManager.js";

class CartManager {
  constructor(path){
    this.path = path;
    this.carts = []
  }

  async #checkDB(){
    this.carts = JSON.parse(await fs.promises.readFile(this.path))
  }
  async #updateDB(){
    await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
  }

  async addCart(products){
    await this.#checkDB()
    let productsFromDB 
    return new Promise((res,rej)=>{
      productManager.getProducts().then(
        data => {productsFromDB= data
          const productsArray = JSON.parse(products.products).map(product => {
            return {id:product.id, quantity:product.quantity}
          })
          productsArray.forEach(product=>{
            const indexFound=productsFromDB.findIndex(item => item.id === product.id) 
            if(indexFound===-1){
              rej("One of the items in the cart is not in inventory")  
            }else(
              this.carts.push({
                cartId: uuidv4(),
                products: productsArray
              })
            ) 
          })
          this.#updateDB().then(
            res("Cart added")
          )
        }
      )
    })
  }

  async getCartById(cartId){
    await this.#checkDB()
    const cart = this.carts.find(cart => cart.cartId === cartId)
    return new Promise((res,rej)=>{
      if(cart){
        res(cart.products)
      }else{
        rej("Cart not found")
      }
    })
  }
  async addProduct(cartId, productId){
    await this.#checkDB()
    const cartIndex = this.carts.findIndex(cart => cart.cartId === cartId)
    const productFound = await productManager.getProductById(productId)
    return new Promise((res,rej)=>{
      if(cartIndex!==-1){
        const productIndex = this.carts[cartIndex].products.findIndex(product => product.id === productId)
        if(productIndex!==-1){
          this.carts[cartIndex].products[productIndex].quantity+=1
        }else{
          this.carts[cartIndex].products.push({id:productId, quantity: 1})
        }
        this.#updateDB().then(res(`Product successfuly added to Cart with ID: ${cartId} `))
      }else{
        rej("Cart not found")
      }
    })
  }
}

export const cartManager = new CartManager("./src/carts.json");