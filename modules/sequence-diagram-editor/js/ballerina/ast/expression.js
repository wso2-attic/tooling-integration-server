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
define(['lodash', './node'], function(_, ASTNode){

    var Expression = function(args) {
        this._expression = _.get(args, 'expression', 'defaultExp');
    };

    Expression.prototype = Object.create(ASTNode.prototype);
    Expression.prototype.constructor = Expression;

    Expression.prototype.setExpression = function (expression) {
        if(!_.isUndefined(expression)){
            this._expression = expression;
        }
    };

    Expression.prototype.getExpression = function () {
        return this._expression;
    };

    return Expression;
});
