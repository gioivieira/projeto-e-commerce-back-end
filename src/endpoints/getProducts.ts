import { Request, Response } from "express"
import connection from "../dataBase/connection"

const getProducts = async (req: Request, res: Response): Promise<void> =>{

    let productName = req.query.product_name as string
    let chooseTheOrder = req.query.products_order as string
    let name = '%'
    let order;
    let errorCode = 400

    try {

        if(productName){
            name = productName
        } if(chooseTheOrder){
            order = chooseTheOrder
        } if(chooseTheOrder && chooseTheOrder !== 'asc' && chooseTheOrder !== 'desc' && chooseTheOrder !== 'ASC' && chooseTheOrder !== 'DESC'){
            errorCode = 422
            throw new Error("You need to type 'desc', 'asc', 'DESC' or 'ASC' to choose the order.")            
        }

        const products = await connection("labecommerce_products").select("*").whereLike('name', `%${name}%`).orderBy('name', order)

        if(products.length < 1){
            errorCode = 400
            throw new Error("Empty list.")            
        }

        res.status(200).send(products)
        
    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}

export default getProducts;