
const item = require('../models/itemModel');
const loan = require('../models/loanModel');
const user = require("../models/userModel");
const Arweave = require('arweave');
var mongoose = require('mongoose');


const itemGetHandler = async (req,res,next) => {
  if (req.query.all && req.query.all.toString() == 1) {
    getAllItems(req, res, next);
  }
  else if (req.query._id) {
    getSpecificItem(req, res, next);
  }
  else if (req.query.category) {
   
    getAllItemsbyCategory(req, res, next);
  }

  else if (req.query.item_owner) {
    getAllItemByItemOwner(req,res,next);
    
  }
}

const itemPostHandler = async(req,res,next) => {
  createItem(req,res,next)
}

const itemPutHandler = async(req,res,next) => {
  editItem(req,res,next)
}
const itemDeleteHandler = async(req,res,next) => {
  deleteItem(req,res,next)
}


const  getAllItems = async (req,res,next) => {
  try{
      const result = await item.find().lean()
      if ((result.length) > 0) {return res.json(result)}
      else {res.status(400)}
  } catch (err){
    return next(err)
  }
     
} 

const  getSpecificItem = async (req,res,next) => {
  try{
    
    const result = await item.findById(req.query._id).lean()
    if (!result) {return res.status(400)}
    
    return (res.json(result))
} catch (err){
    return next(err)
  }
}

const getItemLoanFrequency = async(req,res,next) => {
  try{
    const result = await item.findById(req.query._id).lean()
    if (!result) {return res.status(400)}
    return res.json(result.loan_frequency)
  } catch (err){
    return next(err)
  }
}

const getAllItemsbyCategory = async (req,res,next) => {
  try{
    
    const result = await item.find({category: req.query.category}).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}

const getAllItemByItemOwner = async (req,res,next) => {
  try{
    itemOwner = new mongoose.Types.ObjectId((req.query.item_owner).toString())
   
    const result = await item.find({item_owner: itemOwner }).lean()
    if (!result) {return res.status(400)}
    return res.json(result)
} catch (err){
    return next(err)
  }
}


const createItem = async (req,res,next) => {
  try{
    const itemName =req.body.item_name;
    const category =req.body.category;
    const description = req.body.description;
    const itemOwner = new mongoose.Types.ObjectId(req.body.item_owner);
    itemObject = {item_name: itemName,
      category: category,
      description: description,
      item_owner: itemOwner,
      being_loaned: false,
      loan_frequency: 0
    }
    if (req.body.image_enc) {
      imageUrl = await imageUpload(req.body.image_enc.toString());
      itemObject["image_url"] = imageUrl
    }
    const itemResult = await item.create(itemObject)
  
    if (!itemResult) {return res.status(400)}
    return res.json(itemResult)
  } catch (err){
    return next(err)
  }
}



const editItem = async (req,res,next) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.body._id)
    const query = {_id: _id}
    const update = {}
    
    if (req.body.item_name) {
      update["item_name"] = req.body.item_name
    }
    if (req.body.category) {
      update["category"] = req.body.category
    }
    if (req.body.description != null) {
      update["description"] = req.body.description
    }
    if (req.body.item_owner) {
      update["item_owner"] = new mongoose.Types.ObjectId(req.body.item_owner)
    }

    if (req.body.being_loaned) {
      update["being_loaned"] = req.body.being_loaned
    }
    if (req.body.image_enc) {
      image_url = await imageUpload(req.body.image_enc.toString());
      update["image_url"] = image_url
    }

    const result = await item.findOneAndUpdate(query, update, {returnDocument:'after'});
    if (!result) {return res.status(400)}
    return res.json(result)
  }
  catch (err){
    return next(err)
  }
}

const deleteItem = async (req, res, next) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.query._id);
    const loanAssociated = await loan.find({item_id:_id}).lean();
    if (!loanAssociated){
      const deleteResult = await item.deleteOne({_id: _id});
    if (!deleteResult) {return res.status(400)}
    return res.json(deleteResult)

    }else{
      return res.status(400).json({message: "Item is currently being loaned and cannot be deleted"})

    }
   
  }
  catch (err){
    return next(err)
  }
}

