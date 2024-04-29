import Stripe from 'stripe';
import {PRIVATE_STRIPE_KEY} from '$env/static/private';

export let stripe  = new Stripe(PRIVATE_STRIPE_KEY, {
    apiVersion: '2024-04-10',
});