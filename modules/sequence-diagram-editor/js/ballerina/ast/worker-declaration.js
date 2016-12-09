/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
define(['lodash', './node'], function (_, ASTNode) {

    var WorkerDeclaration = function (args) {
        this._isDefaultWorker = _.get(args, "isDefaultWorker", false);
        this._reply = _.get(args, "replyStatement", null);
        this._childrenList = [];

        ASTNode.call(this);
    };

    WorkerDeclaration.prototype = Object.create(ASTNode.prototype);
    WorkerDeclaration.prototype.constructor = WorkerDeclaration;

    WorkerDeclaration.prototype.addChild = function (child, index) {
        if (_.isUndefined(index)) {
            this._childrenList.insert(index, child)
        } else {
            this._childrenList.push(child);
        }
    };

    WorkerDeclaration.prototype.setReply = function (replyStatement) {
        if (!_.isNil(replyStatement)) {
            this._reply = replyStatement;
        }
    };

    WorkerDeclaration.prototype.setIsDefaultWorker = function (isDefaultWorker) {
        if (!_.isNil(isDefaultWorker)) {
            this._isDefaultWorker = isDefaultWorker;
        }
    };

    WorkerDeclaration.prototype.getReply = function () {
        return this._reply;
    };

    WorkerDeclaration.prototype.isDefaultWorker = function () {
        return this._isDefaultWorker;
    };

    return WorkerDeclaration;
});