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
define(['lodash', 'log', 'event_channel', './../ast/module'], function(_, log, EventChannel, AST) {

    var ASTVisitor = function() {};

    ASTVisitor.prototype = Object.create(EventChannel.prototype);
    ASTVisitor.prototype.constructor = ASTVisitor;

    /**
     * @param node {ASTNode}
     */
    ASTVisitor.prototype.canVisit = function(node){
        if(node instanceof AST.BallerinaASTRoot){
            return this.canVisitBallerinaASTRoot(node);
        } else if(node instanceof AST.ServiceDefinition){
            return this.canVisitServiceDefinition(node);
        } else if(node instanceof AST.ResourceDefinition){
            return this.canVisitResourceDefinition(node);
        } else if(node instanceof AST.FunctionDefinition) {
            return this.canVisitFunctionDefinition(node);
        } else if (node instanceof AST.Statement) {
            return this.canVisitStatement(node);
        } else if (node instanceof AST.PackageDefinition) {
            return this.canVisitPackageDefinition(node);
        } else if (node instanceof AST.ImportDeclaration) {
            return this.canVisitImportDeclaration(node);
        }
    };

    /**
     * @param node {ASTNode}
     */
    ASTVisitor.prototype.beginVisit = function(node){
        if(node instanceof AST.BallerinaASTRoot){
            return this.beginVisitBallerinaASTRoot(node);
        } else if(node instanceof AST.ServiceDefinition){
            return this.beginVisitServiceDefinition(node);
        } else if(node instanceof AST.ResourceDefinition){
            return this.beginVisitResourceDefinition(node);
        } else if(node instanceof AST.FunctionDefinition){
            return this.beginVisitFunctionDefinition(node);
        } else if (node instanceof AST.Statement) {
            return this.beginVisitStatement(node);
        } else if (node instanceof AST.PackageDefinition) {
            return this.beginVisitPackageDefinition(node);
        } else if (node instanceof AST.ImportDeclaration) {
            return this.beginVisitImportDeclaration(node);
        }
    };

    /**
     * @param node {ASTNode}
     */
    ASTVisitor.prototype.visit = function(node){
        if(node instanceof AST.BallerinaASTRoot){
            return this.visitBallerinaASTRoot(node);
        } else if(node instanceof AST.ServiceDefinition){
            return this.visitServiceDefinition(node);
        } else if(node instanceof AST.ResourceDefinition){
            return this.visitResourceDefinition(node);
        } else if(node instanceof AST.FunctionDefinition){
            return this.visitFunctionDefinition(node);
        } else if (node instanceof AST.Statement) {
            return this.visitStatement(node);
        } else if(node instanceof AST.PackageDefinition){
            return this.visitPackageDefinition(node);
        } else if(node instanceof AST.ImportDeclaration){
            return this.visitImportDeclaration(node);
        }
    };

    /**
     * @param node {ASTNode}
     */
    ASTVisitor.prototype.endVisit = function(node){
        if(node instanceof AST.BallerinaASTRoot){
            return this.endVisitBallerinaASTRoot(node);
        } else if(node instanceof AST.ServiceDefinition){
            return this.endVisitServiceDefinition(node);
        } else if(node instanceof AST.ResourceDefinition){
            return this.endVisitResourceDefinition(node);
        } else if(node instanceof AST.FunctionDefinition){
            return this.endVisitFunctionDefinition(node);
        } else if(node instanceof AST.Statement){
            return this.endVisitStatement(node);
        } else if(node instanceof AST.PackageDefinition){
            return this.endVisitPackageDefinition(node);
        } else if(node instanceof AST.ImportDeclaration){
            return this.endVisitImportDeclaration(node);
        }
    };

    ASTVisitor.prototype.canVisitBallerinaASTRoot = function(ballerinaASTRoot){
        return false;
    };
    ASTVisitor.prototype.beginVisitBallerinaASTRoot = function(ballerinaASTRoot){
    };
    ASTVisitor.prototype.visitBallerinaASTRoot= function(ballerinaASTRoot){
    };
    ASTVisitor.prototype.endVisitBallerinaASTRoot = function(ballerinaASTRoot){
    };

    ASTVisitor.prototype.canVisitServiceDefinition = function(serviceDefinition){
        return false;
    };
    ASTVisitor.prototype.beginVisitServiceDefinition = function(serviceDefinition){
    };
    ASTVisitor.prototype.visitServiceDefinition = function(serviceDefinition){
    };
    ASTVisitor.prototype.endVisitServiceDefinition = function(serviceDefinition){
    };

    ASTVisitor.prototype.canVisitConnectorDefinition = function(connectorDefinition){
        return false;
    };
    ASTVisitor.prototype.beginVisitConnectorDefinition = function(connectorDefinition){
    };
    ASTVisitor.prototype.visitConnectorDefinition = function(connectorDefinition){
    };
    ASTVisitor.prototype.endVisitConnectorDefinition = function(connectorDefinition){
    };

    ASTVisitor.prototype.canVisitFunctionDefinition = function(functionDefinition){
        return false;
    };
    ASTVisitor.prototype.beginVisitFunctionDefinition = function(functionDefinition){
    };
    ASTVisitor.prototype.visitFunctionDefinition = function(functionDefinition){
    };
    ASTVisitor.prototype.endVisitFunctionDefinition = function(functionDefinition){
    };

    ASTVisitor.prototype.canVisitResourceDefinition = function(resourceDefinition){
        return true;
    };
    ASTVisitor.prototype.beginVisitResourceDefinition = function(resourceDefinition){
    };
    ASTVisitor.prototype.visitResourceDefinition = function(resourceDefinition){
    };
    ASTVisitor.prototype.endVisitResourceDefinition = function(resourceDefinition){
    };

    ASTVisitor.prototype.canVisitFunctionDefinition = function(resourceDefinition){
        return false;
    };
    ASTVisitor.prototype.beginVisitFunctionDefinition = function(resourceDefinition){
    };
    ASTVisitor.prototype.visitFunctionDefinition = function(resourceDefinition){
    };
    ASTVisitor.prototype.endVisitFunctionDefinition = function(resourceDefinition){
    };

    ASTVisitor.prototype.canVisitPackageDefinition = function(packageDefinition){
        return false;
    };
    ASTVisitor.prototype.beginVisitPackageDefinition = function(packageDefinition){
    };
    ASTVisitor.prototype.visitPackageDefinition = function(packageDefinition){
    };
    ASTVisitor.prototype.endVisitPackageDefinition = function(packageDefinition){
    };

    ASTVisitor.prototype.canVisitImportDeclaration = function(importDeclaration){
        return false;
    };
    ASTVisitor.prototype.beginVisitImportDeclaration = function(importDeclaration){
    };
    ASTVisitor.prototype.visitImportDeclaration = function(importDeclaration){
    };
    ASTVisitor.prototype.endVisitImportDeclaration = function(importDeclaration){
    };

    ASTVisitor.prototype.canVisitStatement = function(statement){
        return true;
    };
    ASTVisitor.prototype.beginVisitStatement = function(statement){
    };
    ASTVisitor.prototype.visitStatement = function(statement){
    };
    ASTVisitor.prototype.endVisitStatement = function(statement){
    };

    return ASTVisitor;

});