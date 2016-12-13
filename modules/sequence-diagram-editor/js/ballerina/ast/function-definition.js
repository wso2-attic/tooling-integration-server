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
define(['lodash', './callable-definition'], function (_, CallableDefinition) {

    var FunctionDefinition = function (connectionDeclarations, variableDeclarations, workerDeclarations, statements,args) {
        this.id = autoGenerateId();
        CallableDefinition.call(this, connectionDeclarations, variableDeclarations, workerDeclarations,
            statements, 'Function');
        this.args = args || [];
    };

    FunctionDefinition.prototype = Object.create(CallableDefinition.prototype);
    FunctionDefinition.prototype.constructor = FunctionDefinition;

    // Auto generated Id for service definitions (for accordion views)
    function autoGenerateId(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    FunctionDefinition.prototype.setArgs = function(args){
        if(!_.isNil(args)){
            this.args = args;
        }
    };

    FunctionDefinition.prototype.getArgs = function () {
        return this.args;
    };
    
    /**
     * Validates possible immediate child types.
     * @override
     * @param node
     * @return {boolean}
     */
    FunctionDefinition.prototype.canBeParentOf = function (node) {
        var BallerinaASTFactory = this.getFactory();
        return BallerinaASTFactory.isConnectorDeclaration(node)
            || BallerinaASTFactory.isVariableDeclaration(node)
            || BallerinaASTFactory.isWorkerDeclaration(node)
            || BallerinaASTFactory.isStatement(node);
    };

    return FunctionDefinition;

});