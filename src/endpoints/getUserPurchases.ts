import { Request, Response } from "express"
import connection from "../dataBase/connection"

const getUserPurchases = async (req: Request, res: Response): Promise<void> => {

    const userId = req.params.user_id
    let errorCode = 400

    try {

        if(userId === ":user_id"){
            errorCode = 422
            throw new Error("It is mandatory to inform the user id.")            
        }

        const users = await connection("labecommerce_users").select("*")

        const userExisting = users.filter(user => user.id === userId)

        if(userExisting.length < 1){
            errorCode = 404
            throw new Error("This user does not exist.")            
        }

        const userPurchases = await connection("labecommerce_users")
        .select("labecommerce_purchases.id", "labecommerce_users.username", "labecommerce_products.name", "labecommerce_purchases.quantity", "labecommerce_purchases.total_price")
        .join("labecommerce_purchases", "labecommerce_purchases.user_id", "=", "labecommerce_users.id")
        .join("labecommerce_products", "labecommerce_purchases.product_id", "=", "labecommerce_products.id")
        .whereLike("labecommerce_purchases.user_id", `${userId}`)    

        res.status(200).send(userPurchases)
        
    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}

export default getUserPurchases;