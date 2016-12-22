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
define(['require', 'lodash', 'log', 'property_pane_utils', './ballerina-statement-view', './../ast/if-else-statement', 'd3utils', 'd3', 'jquery', './../ast/if-statement', './point'],
    function (require, _, log, PropertyPaneUtils, BallerinaStatementView, IfElseStatement, D3Utils, d3, $, IfStatement, Point) {

        /**
         * The view to represent a If Else statement which is an AST visitor.
         * @param {Object} args - Arguments for creating the view.
         * @param {IfElseStatement} args.model - The If Else statement model.
         * @param {Object} args.container - The HTML container to which the view should be added to.
         * @param {Object} args.parent - Parent View (Resource, Worker, etc)
         * @param {Object} [args.viewOptions={}] - Configuration values for the view.
         * @constructor
         */
        var IfElseStatementView = function (args) {

            BallerinaStatementView.call(this, args);

            this._ifBlockView = undefined;
            this._elseIfViews = [];
            this._elseBlockView = undefined;
            this._totalHeight = 0;

            if (_.isNil(this._model) || !(this._model instanceof IfElseStatement)) {
                log.error("If Else statement definition is undefined or is of different type." + this._model);
                throw "If Else statement definition is undefined or is of different type." + this._model;
            }

            if (_.isNil(this._container)) {
                log.error("Container for If Else statement is undefined." + this._container);
                throw "Container for If Else statement is undefined." + this._container;
            }

            // Initialize the bounding box
            this.getBoundingBox().fromTopCenter(this.getTopCenter(), 120, 0);
            this.init();

        };

        IfElseStatementView.prototype = Object.create(BallerinaStatementView.prototype);
        IfElseStatementView.prototype.constructor = IfElseStatementView;

        IfElseStatementView.prototype.canVisitStatement = function(){
            return true;
        };

        IfElseStatementView.prototype.init = function () {
        };

        /**
         * Visit If Statement
         * @param {IfStatement} statement
         */
        IfElseStatementView.prototype.visitIfStatement = function(statement){
            var StatementViewFactory = require('./statement-view-factory');
            var statementViewFactory = new StatementViewFactory();
            var topCenter = this.getTopCenter().clone();
            var args = {model: statement, container: this.getStatementGroup(), viewOptions: {}, parent: this, topCenter: topCenter,
                toolPalette: this.toolPalette, messageManager: this.messageManager};
            var statementView = statementViewFactory.getStatementView(args);
            this._ifBlockView = statementView;
            this._diagramRenderingContext.getViewModelMap()[statement.id] = statementView;

            this.getBoundingBox().on('top-edge-moved', function(dy){
                statementView.getBoundingBox().y(statementView.getBoundingBox().y() + dy);
            });
            this.getBoundingBox().h(this.getBoundingBox().h() + statementView.getBoundingBox().h());

            statementView.getBoundingBox().on("width-changed", function(dw){
                if(this.getBoundingBox().w() < statementView.getBoundingBox().w()){
                    this.getBoundingBox().w(statementView.getBoundingBox().w());
                }
            }, this);

            this.getBoundingBox().on('width-changed', function(dw){
                if(statementView.getBoundingBox().w() < this.getBoundingBox().w()){
                    statementView.getBoundingBox().w(this.getBoundingBox().w());
                }
            }, this);

            this.listenTo(statementView.getBoundingBox(), 'height-changed', function(dh){
                this.getBoundingBox().h(this.getBoundingBox().h() + dh);
            });
            statementView.render(this._diagramRenderingContext);
        };

        /**
         * Visit Else If Statement
         * @param {ElseIfStatement} statement
         */
        IfElseStatementView.prototype.visitElseIfStatement = function(statement){
            var StatementViewFactory = require('./statement-view-factory');
            var statementViewFactory = new StatementViewFactory();
            var topCenterX = this.getBoundingBox().x() + this.getBoundingBox().w()/2;
            var topCenterY = this.getBoundingBox().getBottom();

            if(_.isEmpty(this._elseIfViews)){
                topCenterY = this._ifBlockView.getBoundingBox().getBottom();
            } else {
                topCenterY = _.last(this._elseIfViews).getBoundingBox().getBottom();
            }

            var topCenter = new Point(topCenterX, topCenterY);
            // For the viewOptions currently pass width only.
            // This is because the initial width of the component should be based on my bounding box values
            var viewOptions = {width: this.getBoundingBox().w()};
            var args = {model: statement, container: this.getStatementGroup(), viewOptions: viewOptions, parent: this, topCenter: topCenter,
                toolPalette: this.toolPalette, messageManager: this.messageManager};
            var statementView = statementViewFactory.getStatementView(args);


            // bind unbind event handlers
            if(_.isEmpty(this._elseIfViews)){
                // this is the first else if part - previously else block should be listening  on if view block
                if(!_.isNil(this._elseBlockView)){
                    this._elseBlockView.stopListening(this._ifBlockView.getBoundingBox(), 'bottom-edge-moved');
                }
            } else {
                // else should be listening to current last else if view
                if(!_.isNil(this._elseBlockView)){
                    this._elseBlockView.stopListening(_.last(this._elseIfViews).getBoundingBox(), 'bottom-edge-moved');
                }
            }

            this._elseIfViews.push(statementView);
            this._diagramRenderingContext.getViewModelMap()[statement.id] = statementView;

            // make else view listen to new last else if
            if(!_.isNil(this._elseBlockView)){
                this._elseBlockView.listenTo(_.last(this._elseIfViews).getBoundingBox(), 'bottom-edge-moved', function(dy){
                    this.getBoundingBox().y( this.getBoundingBox().y() + dy);
                });
            }
            this.getBoundingBox().h(this.getBoundingBox().h() + statementView.getBoundingBox().h());

            this.getBoundingBox().on('width-changed', function(dw){
                if(statementView.getBoundingBox().w() < this.getBoundingBox().w()){
                    statementView.getBoundingBox().w(this.getBoundingBox().w());
                }
            }, this);

            this.listenTo(statementView.getBoundingBox(), 'height-changed', function(dh){
                this.getBoundingBox().h(this.getBoundingBox().h() + dh);
            });

            statementView.render(this._diagramRenderingContext);
        };

        /**
         * Visit Else Statement
         * @param {ElseStatement} statement
         */
        IfElseStatementView.prototype.visitElseStatement = function(statement){
            var StatementViewFactory = require('./statement-view-factory');
            var statementViewFactory = new StatementViewFactory();
            var topCenterX = this.getBoundingBox().x() + this.getBoundingBox().w()/2;
            var topCenterY = this.getBoundingBox().getBottom();

            // find last view
            var lastViewBlock = this._ifBlockView;
            if(!_.isEmpty(this._elseIfViews)){
                lastViewBlock = _.last(this._elseIfViews);
            }
            topCenterY = lastViewBlock.getBoundingBox().getBottom();

            var topCenter = new Point(topCenterX, topCenterY);
            var args = {model: statement, container: this.getStatementGroup(), viewOptions: {}, parent: this, topCenter: topCenter,
                toolPalette: this.toolPalette, messageManager: this.messageManager};

            var statementView = statementViewFactory.getStatementView(args);
            this._elseBlockView = statementView;
            this._diagramRenderingContext.getViewModelMap()[statement.id] = statementView;


            statementView.listenTo(lastViewBlock.getBoundingBox(), 'bottom-edge-moved', function(dy){
                statementView.getBoundingBox().y(statementView.getBoundingBox().y() + dy);
            });

            this.getBoundingBox().h(this.getBoundingBox().h() + statementView.getBoundingBox().h());

            this.getBoundingBox().on('width-changed', function(dw){
                if(statementView.getBoundingBox().w() < this.getBoundingBox().w()){
                    statementView.getBoundingBox().w(this.getBoundingBox().w());
                }
            }, this);

            this.listenTo(statementView.getBoundingBox(), 'height-changed', function(dh){
                this.getBoundingBox().h(this.getBoundingBox().h() + dh);
            });

            statementView.render(this._diagramRenderingContext);
        };

        /**
         * Render the svg group to draw the if and the else statements
         */
        IfElseStatementView.prototype.render = function (diagramRenderingContext) {
            this._diagramRenderingContext = diagramRenderingContext;
            var ifElseGroup = D3Utils.group(d3.select(this._container));
            ifElseGroup.attr("id","_" +this._model.id);
            this.setStatementGroup(ifElseGroup);
            this._model.accept(this);

            var editableProperties = [];
            _.forEach(this._model.getChildren(), function(child, index){
                var editableProperty = {};
                if (child instanceof IfStatement) {
                    editableProperty = {
                        propertyType: "text",
                        key: "If condition",
                        model: child,
                        getterMethod: child.getCondition,
                        setterMethod: child.setCondition
                    };

                    editableProperties.push(editableProperty);
                } else if(child instanceof IfElseStatement) {
                    editableProperty = {
                        propertyType: "text",
                        key: "Else If condition",
                        model: child,
                        getterMethod: child.getCondition,
                        setterMethod: child.setCondition
                    };

                    editableProperties.push(editableProperty);
                }
            });
            // Creating property pane
            this._createPropertyPane({
                model:this._model,
                statementGroup:ifElseGroup,
                editableProperties: editableProperties
            });
        };

        /**
         * Set the IfElseStatement model
         * @param {IfElseStatement} model
         */
        IfElseStatementView.prototype.setModel = function (model) {
            if (!_.isNil(model) && model instanceof IfElseStatement) {
                this._model = model;
            } else {
                log.error("If Else statement definition is undefined or is of different type." + model);
                throw "If Else statement definition is undefined or is of different type." + model;
            }
        };

        /**
         * Set the container to draw the if else group
         * @param container
         */
        IfElseStatementView.prototype.setContainer = function (container) {
            if (!_.isNil(container)) {
                this._container = container;
            } else {
                log.error("Container for If Else statement is undefined." + container);
                throw "Container for If Else statement is undefined." + container;
            }
        };

        IfElseStatementView.prototype.setViewOptions = function (viewOptions) {
            this._viewOptions = viewOptions;
        };

        /**
         * @returns {_model}
         */
        IfElseStatementView.prototype.getModel = function () {
            return this._model;
        };

        IfElseStatementView.prototype.getContainer = function () {
            return this._container;
        };

        IfElseStatementView.prototype.getViewOptions = function () {
            return this._viewOptions;
        };

        IfElseStatementView.prototype.setIfBlockView = function (ifBlockView) {
            this._ifBlockView = ifBlockView;
        };

        IfElseStatementView.prototype.setElseBlockView = function (elseBlockView) {
            this._elseBlockView = elseBlockView;
        };

        IfElseStatementView.prototype.getIfBlockView = function () {
            return this._ifBlockView;
        };

        IfElseStatementView.prototype.getElseBlockView = function () {
            return this._elseBlockView;
        };

        IfElseStatementView.prototype.getElseIfViewList = function () {
            return this._elseIfViews;
        };

        IfElseStatementView.prototype.getLastElseIf = function () {
            return this._elseIfViews[this._elseIfViews.length - 1];
        };

        return IfElseStatementView;
    });