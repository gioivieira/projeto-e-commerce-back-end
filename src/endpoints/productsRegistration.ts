import { Request, Response } from "express"
import connection from "../dataBase/connection"

const product = async (id: number, name: string, price: number, imageUrl: string) => {
    await connection("labecommerce_products").insert({
        id: id.toString(),
        name,
        price,
        image_url: imageUrl
    })
}

const productsRegistration = async (req: Request, res: Response): Promise<void> => {

    let {name, price, imageUrl} = req.body
    const id = Date.now()
    let errorCode = 400

    try {

        if(!name && !price && !imageUrl){
            errorCode = 422
            throw new Error("It is mandatory to inform the product name, price and image url.")            
        } if(!name){
            errorCode = 422
            throw new Error("It is mandatory to inform the product name.")            
        }  if(!price){
            errorCode = 422
            throw new Error("It is mandatory to inform the product price.")
        } if(!imageUrl){    
            errorCode = 422
            throw new Error("It is mandatory to inform the product image url.")
        }     

        await product(
            id,
            name, 
            price,
            imageUrl
        )

        res.status(201).end()

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}

export default productsRegistration;