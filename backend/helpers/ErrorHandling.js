module.exports= function buildAnErrorMessage(message,subErrors=[]){
    
        const now= Date.now();
        const timestamp = new Date(now);
        const errorMessages={
            timestamp,
            message,
            subErrors
        }
    return errorMessages
    
}



