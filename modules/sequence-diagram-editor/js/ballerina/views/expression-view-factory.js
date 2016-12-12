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
define(['lodash', 'log', 'event_channel', '../ast/module', './function-invocation-view', './arithmetic-expression-view', './logical-expression-view'],
    function (_, log, EventChannel, AST, FunctionInvocationView, ArithmeticExpressionView, LogicalExpressionView) {

        var ExpressionViewFactory = function () {
        };

        ExpressionViewFactory.prototype.getExpressionView = function (args) {
            var expression  = _.get(args, "model");
            if (expression instanceof AST.FunctionInvocation) {
                return new FunctionInvocationView(args);
            } else if (expression instanceof AST.ArithmeticExpression) {
                return new ArithmeticExpressionView(args);
            } else if (expression instanceof AST.LogicalExpression) {
                return new LogicalExpressionView(args);
            }
        };

        return ExpressionViewFactory;
    });