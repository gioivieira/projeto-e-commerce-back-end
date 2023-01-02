import { Request, Response } from "express"
import connection from "../dataBase/connection"

const getUsers = async (req: Request, res: Response): Promise<void> =>{

    let errorCode = 400
    let users = []
    let purchases;

    try {

        let usersInfos = await connection("labecommerce_users").select("id", "username", "email")
        
        if(usersInfos.length < 1){
            errorCode = 400
            throw new Error("Empty list.")            
        }

        for(let user of usersInfos){

            purchases = await connection("labecommerce_purchases")
            .select("labecommerce_purchases.id", "labecommerce_purchases.user_id","labecommerce_products.name", "labecommerce_purchases.quantity", "labecommerce_purchases.total_price")
            .join("labecommerce_products", "labecommerce_purchases.product_id", "=", "labecommerce_products.id")
            .whereLike("labecommerce_purchases.user_id", `${user.id}`)

            user = {
                user, 
                purchases
            }
            
            users.push(user)            
        }

        res.status(200).send(users)
        
    } catch (err: any) {
        res.status(errorCode).send(err.message)      
    }
}

export default getUsers;