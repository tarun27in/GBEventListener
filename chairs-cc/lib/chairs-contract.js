/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ChairsContract extends Contract {

    async chairsExists(ctx, chairsId) {
        const buffer = await ctx.stub.getState(chairsId);
        return (!!buffer && buffer.length > 0);
    }

    async createChairs(ctx, chairsId, value) {
        const exists = await this.chairsExists(ctx, chairsId);
        if (exists) {
            throw new Error(`The chairs ${chairsId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(chairsId, buffer);
        ctx.stub.setEvent('CreateChair', Buffer.from(JSON.stringify({
            chairsId
        })));
    }

    async readChairs(ctx, chairsId) {
        const exists = await this.chairsExists(ctx, chairsId);
        if (!exists) {
            throw new Error(`The chairs ${chairsId} does not exist`);
        }
        const buffer = await ctx.stub.getState(chairsId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateChairs(ctx, chairsId, newValue) {
        const exists = await this.chairsExists(ctx, chairsId);
        if (!exists) {
            throw new Error(`The chairs ${chairsId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(chairsId, buffer);
        ctx.stub.setEvent('UpdateChair', Buffer.from(JSON.stringify({
            chairsId
        })));
    }

    async deleteChairs(ctx, chairsId) {
        const exists = await this.chairsExists(ctx, chairsId);
        if (!exists) {
            throw new Error(`The chairs ${chairsId} does not exist`);
        }
        await ctx.stub.deleteState(chairsId);
    }

}

module.exports = ChairsContract;
