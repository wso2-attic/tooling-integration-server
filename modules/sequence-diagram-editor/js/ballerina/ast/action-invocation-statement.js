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
define(['lodash', 'log', './statement', './expression'], function (_, log, Statement, Expression) {

    /**
     * Class to represent a action invocation to ballerina.
     * @param args
     * @constructor
     */
    var ActionInvocationStatement = function (args) {
        this._connector = _.get(args, 'connector');
        this._action = _.get(args, 'action');
        Statement.call(this, args);
    };

    ActionInvocationStatement.prototype = Object.create(Statement.prototype);
    ActionInvocationStatement.prototype.constructor = ActionInvocationStatement;

    ActionInvocationStatement.prototype.setConnector = function(connector){
        if(!_.isNil(connector)){
            this._connector = connector;
        }
    };

    ActionInvocationStatement.prototype.getConnector = function(){
        return this._connector;
    };

    ActionInvocationStatement.prototype.setAction = function(action){
        if(!_.isNil(action)){
            this._action = action;
        }
    };

    ActionInvocationStatement.prototype.getAction = function(){
        return this._action;
    };

    return ActionInvocationStatement;

});