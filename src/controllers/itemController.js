const item = require('../models/itemModel')


const  getAllItem = async (req,res,next) => {
  try{
      const result = await item.find().lean()
      return res.json(result)
  } catch (err){
    return next(err)
  }
     
}



module.exports = {
  getAllItem
}
