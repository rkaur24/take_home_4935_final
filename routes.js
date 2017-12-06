const Boom = require('boom');
const Joi = require('joi');
const monk = require('monk')
require('dotenv').config()

// get the DBURL value 
const db = monk(process.env.DBURL)
// get or create a collection in mongo
const todo = db.get('todo')

module.exports = [
//todo routes
{
   "method": 'GET',
    "path": '/todo/',
    handler: async (request, reply) => {
      let docs = await todo.find({});
        return docs
    }
},
{
  "method"  : "GET",
  "path"    : "/{todo?}",
  "handler" : async (request, reply) => 
  {
    if(request.path == '/todo')
    {
    	var item = request.query.listItem
      var result= todo.find({listItem : {$regex : item,$options:"$i"}})
      return result
    }  
    //wrong address
    else
      return "Record Not Found. Check your query"
  }
},
{
  "method"  : "POST",
  "path"    : "/todo/",
  "handler" : async (request, reply) => 
  {
    todo.insert(request.payload);
    return request.payload;
  },
  config: 
  {
    validate: {
    payload: {
    listItem: Joi.string().min(5).max(50).required()
    }
    }
  }
 },
 {
    "method"  : "PATCH",
    "path"    : "/todo/{id}",
    "handler" : async (request, reply) => 
    {
      todo.update({
      _id: request.params.id
      }, {
      $set: request.payload
      }, function (err, result)
      {
        if (err) {
          return Boom.wrap(err, 'Internal database error');
        }

        if (result.n === 0) {
          return Boom.notFound();
        }

      });
      return 'List Item Record Updated Successfully';
    },
  config: 
  {
    validate: {
    payload: {
    listItem: Joi.string().min(5).max(50)
    }
    }
  }
},
{
  "method"  : "DELETE",
  "path"    : "/todo/",
  "handler" : async (request, reply) => 
  {
    todo.remove({}, function (err, result) 
    {
      if (err) {
        return Boom.wrap(err, 'Internal database error');
      }
      if (result.n === 0) {
         return Boom.notFound();
      }
    });
    return 'ToDo List Record Removed Successfully';
  }
}

]