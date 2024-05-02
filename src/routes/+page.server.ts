import { z } from "zod";
import { stripe } from "$lib/stripe.server";
import { OrderStatus } from "../lib/config";
import { pb } from "$lib/pocketbase.server";
import { error, fail, redirect } from "@sveltejs/kit";
import Stripe from "stripe";
import {PUBLIC_DOMAIN} from '$env/static/public';
import {PRIVATE_SERVER_URL} from '$env/static/private';


const characterName = 'Juju the Clown';
const maxTotalRaisedGoal = 5000

export const load = async () => {



    return {
        characterName,
        pageData:await getLandingPageData(),
        maxTotalRaisedGoal
    }
};


const CheckoutRequestSchema = z.object({
	amount: z.number().min(4.99).max(10_001.0),
    userName:z.string().min(3).max(24),
});


export const actions = {
    default:async({request})=>{
        const data = await request.formData();
        let amountStr = data.get("amount") as string
        let userName = data.get("user_name") as string

        // =====================
        // conversion and validation
        const amount = parseFloat(amountStr)

        const validationResponse = CheckoutRequestSchema.safeParse({
            amount, userName
          })
            if ( !validationResponse.success){
                let issues = validationResponse.error.issues
          return fail(400, {
            errorMessage: issues.length == 0 ? "Unkown issue" : issues[0].message
          })
            }

        // =====================
        // create checkout
        let checkoutSession:Stripe.Checkout.Session|undefined
        try{
            checkoutSession = await createCheckoutSession(amount, userName, characterName)
        } catch(e){
            return fail(500,{
                errorMessage:"Something went wrong. Please try again later!",
            })
        }

        throw redirect(302, checkoutSession.url!)
    }
};



async function createCheckoutSession(amount:number, userName:string, characterName:string){  
    const checkoutSession = await stripe.checkout.sessions.create({
        line_items: [
            {
              price_data:{
                currency:"USD",
                product_data:{
                  name:"Big L Fundraiser"
                },
                unit_amount:Math.round(amount*100),
              },
              quantity: 1,
            },
          ],
        mode: 'payment',
        success_url: `https://${PUBLIC_DOMAIN}/payment/success`,
        cancel_url: `https://${PUBLIC_DOMAIN}/`,
        metadata:{
            "user_name":userName,
            "character_name":characterName,
        }
    });
  
    if(checkoutSession.url==null){
        throw new Error("Something went wrong. Please try again later!")
    }

    
    return checkoutSession
}


async function getLandingPageData():Promise<LandingPageData>{
    const response = await fetch(`${PRIVATE_SERVER_URL}/api/landing-page?character_name=${characterName}`)
    if(!response.ok){
        throw error(500, "Failed to load the page. Please try again later")
    }
    return await response.json()
}