import PocketBase from 'pocketbase';
import {PRIVATE_SERVER_URL, PRIVATE_SERVER_EMAIL, PRIVATE_SERVER_PASSWORD} from '$env/static/private';


export let pb = new PocketBase(PRIVATE_SERVER_URL)
pb.autoCancellation(false)
await pb.admins.authWithPassword(PRIVATE_SERVER_EMAIL, PRIVATE_SERVER_PASSWORD, {
	autoRefreshThreshold: 30 * 60
});
