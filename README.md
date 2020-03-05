# event-listener-test

This project contains a chaincode and an accompanying event listener. It is meant to demonstrate the high-level fabric-network event listener apis, which also support "checkpointers" to easily replay missed events.

The chaincode contains a single contract with two types of events emmitted: "CreateChair" and "UpdateChair". In the event-listener project, an event listener is added to the contract/chaincode for each type of event. Each contract/chaincode event listener uses a File System checkpointer to record which blocks have been processed. This means that if the event listener goes down, when it starts back up, it will check the checkpointer and replay any events that happened while the event listener was down.

To test (**Done through local VS Code extension network**):

1. Deploy the specified chaincode
2. Export the file system wallet from the VS Code extension and drop it into the event-listener project
3. Export the connection profile from the VS Code extension and drop it into the event-listener project
3. Update the following fields in event-listener/event-listener.js if they are different:

```
const connectionProfile = require('./ccp.json'); // path to connection profile exported from VS Code

const walletIdentity = 'org1Admin'; // wallet identity in the wallet exported from VS Code

const walletPath = './Org1'; // path to file system wallet exported from VS Code

const checkpointerBasepath = '/Users/ednamorales/dev/blockchain/event-listener-test/event-listener/checkpointer'; // path to file system checkpointer - can be anything as long as it's an absolute path

const channelName = 'mychannel';
```

4. Start the event listener
```
cd event-listener
npm i
npm start
```

5. Invoke `createChairs` transaction followed by an `updateChairs` transaction. See events come in through the event listener logs. You should also see checkpointer files created wherever you specified `checkpointerBasePath`.

6. Stop the event listener

7. Invoke `createChairs` transaction again followed by another `updateChairs` transaction

8. Start the event listener once again after the transactions from step 7 have completed

9. See the events from step 7 come in through the logs at event listener start up

Note: File System Checkpointer is only for Proof of Technology. A custom checkpointer should be built using some persistent storage like a database.

More info:

https://hyperledger.github.io/fabric-sdk-node/release-1.4/tutorial-listening-to-events.html

https://hyperledger.github.io/fabric-sdk-node/release-1.4/tutorial-event-checkpointer.html
