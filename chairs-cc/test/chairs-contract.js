/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { ChairsContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('ChairsContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new ChairsContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"chairs 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"chairs 1002 value"}'));
    });

    describe('#chairsExists', () => {

        it('should return true for a chairs', async () => {
            await contract.chairsExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a chairs that does not exist', async () => {
            await contract.chairsExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createChairs', () => {

        it('should create a chairs', async () => {
            await contract.createChairs(ctx, '1003', 'chairs 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"chairs 1003 value"}'));
        });

        it('should throw an error for a chairs that already exists', async () => {
            await contract.createChairs(ctx, '1001', 'myvalue').should.be.rejectedWith(/The chairs 1001 already exists/);
        });

    });

    describe('#readChairs', () => {

        it('should return a chairs', async () => {
            await contract.readChairs(ctx, '1001').should.eventually.deep.equal({ value: 'chairs 1001 value' });
        });

        it('should throw an error for a chairs that does not exist', async () => {
            await contract.readChairs(ctx, '1003').should.be.rejectedWith(/The chairs 1003 does not exist/);
        });

    });

    describe('#updateChairs', () => {

        it('should update a chairs', async () => {
            await contract.updateChairs(ctx, '1001', 'chairs 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"chairs 1001 new value"}'));
        });

        it('should throw an error for a chairs that does not exist', async () => {
            await contract.updateChairs(ctx, '1003', 'chairs 1003 new value').should.be.rejectedWith(/The chairs 1003 does not exist/);
        });

    });

    describe('#deleteChairs', () => {

        it('should delete a chairs', async () => {
            await contract.deleteChairs(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a chairs that does not exist', async () => {
            await contract.deleteChairs(ctx, '1003').should.be.rejectedWith(/The chairs 1003 does not exist/);
        });

    });

});