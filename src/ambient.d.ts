

interface PostDate {
    year:number
    month:number
    day:number
}

interface Order{
    tierID:string
}

interface Transaction{
    userName:string
    date:Date
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