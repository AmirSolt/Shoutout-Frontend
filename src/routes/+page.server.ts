import { z } from "zod";
import { stripe } from "$lib/stripe.server";
import { OrderStatus } from "../lib/config";
import { pb } from "$lib/pocketbase.server";
import { fail, redirect } from "@sveltejs/kit";
import Stripe from "stripe";
import {PUBLIC_DOMAIN} from '$env/static/public';


export const load = async () => {

    let queueCount = 0
    try{
        queueCount = await getQueueCount()
    } catch(e){
        return fail(500,{
            errorMessage:e,
        })
    }
    return {
        queueCount:queueCount
    }
};


const VideoRequestSchema = z.object({
	message: z.string().min(1),
	priceID: z.string().min(1),
});



export const actions = {
    default:async({request})=>{
        const data = await request.formData();
		const message = data.get('message') as string;
		const images = data.getAll('images') as File[];
		const priceID = data.get('priceID') as string;

        // Validation
        const validationResponse = VideoRequestSchema.safeParse({
			message,
			priceID,
		})
        if ( !validationResponse.success){
            let issues = validationResponse.error.issues
			return fail(400, {
				errorMessage: issues.length == 0 ? "Unkown issue" : issues[0].message
			})
        }

        // Queue Count
        let queueCount = 0
        try{
            queueCount = await getQueueCount()
        } catch(e){
            return fail(500,{
                errorMessage:e,
            })
        }
        if(queueCount>10){
            return fail(400, {
                errorMessage: "We are at max capacity. Please try again later!"
            })
        }

        //  Create order
        try{
            await pb.collection('orders').create({
                "status":OrderStatus.payment_pending,
                "message":message,
                "images":images,
            });
        } catch(e){
            return fail(500,{
                errorMessage:e,
            })
        }


        // create checkout
        let checkoutSession:Stripe.Checkout.Session|undefined
        try{
            checkoutSession = await createCheckoutSession(priceID)
        } catch(e){
            return fail(500,{
                errorMessage:e,
            })
        }
        throw redirect(302, checkoutSession.url!)
    }
};




async function getQueueCount(){
    let queueCount = 0
    try{
        const result = await pb.collection('orders').getFullList({
            filter: `status = ${OrderStatus.order_waiting}`
        });
        queueCount = result.length
    } catch(e){
        throw Error("Something went wrong. Please try again later!")
    }
    return queueCount
}

async function createCheckoutSession(priceID:string){  
    const checkoutSession = await stripe.checkout.sessions.create({
        line_items: [
          {
            price:priceID,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://${PUBLIC_DOMAIN}/payment/success`,
        cancel_url: `https://${PUBLIC_DOMAIN}/payment/fail`,
    });
  
    if(checkoutSession.url==null){
        throw Error("Something went wrong. Please try again later!")
    }

    
    return checkoutSession
}