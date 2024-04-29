import { z } from "zod";
import { stripe } from "$lib/stripe.server";
import { OrderStatus } from "../lib/config";
import { pb } from "$lib/pocketbase.server";
import { fail, redirect } from "@sveltejs/kit";
import Stripe from "stripe";
import {PUBLIC_DOMAIN} from '$env/static/public';

const COST_AMOUNT = 8.99
const MAX_CAPACITY = 20


export const load = async () => {

    let queueCount = 0
    try{
        queueCount = await getQueueCount()
    } catch(e){
        const err = e as Error
        return fail(500,{
            errorMessage:err.message,
        })
    }
    return {
        queueCount:queueCount,
        costAmount:COST_AMOUNT,
        maxCapacity:MAX_CAPACITY,
    }
};


const VideoRequestSchema = z.object({
	message: z.string().min(1).max(200),
});



export const actions = {
    default:async({request})=>{
        const data = await request.formData();
		const message = data.get('message') as string;
		const images = data.getAll('images') as File[];
        
        // Validation
        const validationResponse = VideoRequestSchema.safeParse({
			message,
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
            const err = e as Error
            return fail(500,{
                errorMessage:err.message,
            })
        }
        if(queueCount>MAX_CAPACITY){
            return fail(400, {
                errorMessage: "We are at max capacity. Please try again later!"
            })
        }

        //  Create order
        try{

            let pbData = new FormData();
            pbData.append("status", OrderStatus.payment_pending);
            pbData.append("message", message);
            pbData.append("images", images[0])
            // images.forEach(image=>pbData.append("images", image))


            await pb.collection('orders').create(pbData);
        } catch(e){
            const err = e as ServerClientResponseError
            console.log(err)
            return fail(500,{
                errorMessage:err.response.message,
            })
        }


        // create checkout
        let checkoutSession:Stripe.Checkout.Session|undefined
        try{
            checkoutSession = await createCheckoutSession(COST_AMOUNT)
        } catch(e){
            return fail(500,{
                errorMessage:"Something went wrong. Please try again later!",
            })
        }
        throw redirect(302, checkoutSession.url!)
    }
};




async function getQueueCount(){
    let queueCount = 0
    try{
        const result = await pb.collection('orders').getFullList({
            filter: `status = "${OrderStatus.order_waiting}"`
        });

        queueCount = result.length
    } catch(e){
        const err = e as ServerClientResponseError
        throw new Error("Something went wrong. Please try again later!")
    }
    return queueCount
}

async function createCheckoutSession(costAmount:number){  
    const checkoutSession = await stripe.checkout.sessions.create({
        line_items: [
            {
              price_data:{
                currency:"USD",
                product_data:{
                  name:"Juju"
                },
                unit_amount:costAmount*100,
              },
              quantity: 1,
            },
          ],
        mode: 'payment',
        success_url: `https://${PUBLIC_DOMAIN}/payment/success`,
        cancel_url: `https://${PUBLIC_DOMAIN}/payment/fail`,
    });
  
    if(checkoutSession.url==null){
        throw new Error("Something went wrong. Please try again later!")
    }

    
    return checkoutSession
}