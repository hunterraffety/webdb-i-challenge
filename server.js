// dependencies
const express = require('express');

// database stuff
const budget = require('./data/dbConfig.js');

// express
const server = express();

server.use(express.json());

// create
server.post('/', (req, res) => {
  const account = req.body;

  budget('accounts')
    .insert(account, 'id')
    .then(arrayOfIds => {
      const lastId = arrayOfIds[0];
      res.status(201).json(lastId);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// read
server.get('/', (req, res) => {
  budget('accounts')
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// read specific
server.get('/:id', (req, res) => {
  const { id } = req.params;
  budget('accounts')
    .where({ id: id })
    .first()
    .then(account => {
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ message: `Account ${id} not found.` });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// update
server.put('/:id', (req, res) => {
  const { id } = req.params;
  const account = req.body;

  budget('accounts')
    .where({ id: id })
    .update(account)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} record(s) modified.` });
      } else {
        res.status(404).json({ message: `Account ${count} was not found.` });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// delete
server.delete('/:id', (req, res) => {
  const { id } = req.params;
  budget('accounts')
    .where({ id: id })
    .delete()
    .then(count => {
      res.status(200).json({ message: `${count} deleted.` });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = server;
