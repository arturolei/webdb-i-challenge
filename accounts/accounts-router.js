const router = require('express').Router();

const db = require('../data/dbConfig.js');


router.get('/', async (req, res) => {
    try {
        const accounts = await db('accounts');
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({message:"error getting accounts", error:error})
    }
    
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const account = await db('accounts').where({id});
        if (account.length) {
            res.status(200).json(accounts);
          } else {
            res.status(404).json({ message: 'Could not find account with given id.' })
          }
    } catch (error) {
        res.status(500).json({ message: 'Failed to get Account' });
    }

});

router.post('/', validateAccount, async (req, res) => {
    const accountData = req.body;

    try {
        const  account = await db('accounts').insert(accountData);
        res.status(201).json(account);
    } catch (error){
        res.status(500).json({message:"Can't create Account", error: error});
    }

});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    try {
        const count = await db('accounts').where({id}).update(changes);
        if(count){
            res.status(200).json({message: `${coount} record(s) updated!`});
        } else {
            res.status(404).json({message: "Account does not exist"});
        }
    } catch (error) {
        res.status(500).json({message:"Can't update Account"});
    }

});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const deletedCount = await db('accounts').where({id}).del();
        if(deletedCount){
            res.status(200).json({message: `${deletedCount} record(s) deleted.`});
        } else {
            res.status(404).json({message:"Can't delete something that ain't thar"});
        }
    } catch (error){
        res.status(500).json({message: "Nope, no deleting today", error:error});
    }
});

//MiddleWare for Testing Validity of Accounts Object
function validateAccount(req, res, next) {
    if(!req.body){
        res.status(404).json({message:"Empty object; can't work with nothing"})
    }
    else if (!req.body.name || !req.body.budget || typeof req.body.budget !== 'number') {
        res.status(404).json({message:'Account name or budget description is missing or badly formatted'});
    } else {
        next();
    }
};

module.exports = router;