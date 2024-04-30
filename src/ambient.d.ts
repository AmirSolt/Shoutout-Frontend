

interface PostDate {
    year:number
    month:number
    day:number
}

interface Order{
    tierID:string
}

interface QueueCount {
    [productID:string]:number
}

interface Product {
    id:string
    name:string
    price:number
    thumb_url:string
    description:string
    currency:"USD"
    queueCount:number
    queueCountMax:number
}

interface ServerClientResponseError {
    url:           string,     
    status:        number,    
    response:      {code: string, message:string, data:any},    
    isAbort:       boolean,    
    originalError: Error|null, 
}