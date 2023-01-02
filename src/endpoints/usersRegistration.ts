import { Request, Response } from 'express'
import connection from '../dataBase/connection'

const user = async (id: number, name: string, email: string, password: string) => {
    await connection("labecommerce_users").insert({
        id: id.toString(),
        username: name,
        email,
        password
    })
}

const usersRegistration = async (req: Request, res: Response): Promise<void> =>{

    const {name, email, password} = req.body
    const id = Date.now()
    let errorCode = 400

    try {
        
        if(password.length < 8){
            errorCode = 422
            throw new Error("It is mandatory that the user password has at least 8 characters.")
        } if(!name && !email && !password){
            errorCode = 422
            throw new Error("It is mandatory to inform the user name, e-mail and password.")            
        } if(!name){
            errorCode = 422
            throw new Error("It is mandatory to inform the user name.")            
        }  if(!password){
            errorCode = 422
            throw new Error("It is mandatory to inform the user password.")
        } if(!email){    
            errorCode = 422
            throw new Error("It is mandatory to inform the user e-mail.")
        }            

        await user(
            id, 
            name,
            email,
            password
        )

        res.status(201).end()

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}

export default usersRegistration;