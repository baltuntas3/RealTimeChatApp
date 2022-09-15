const errorMessage= require('../helpers/ErrorHandling')

module.exports = class Service {
    async findAll() {
      return this.model.find()
    }
  
    async add(item) {
        return this.model.create(item)        
     
    }
  
    async  del(itemId) {
      return this.model.remove({ _id: itemId })
    }
  
    async find(itemId) {
      try {
        return this.model.findById(itemId)
      } catch (error) {
        return errorMessage(error.message)
      }
    }
    //This function in the wrong place
    async findByUserName(username) {
      return this.model.findOne({userName:username})
    }

    async query(object){
      try {
        return this.model.find(object)
      } catch (error) {
        throw errorMessage(error.message)
      }
    }

    async queryOne(object){
      return this.model.findOne(object)
    }
    
    async update(itemId,set) {
      return this.model.update(itemId,set,{upsert:true})
    }

    handleError(message){
      return errorMessage(message)
    }
}
  