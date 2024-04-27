import PocketBase from 'pocketbase';
import {PRIVATE_SERVER_URL} from '$env/static/private';


export const pb = new PocketBase(PRIVATE_SERVER_URL);