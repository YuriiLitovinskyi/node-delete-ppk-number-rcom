const MongoClient = require('mongodb').MongoClient;
const prompts = require('prompts');

const url = 'mongodb://localhost:27017/DBClientsPPK';

(() => {
    MongoClient.connect(url, async (err, db) => {
        if(err) {            
            console.log('No connection to Database! Please start MongoDB service on default port 27017!\n');                       
            
            console.log(err);
            await sleep(10000);           
        } else {
            console.log('Connected to database successfully!\n'); 

            (async () => {            
                const response = await prompts({
                    type: 'number',
                    name: 'value',
                    message: 'Enter ppk number to delete: ',
                    //validate: value => value <= 0 || value > 1000 ? `Please enter a valid number from 1 to 1000` : true
                  });
    
                  deletePpk(db, response.value);
            })();
        };       
    });
})();


const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);        
    });
};

const deletePpk = (db, ppkNum) => {
    db.collection('ppkState', async (err, collection) => {
        if(err) {
            console.log(err);
            db.close();
            await sleep(10000);
        };

        const ppkCount = await collection.find({ ppk_num: ppkNum }).count();
        
        if (ppkCount === 0){
            console.log(`Ppk number ${ppkNum} wasn't found in database... `);
            db.close();
            await sleep(5000);
        } else {
            collection.remove({ ppk_num: ppkNum }, async (err, result) => {
                if(err) {
                    console.log(err);
                    db.close();
                    await sleep(10000);
                };
    
                console.log(`ppk ${ppkNum} was removed from database successfully: ${result}`);
                db.close();
    
                await sleep(5000);
            });
        };      
    });
};

