import app from './app'
import getUsers from './endpoints/getUsers'
import productsRegistration from './endpoints/productsRegistration'
import usersRegistration from './endpoints/usersRegistration'
import getProducts from './endpoints/getProducts'
import purchasesRegistration from './endpoints/purchasesRegistration'
import getUserPurchases from './endpoints/getUserPurchases'

app.get('/users', getUsers)

app.get('/users/:user_id/purchases', getUserPurchases)

app.get('/products', getProducts)

app.post('/users', usersRegistration)

app.post('/products', productsRegistration)

app.post('/purchases', purchasesRegistration)

