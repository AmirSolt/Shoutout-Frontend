import { z } from "zod";
import { stripe } from "$lib/stripe.server";
import { OrderStatus } from "../lib/config";



export const load = async () => {
    return {
        queueCount:7
    }
};


const VideoRequestSchema = z.object({
	message: z.string().min(1),
	priceID: z.string().min(1),
});



export const actions = {
    default:async({request})=>{
        const data = await request.formData();
		const message = data.get('message');
		const priceID = data.get('priceID');


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

        // queue count
        const queueCount = 7
        if(queueCount>10){
            throw fail(400, {
                message: "Could not process this order. Video queue is already full."
            })
        }


        // create video request
        OrderStatus.payment_pending


        await checkout(priceID)
    }
};






async function checkout(priceID:string){  
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
  
    throw redirect(302, checkoutSession.url)
}