import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
  constructor(path){
    this.products = [];
    this.path = path;
  }
  async #checkDB(){
    try{
      this.products = JSON.parse(await fs.promises.readFile(this.path))
    }catch{
      error => {throw new Error(error)}
    }
  }
  async #updateDB(){
    try{
      await fs.promises.writeFile(this.path, JSON.stringify(this.products))
    }catch{
      error => {throw new Error(error)}
    }
    
  }
  async addProduct({title, description, code, price, status=true, stock, category, thumbnails=[]}){
    try{
      await this.#checkDB()
      const isInArray = this.products.some(product => product.code === code)
      if(isInArray === false){
        this.products.push({
          id: uuidv4(),
          title: title,
          description: description,
          code: code,
          price: price,
          status: status,
          stock: stock,
          category: category,
          thumbnails: thumbnails    
        });
        await this.#updateDB()
      }else{
        throw new Error("Repeated product or items lacking")
      }
    }catch{error => {throw new Error(error)}}
  }
  async getProducts(){
    await this.#checkDB()
    return this.products
  }
  async getProductById(id){
    await this.#checkDB()
    const productFound = this.products.find(product => product.id === id)
    if (productFound){
      return productFound
    }else{
      throw new Error("Product not found")
    }
  }
  async updateProduct({id, title, description, code, price, status, stock, category, thumbnails}){
    await this.#checkDB()
    const indexFound = this.products.findIndex(product => product.id === id)
    if(indexFound !== -1){
      this.products[indexFound] = {
        id: id,
        title: title,
        description: description,
        code: code,
        price: price,
        status: status,
        stock: stock,
        category: category,
        thumbnails: thumbnails 
      }
      await this.#updateDB()
      return "Producto actualizado"
    }else{
      throw new Error("Not found")
    }
  }
  async deleteProduct(id){
    await this.#checkDB()
    const indexFound = this.products.findIndex(product => product.id === id)
    if(indexFound !== -1){
      this.products.splice(indexFound,indexFound+1)
      await this.#updateDB()
      return "Producto eliminado"
    }else{
      throw new Error("Not found")
    }
  }
}
export const productManager = new ProductManager("./src/products.json");
