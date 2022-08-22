const loan = require('../models/loanModel')


const  getAllLoan = async (req,res,next) => {
  try{
      const result = await loan.find().lean()
      return res.json(result)
  } catch (err){
    return next(err)
  }
     
}

module.exports= {
  getAllLoan
}
