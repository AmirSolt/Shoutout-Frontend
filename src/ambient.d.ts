

interface PostDate {
    year:number
    month:number
    day:number
}

interface Order{
    tierID:string
}

interface Transaction{
    user_name:string
    created:string
    amount:number
}

interface LandingPageData{
    total_raised:number
    highest_transactions:Transaction[]
    recent_transactions:Transaction[]
}

interface ServerClientResponseError {
    url:           string,     
    status:        number,    
    response:      {code: string, message:string, data:any},    
    isAbort:       boolean,    
    originalError: Error|null, 
}