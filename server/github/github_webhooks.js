// external dependencies
import {Router} from 'express';
const _ = require('lodash');
const express = require('express');
const events = require('events');

// internal dependencies
const config = require('./../config');
const githubWebhookMappings = require('./github.mappings.json');


const router = Router();
/**
 * Supported events:
 *   - error
 *   - raw
 *   - every event listed in 'mappings.json' (see README.md)
 */
var GitHubWebhooks = {

  // internal properties
  _events: new events.EventEmitter(),

  attachServer: function(http) {
    this._server = http;
    this._server.post('/' + config.git_subpath, GitHubWebhooks._retrievePostedWebhookData
      .bind(GitHubWebhooks));
  },

  _retrievePostedWebhookData: function(req, res) {
    // pull the data out of the request as its received

    res.status(200).end();
    let body = req.body;
    if (!req.body) {
      this._events.emit('error', 'cannot parse body');
    } else {
      this._events.emit('raw', body);
      this._processWebhook(body);
    }
  },

  _processWebhook: function(data) {
    var expectedProperties;
    var optionalDifference;
    var symmetricalDifference;
    var receivedProperties = _.keys(data);

    // determine the type of hook we're processing and then emit an event for
    // that hook if it has a symmetrical difference of 0
    _.each(_.keys(githubWebhookMappings), function(webhookName) {
      expectedProperties = githubWebhookMappings[webhookName];

      // compare the expected properties with the properties of the data we
      // received, looking for a symmetrical difference of 0
      symmetricalDifference = _.xor(expectedProperties.required,
        receivedProperties);

      // also, compare the symmetrical difference with the optional properties
      optionalDifference = _.difference(symmetricalDifference,
        expectedProperties.optional);

      if (symmetricalDifference.length === 0) {
        // we found an expected webhook with the same properties, emit an event
        this._events.emit(webhookName, data);
      } else if (expectedProperties.optional.length > 0 &&
        optionalDifference.length === 0) {
        // the symmetrical differences were all listed within the optional
        // properties
        this._events.emit(webhookName, data);
      }

      // if there WAS a symmetrical difference (something other than 0), it
      // means: "this is not the droid you're looking for", so we move on to
      // the next webhook
    }.bind(this));

    // it is possible to reach this far and not have emitted any events. if the
    // event you're looking for is not listed in the `mappings.json` file, 
    // you'll want to hook into the "raw" event and duck-punch the properties
    // yourself
  },

  on: function(event, callback) {
    return this._events.on(event, callback);
  }

};

// expose the function object
exports = module.exports = GitHubWebhooks;