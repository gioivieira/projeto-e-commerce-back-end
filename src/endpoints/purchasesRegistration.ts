import { Request, Response } from "express"
import connection from "../dataBase/connection"

const purchase = async (id: number, userId: string, productId: string, quantity: number, totalPrice: number) => {
    await connection("labecommerce_purchases").insert({
        id: id.toString(),
        user_id: userId,
        product_id: productId,
        quantity, 
        total_price: totalPrice
    })
}

const purchasesRegistration = async (req: Request, res: Response): Promise<void> =>{

    const {userId, productId, quantity} = req.body
    let id = Date.now()
    let totalPrice = 0
    let errorCode = 400

    try {

        if(!userId && !productId && !quantity){
            errorCode = 422
            throw new Error("It is mandatory to inform the user id, product id and the quantity purchased of that product.")            
        } if(!userId){
            errorCode = 422
            throw new Error("It is mandatory to inform the user id.")            
        }  if(!productId){
            errorCode = 422
            throw new Error("It is mandatory to inform the product id.")
        } if(!quantity){    
            errorCode = 422
            throw new Error("It is mandatory to inform the quantity purchased of that product.")
        } if(quantity <= 0){
            errorCode = 422
            throw new Error("A quantity greater than 0 is required.")
        }
        
        const users = await connection("labecommerce_users").select("*")
        const products = await connection("labecommerce_products").select("*")

        const userExisting = users.filter(user => user.id === userId)
        const productExisting = products.filter(product => product.id === productId)

        if(userExisting.length < 1){
            errorCode = 404
            throw new Error("This user does not exist.")            
        } if(productExisting.length < 1){
            errorCode = 404
            throw new Error("This product does not exist.") 
        }

        for(let product of products){
            if(product.id === productId){
                totalPrice = quantity * product.price
            }
        }

        await purchase(
            id, 
            userId,
            productId,
            quantity,
            totalPrice
        )

        res.status(201).end()
        
    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}

export default purchasesRegistration;