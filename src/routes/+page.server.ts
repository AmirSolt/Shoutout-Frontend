import { z } from "zod";
import { stripe } from "$lib/stripe.server";
import { OrderStatus } from "../lib/config";
import { pb } from "$lib/pocketbase.server";
import { fail, redirect } from "@sveltejs/kit";
import Stripe from "stripe";
import {PUBLIC_DOMAIN} from '$env/static/public';
import {PRIVATE_SERVER_URL} from '$env/static/private';




const PRODUCTS:Product[] = [
    {
        id:"p_0",
        name:"Public Video",
        thumb_url:"https://static.vecteezy.com/system/resources/previews/003/337/584/non_2x/default-avatar-photo-placeholder-profile-icon-vector.jpg",
        description:"A video made for you",
        price:10,
        currency:"USD",
        queueCount:0,
        queueCountMax:3,
    },
    {
        id:"p_1",
        name:"Personal Video",
        thumb_url:"https://static.vecteezy.com/system/resources/previews/003/337/584/non_2x/default-avatar-photo-placeholder-profile-icon-vector.jpg",
        description:"Personal video sent to you you can upload anywhere",
        price:50,
        currency:"USD",
        queueCount:0,
        queueCountMax:20,
    }
]



export const load = async () => {
    let products:Product[] = [...PRODUCTS]
    try{
        products = await updateProductsQueue(products)
    } catch(e){
        // const err = e as Error
        // return fail(500,{
        //     errorMessage:err.message,
        // })
    }

    return {
        products
    }
};





export const actions = {
    default:async({request})=>{
        const data = await request.formData();
        const productID = data.get("product_id") as string
  
        // =====================
        // Queue Count
        let products:Product[] = [...PRODUCTS]
        try{
            products = await updateProductsQueue(products)
        } catch(e){
            const err = e as Error
            return fail(500,{
                errorMessage:err.message,
            })
        }
        const prodIndex = products.findIndex(prod=>prod.id==productID)
        if(products[prodIndex].queueCount>products[prodIndex].queueCountMax){
            return fail(400, {
                errorMessage: "We are at max capacity. Please try again later!"
            })
        }

        // =====================
        // create checkout
        let checkoutSession:Stripe.Checkout.Session|undefined
        try{
            checkoutSession = await createCheckoutSession(products[prodIndex])
        } catch(e){
            return fail(500,{
                errorMessage:"Something went wrong. Please try again later!",
            })
        }

        // =====================
        // submit order
        data.append("status", OrderStatus.payment_pending);
        data.append("checkout_id", checkoutSession.id);
       try{
            await pb.collection('orders').create(data);
        } catch(e){
            const err = e as ServerClientResponseError
            console.log(err)
            return fail(500,{
                errorMessage:err.response.message,
            })
        }

        // =====================
        throw redirect(302, checkoutSession.url!)
    }
};


async function updateProductsQueue(products:Product[]):Promise<Product[]>{
    
    let queueCount:QueueCount = {}
    queueCount = await getQueueCount()
    for(const [productID, value] of Object.entries(queueCount)){
        const prodIndex = products.findIndex(prod=>prod.id==productID)
        products[prodIndex].queueCount = value
    }
    return products
}

async function getQueueCount():Promise<QueueCount>{
    let queueCount:QueueCount = {}
    try{
        const orders:Order[] = await pb.collection('orders').getFullList({
            filter: `status = "${OrderStatus.order_waiting}"`
        });
        
        orders.forEach(order=>{
            if(order.tierID in queueCount){
                queueCount[order.tierID]++
            } else{
                queueCount[order.tierID] = 1
            }
        })

    } catch(e){
        const err = e as ServerClientResponseError
        throw new Error("Something went wrong. Please try again later!")
    }
    return queueCount
}

async function createCheckoutSession(product:Product){  
    const checkoutSession = await stripe.checkout.sessions.create({
        line_items: [
            {
              price_data:{
                currency:product.currency,
                product_data:{
                  name:product.name
                },
                unit_amount:product.price*100,
              },
              quantity: 1,
            },
          ],
        mode: 'payment',
        success_url: `https://${PUBLIC_DOMAIN}/payment/success`,
        cancel_url: `https://${PUBLIC_DOMAIN}/`,
    });
  
    if(checkoutSession.url==null){
        throw new Error("Something went wrong. Please try again later!")
    }

    
    return checkoutSession
}

