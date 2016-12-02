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
define(['lodash', 'log'], function (_, log) {

    var ReturnStatement = function (expression) {
        this._expression = expression || [];
    };

    ReturnStatement.prototype = Object.create(ASTNode.prototype);
    ReturnStatement.prototype.constructor = ReturnStatement;

    ReturnStatement.prototype.setReturnExpression = function (expression) {
        if (!_.isNil(expression)) {
            this._expression = expression;
        } else {
            log.error("Cannot set undefined to the return statement.");
        }
    };

    ReturnStatement.prototype.getReturnExpression = function () {
        return this._expression;
    };

    ReturnStatement.prototype.accept = function (visitor) {
        visitor.visitReturnStatement();
        //loop accept methods of children if exists
    };

    return ReturnStatement;
});