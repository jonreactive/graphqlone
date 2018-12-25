const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull

 } = require('graphql');

 /*

 To add to the data.json server get into http://localhost:4000/graphql?

 mutation{
   addCustomer(name:"miso miow", email:"misothecat@gmail.com", age: 4) {
     id
   }
 }


 To delete from the data.json server , get into http://localhost:4000/graphql?
  mutation{
  deleteCustomer(id:"(enter id number)"){
    id
  }
}

*/




// Hard Coded Customer Data Test, loop through is below

// const customers = [
//   {id: '1', name: 'John Does', email: 'thisguy@mail.com', age: 35},
//     {id: '2', name: 'Steve Do', email: 'this@mail.com', age: 15},
//       {id: '3', name: 'Miso', email: 'misouy@mail.com', age: 5},
// ];



// Cutomer type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: {type:GraphQLString},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    age: {type: GraphQLInt}
  })
});

// ROOT Query

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {type:GraphQLString}
      },
      resolve(parantValue, args){

        return axios.get('http://localhost:3000/customers/'+ args.id)
                     .then(res => res.data);

        // looping through the hard coded data above to test const customers.
        // for(let i = 0; i < customers.length; i++ ){
        //   if(customers[i].id == args.id) {
        //     return customers[i];
        //   }
        // }
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parantValue, args){
        return axios.get('http://localhost:3000/customers/')
                     .then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType ({
  name: 'mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
      resolve(parentValue, args){
        return axios.post('http://localhost:3000/customers', {
          name: args.name,
          email: args.email,
          age: args.age

        })
        .then(res => res.data)
      }
    },
    deleteCustomer:{
            type:CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/customers/'+args.id)
                .then(res => res.data);
            }
        },

  }
})

 module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation
 });
