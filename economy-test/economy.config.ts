/**
 * @type {import("./mongodb/EconomyItems")}
 */
 import { EconomyConfiguration } from '../mongodb/EconomyItems'

 export = {
     // storagePath: './eco.json',
 
     connection: {
         // connectionURI: 'mongodb+srv://replit:replit@cluster0.5nbla.mongodb.net/test',
         // connectionURI: 'mongodb://sviinka:hannelbannel123@backupbot-shard-00-00.ehpa9.mongodb.net:27017,backupbot-shard-00-01.ehpa9.mongodb.net:27017,backupbot-shard-00-02.ehpa9.mongodb.net:27017/test?ssl=true&replicaSet=BackupBot-shard-0&authSource=admin&retryWrites=true&w=majority'

         connectionURI: 'mongodb://user:hannelbannel123@ac-s2jrfjk-shard-00-00.lame8ex.mongodb.net:27017,ac-s2jrfjk-shard-00-01.lame8ex.mongodb.net:27017,ac-s2jrfjk-shard-00-02.lame8ex.mongodb.net:27017/?ssl=true&replicaSet=atlas-12href-shard-0&authSource=admin&retryWrites=true&w=majority',
         collectionName: 'economyTest',
         dbName: 'test'
     },
 
    //  debug: true,
    //  dailyAmount: 1000000,
 
    //  updater: {
    //      checkUpdates: false
    //  },
 
    //  optionsChecker: {
    //      ignoreInvalidOptions: false,
    //      showProblems: true,
    //      sendLog: true,
    //      sendSuccessLog: true
    //  }
 } as EconomyConfiguration
 
// export default options
 