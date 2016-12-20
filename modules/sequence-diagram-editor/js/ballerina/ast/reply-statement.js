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
define(['lodash', 'log', './statement'], function (_, log, Statement) {

    /**
     * Class for reply statement in ballerina.
     * @param message expression of a reply statement.
     * @constructor
     */
    var ReplyStatement = function (message) {
        Statement.call(this);
        this._message = message;
    };

    ReplyStatement.prototype = Object.create(Statement.prototype);
    ReplyStatement.prototype.constructor = ReplyStatement;

    ReplyStatement.prototype.setReplyMessage = function (message) {
        if (!_.isNil(message)) {
            this._message = message;
        } else {
            log.error("Cannot set undefined to the reply statement.");
        }
    };

    ReplyStatement.prototype.getReplyMessage = function () {
        return this._message;
    };

    return ReplyStatement;
});