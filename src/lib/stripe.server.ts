import Stripe from 'stripe';
// import {PRIVATE_STRIPE_KEY} from '$env/static/private';

export const stripe  = new Stripe("tsadsd", {
    apiVersion: '2023-10-16',
});