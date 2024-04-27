


export const load = async () => {
    
    return {
        queueCount:7
    }
};

export const actions = {
    default:async({request})=>{
        const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

        // queue count
        const queueCount = 7
        if(queueCount>10){

        }

    }
};