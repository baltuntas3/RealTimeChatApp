module.exports= function buildAnSuccessMessage(message){
    
    const now= Date.now();
    const timestamp = new Date(now);
    const successMessage={
        timestamp,
        message
    }
return successMessage

}