async function imageUpload (imageString) {
  const buf = Buffer.from(imageString, 'base64')
  const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
  });
  const arweaveKey = {"kty":"RSA","n":"ozG3cXlMGJIWeXZ86wrb5uyp19TaOB_by-QJAEUnzRuUeAi2OYgY4k2NidgQfI35uwIlzU638rqrqKaBik7ZC6S4CUqL8Zmy-2M0_iITCTYHscbylrQhHInlovlp1Qp_q3PreIwZc3eT5eMxMQ-QqWmX_I2FkMqcN9U-iOHia5kYS8ZoPiBJszJIcpuvc2O6f71RDohlnppg6OyQuuS6HQAyQSM20F8n9njdK0KIhe6EohLzS1PwCBAWGhRBOJBef_83cq__r-kk4D4ImOs-2SDZqSod39WiRSgMYgfY6cPKsUBXtzasvqKhU9OyK7bjrqkzabGdKxqAOIee2KEbJXlKBP0mTJv7e54GwiJxxK0hepT5WfTqkfmvbdDcecNoNdaipnDEq3HAnXc0J68u_L6cs6ZbaQYxZ_e53ShV6NJXfe4LMANo3QXWdb1pKpGUycfTges6y6cq261JZPtNnCjc11vEWnaZvBEB2c_YqgHacNiCr4EjB2CQrZVMuISykufHl3urYj6IPlfqMUS8oqteGilp5ZNmJEKmZ-BAdAZkqARCmGdRSH8bgl_OSCSw-ozaCF3JpXeNYOQTN23HcptPwmbiO3jIyZ51SWPyGv6BFY3_kfNf6xpbfKhL0SWJFHHVM7LEY42FBJAEukoPkgkaUgtqcnqQ0wg7x6kWtwM","e":"AQAB","d":"Y7dkPNz-J2FUhEFnUQNgnPjtSulPsc2dszcSXOzkxgpdLP89wWestNLoclrosALcnm1QhePcuF9htnqPWuCU9O1gWqUHX8gnuj3DSqmtcgpmpzVGU9mbBeIow-2cwkVY_32kWxNYFdryLx0kmLLHFQ1lhjc_btqum9scC-3iORbh5qNEXPnDrtBBvm3sxhghBB684aFsXn48SvcJ9HkAU-ojyvNmcepC8_KkSeOsohG9T38-1D9kwrh5mNPZimOEqrdavSRXmrheBPtCq5XK4EeXWCtY98WFErbG4jujSiuNtcL4FgY9hXrAEwWer-FfvAC9Xo7d11GpGWGdKQdAGyqqMttAE0VZCpANh41Y1Up70Yf32DDO5j9zesiyNDHhwTfjWMtGRbFLpk1FtdcZZur6w2wg0Ro7DEySecDwXcsGE8jU8fP_fK3tTpRH27sT1FdAp6AIkVltzWlIjcHjTdOqTVPdWXV2rb-3MFm55HRimL14QyeFkYed9ln9XPH6fPzFgNP9xeU9saGK0sE8CJJiTaKm42Llfu7i93d-EpCHVTZt9hH25najtJCM1nbVQJnizHVXMxorG8FssMpINrzzeV1yz8Q1zSDjtd4SCkLdsny1m8YRdMzongAU09cCuiLlBcxNuj4110KIPKja84T-u8BP38OY-0Xjsh3--7E","p":"1swBAz3q_ci0eA7CLZKgIdesZw5k0FP30QBSpNUvMEet3dkeDWF8Mf5ERTIfPyixM9Pvn8rr26AQFYwfa89DRx6PJvCsIo6p9bYKWNR0cTlRVQ9IyB0HAyuDkXQkxwr2UoIRWiysEzqdoiXiKAfp8uvywVbUr70KkoF6Gwgc7CNXInf9JVTES6mUq8JPURqP7MGWjOSygIld7P0qsrPmSaQVQm3wq3f6I7-OtYVztbdTo6_Qkvk397uQVWWad-rhKl6ajGdZx8RWizjN-L41gr4bCzpHbCEcnbowvYPkMLMBiJu_FPcEGLxaq1wFXjCteXRVmZkdqqvoen7FBtlomQ","q":"wn-q_ej6mf8MQqcWrWdrqXy6-65DZKMjW-_YOA9QonHPBHNT6X7O37R9y29tDH_zOrxME_zfAgYKZhH0t-Px7DB4SaI3dyhAVpT1CF5FLBqMgidtdTlqIZo0X1QYvQ9FR9HYkEAFXQ-cM9-KYkD0pM-IB-lifnDRDSWYZRCb7rz5Z8SrqJqCY6Q7u93NBXHfaFxEKb8zgoAx98bmO5jT1kXiV72tH5byLO78L2Y8lLHQMDMBf0quU4-SqKSVya_wlzbi65epILV6G_UDFp0Zyj1xfb0pq9yjtC5PSBqxnOzTLvz2XN37-mSbVz2TJ2pwZDA-t_L-zn7tGu-8t7MR-w","dp":"ZXpH2DI-fNt_d2Dxl_o3sQVlq-J--nVRFOqkIL-e5Z5XpAHZUtUFidDojBBb9sjQvv2XrdR-jWoXbzad-Z8X19e2Jd16VXE1FqKETOdCg-Nia18nMXOVRogeRm-qmGazbNOKQyHrwcHlix9-sw7aFiwmqfTN0qDrB8An4fF5SI6BsgUiEar0ehKJ7IOGWXjFGkNzTukU8-jx-O66Z2bam1vrt1CdbUTnZlAvqc58lhMgbqq3TVh0epOgYtf3nEPZUN0VAtQo9Fnr0SZrGOM0AKqzuCA2cf1KubGnKUHQYrmPNezu34a75rvF0kNNPeydaE3vyvstqt5AnO6bQtsfsQ","dq":"aARxBRPZGgyNmQPVG-2oZV8gfMMopaSdn2h4wRpnrEijRyUKZmB78KWNdQPlVP8ErI_RPAtLlMB4RTgrIUFVu1P8sJyBf0dWiTdmiBAqfDjClkTRxBRtjwTyJ11JUareCVfPsu2aMLfNeOx_DKbib1XR0TFejHJ3SsmlY79rNVV5KKbEiwn-250UmRc4s0XADgbyKUVpHczDbFjB_nNwLzL2pqf482D9qUwyMINDuN4TkgNlNJdS_btV2r0Somdmiug-mXJlb-m-IT96ZFimV0Ne87j7lT8NiaoOmmg0PtFk68c7VlUdkj7F2PVEQpso-lvW3vekj_jPg01dJv0siw","qi":"OTKNEGqWxpwpbOPChmj8PtLKus9Kflp0tJ7BSnI8CkQUPuy4k1F1AUDW1XjRHa6001K--LjA8_4lfmNM-4awylpom24aFdjMvfSJ-HjdpDoj_5exYQLWhZ7o-ysihkAJ-enhFRmeiF3jKrfwkHkvNsj28Tl_9TI80FLAC3QrHllQfXX6iErQ4C17qNt9GBgQJPbyxlQaQ-TJ1ivz2nXm5XTbzf38ZpBJzEc2GdtLBwmM2c4VXSPGBKXq8HW5W1ctJKFPUUdvtJzRndyNvUu1Ykr1zrGs8ZPABzwRGyURpurhSLSrmWUurM0S9GWz3MZL9eRbQd1ZDxPe0Rz3WatdUw"}
  const arWeaveWallet = await arweave.wallets.jwkToAddress(arweaveKey);
  const arweaveWalletBalance = await arweave.wallets.getBalance(arWeaveWallet);

  let transaction = await arweave.createTransaction({data:buf}, arweaveKey);
  transaction.addTag('Content-Type', 'image/png');
  await arweave.transactions.sign(transaction, arweaveKey);
  const response = await arweave.transactions.post(transaction);
  const status = await arweave.transactions.getStatus(transaction.id);
  console.log(`Completed transaction ${transaction.id} with status code ${status}!`)

  console.log(`Our url is https://www.arweave.net/${transaction.id}?ext=png`)
  return `https://www.arweave.net/${transaction.id}?ext=png`
}




module.exports= {
  itemGetHandler,
  itemPostHandler,
  itemPutHandler,
  itemDeleteHandler,
}



