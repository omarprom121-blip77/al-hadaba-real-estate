import {MongoClient} from 'mongodb';
const uri=process.env.MONGODB_URI;
if(!uri) throw new Error('MONGODB_URI is not configured');
let client; let promise;
if(process.env.NODE_ENV==='development'){if(!global._mongoPromise){client=new MongoClient(uri);global._mongoPromise=client.connect()}promise=global._mongoPromise}else{client=new MongoClient(uri);promise=client.connect()}
export default promise;