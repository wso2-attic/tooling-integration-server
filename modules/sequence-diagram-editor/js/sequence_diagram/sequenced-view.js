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

/**
 * SequenceD-Views Module extension.
 *
 * Definition of Backbone Views required for Sequence Diagrams.
 */
var SequenceD = (function (sequenced) {
    var views = sequenced.Views = sequenced.Views || {};
    var toolPaletteWidth = 240;
    var imageHeight = 20;

    var Processor = Diagrams.Views.ShapeView.extend(
        /** @lends Processor.prototype */
        {
            /**
             * @augments ShapeView
             * @constructs
             * @class Processor Represents the view for processor components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID, centerPoint, status) {
                if (status == "processors") {
                    Diagrams.Views.ShapeView.prototype.render.call(this, paperID);
                    var viewObj = this;
                    var drag = d3.drag()
                        .on("start", function () {
                            viewObj.dragStart(d3.event);
                        })
                        .on("drag", function () {
                            viewObj.dragMove(d3.event);
                        })
                        .on("end", function () {
                            viewObj.dragStop();
                        });
                }
            },

        });

    var MessageLink = Diagrams.Views.DiagramElementView.extend(
        /** @lends Processor.prototype */
        {
            /**
             * @augments ShapeView
             * @constructs
             * @class Processor Represents the view for processor components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.DiagramElementView.prototype.initialize.call(this, options);
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID, status) {
                if (status == "messages") {
                    Diagrams.Views.DiagramElementView.prototype.render.call(this, paperID);
                    var d3ref = this.getD3Ref();
                    var group = d3ref.draw.group();
                    var viewObj = this;
                    var optionsMenuGroup = group.append("g").attr("class", "option-menu option-menu-hide");
                    var destinationCenterPoint = this.model.destination().centerPoint();
                    var sourceCenterPoint = this.model.source().centerPoint();
                    var delXPosition = ((Math.round(sourceCenterPoint.get('x'))) +
                        Math.round(destinationCenterPoint.get('x')))/2;

                    var optionMenuWrapper = d3ref.draw.rect(Math.round(delXPosition) - 15,
                        Math.round(sourceCenterPoint.get('y')) + 10,
                        30,
                        30,
                        0,
                        0,
                        optionsMenuGroup, "#f9f7f4").
                        attr("style", "stroke: #908D82; stroke-width: 0.5; opacity:0.5; cursor: pointer").
                        on("mouseover", function () {
                            d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: .1; cursor: pointer");
                        }).
                        on("mouseout", function () {
                            d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                        });

                    var deleteOption = d3ref.draw.rect(Math.round(delXPosition) - 12,
                        Math.round(sourceCenterPoint.get('y')) + 13,
                        24,
                        24,
                        0,
                        0,
                        optionsMenuGroup, "url(#delIcon)").
                        attr("style", "opacity:0.2; cursor: pointer; stroke: #ede9dc").
                        on("mouseover", function () {
                            d3.select(this).attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 1; cursor: pointer");
                            optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: .7");
                        }).
                        on("mouseout", function () {
                            d3.select(this).attr("style", "stroke: #f9f7f4; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                            optionMenuWrapper.attr("style", "stroke: #908D82; stroke-width: 0.5; opacity: 0.5; cursor: pointer");
                        });

                    // When we have unequal y coordinates in source and destination message points, we need to set them to a common value
                    // as we need a horizontal line always. Here we will use priority point and set that y value to both points.
                    if(!_.isUndefined(this.model.priority())) {
                        sourceCenterPoint.y(this.model.priority().centerPoint().y());
                        destinationCenterPoint.y(this.model.priority().centerPoint().y());
                    }

                    if(this.model.type() === Diagrams.Utils.messageLinkType.InOut){
                        // Drawing an IN_OUT message.
                        var lineDestinationCenterPoint = createPoint(destinationCenterPoint.x(), Math.round(destinationCenterPoint.y()) -5);
                        var lineSourceCenterPoint = createPoint(sourceCenterPoint.x(), Math.round(sourceCenterPoint.y()) - 5);
                        var line = d3ref.draw.lineFromPoints(lineSourceCenterPoint, lineDestinationCenterPoint, group)
                            .classed(this.options.class, true);

                        var line2DestinationCenterPoint = createPoint(destinationCenterPoint.x(), Math.round(destinationCenterPoint.y()) + 10);
                        var line2SourceCenterPoint = createPoint(sourceCenterPoint.x(), Math.round(sourceCenterPoint.y()) + 10);

                        var line2 = d3ref.draw.lineFromPoints(line2DestinationCenterPoint, line2SourceCenterPoint, group)
                            .classed(this.options.class, true);
                    }else{
                        // Drawing an OUT_ONLY message.
                        var line = d3ref.draw.lineFromPoints(sourceCenterPoint, destinationCenterPoint, group)
                            .classed(this.options.class, true);
                    }

                    //this.model.source().on("connectingPointChanged", this.sourceMoved, this);
                    //this.model.destination().on("connectingPointChanged", this.destinationMoved, this);

                    line.on("click", function () {
                        if (optionsMenuGroup.classed("option-menu-hide")) {
                            optionsMenuGroup.classed("option-menu-hide", false);
                            optionsMenuGroup.classed("option-menu-show", true);
                        } else {
                            optionsMenuGroup.classed("option-menu-hide", true);
                            optionsMenuGroup.classed("option-menu-show", false);
                        }
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                    });

                    deleteOption.on("click", function () {
                        var model = viewObj.model;

                        var sourceLifeLineChildren = model.get('source').get('parent').get('children').models;
                        var destLifeLineChildren = model.get('destination').get('parent').get('children').models;

                        sourceLifeLineChildren.forEach(function (child) {
                            if (child.cid == model.get('sourcePoint').cid) {
                                sourceLifeLineChildren.splice(sourceLifeLineChildren.indexOf(child), 1);
                            }
                        });

                        destLifeLineChildren.forEach(function (child) {
                            if (child.cid == model.get('destinationPoint').cid) {
                                destLifeLineChildren.splice(destLifeLineChildren.indexOf(child), 1);
                            }
                        });

                        defaultView.render();
                    });

                    this.d3el = group;
                    this.el = group.node();
                    return this.d3el;
                }
            }

        });



    var MessageView = Diagrams.Views.LinkView.extend(
        /** @lends MessageView.prototype */
        {
            /**
             * @augments LinkView
             * @constructs
             * @class MessageView Represents the view for message components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.LinkView.prototype.initialize.call(this, options);
            },

            render: function (paperID) {
                // call super
                Diagrams.Views.LinkView.prototype.render.call(this, paperID);
                var viewObj = this;
                var drag = d3.drag()
                    .on("start", function () {
                        viewObj.dragStart(d3.event);
                    })
                    .on("drag", function () {
                        viewObj.dragMove(d3.event);
                    })
                    .on("end", function () {
                        viewObj.dragStop();
                    });

                this.d3el.call(drag);
                return this.d3el;
            }
        });

    var ActivationView = Diagrams.Views.ConnectionPointView.extend(
        /** @lends ConnectionPointView.prototype */
        {
            /**
             * @augments LinkView
             * @constructs
             * @class ActivationView Represents the view for activations in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ConnectionPointView.prototype.initialize.call(this, options);
            },

            render: function (paperID) {
                // call super
                Diagrams.Views.ConnectionPointView.prototype.render.call(this, paperID);

            },

            getNextAvailableConnectionPoint: function (connecion, x, y) {
                var nextYCoordinate = defaultView.model.deepestPointY + 50;
                var nextXCoordinate = this.model.owner().get('centerPoint').x();

                // TODO: Until the layout finalize we will be drawing the message without offsetting dynamically
                //if (_.isEqual(connecion.type(), "incoming")) {
                //    lifeLineOptions.diagram.deepestPointY = nextYCoordinate;
                //}
                return new GeoCore.Models.Point({'x': nextXCoordinate, 'y': defaultView.model.sourceLifeLineY});
            }
        });

    var FixedSizedMediatorView = Diagrams.Views.ShapeView.extend(
        /** @lends FixedSizedMediatorView.prototype */
        {
            /**
             * @augments ShapeView
             * @constructs
             * @class LifeLineView Represents the view for lifeline components in Sequence Diagrams.
             * @param {Object} options Rendering options for the view
             */
            initialize: function (options) {
                Diagrams.Views.ShapeView.prototype.initialize.call(this, options);
            },

            verticalDrag: function () {
                return false;
            },

            render: function (paperID) {
                Diagrams.Views.ShapeView.prototype.render.call(this, paperID);

                var lifeLine = this.drawFixedSizedMediator(this.modelAttr('centerPoint'), this.modelAttr('title'), this.options);
                var viewObj = this;
                var drag = d3.drag()
                    .on("start", function () {
                        viewObj.dragStart(d3.event);
                    })
                    .on("drag", function () {
                        viewObj.dragMove(d3.event);
                    })
                    .on("end", function () {
                        viewObj.dragStop();
                    });

                //lifeLine.call(drag);

                this.d3el = lifeLine;
                this.el = lifeLine.node();
                return lifeLine;
            },

            drawFixedSizedMediator: function (center, title, prefs) {
                var d3Ref = this.getD3Ref();
                var group = d3Ref.draw.group()
                    .classed(prefs.class, true);
                var rect = d3Ref.draw.centeredRect(center, prefs.rect.width, prefs.rect.height, 0, 0, group)
                    .classed(prefs.rect.class, true);
                //var rectBottom = d3Ref.draw.centeredRect(createPoint(center.get('x'), center.get('y') +
                // prefs.line.height), prefs.rect.width, prefs.rect.height, 3, 3, group) .classed(prefs.rect.class,
                // true); var line = d3Ref.draw.verticalLine(createPoint(center.get('x'), center.get('y')+
                // prefs.rect.height/2), prefs.line.height-prefs.rect.height, group) .classed(prefs.line.class, true);
                var text = d3Ref.draw.centeredText(center, title, group)
                    .classed(prefs.text.class, true);
                //var textBottom = d3Ref.draw.centeredText(createPoint(center.get('x'), center.get('y') +
                // prefs.line.height), title, group) .classed(prefs.text.class, true);
                group.rect = rect;
                //Object.getPrototypeOf(group).rectBottom = rectBottom;
                //Object.getPrototypeOf(group).line = line;
                group.title = text;
                //Object.getPrototypeOf(group).titleBottom = textBottom;
                group.translate = function (dx, dy) {
                    this.attr("transform", function () {
                        return "translate(" + [dx, dy] + ")"
                    })
                };

                return group;
            }

        });

    views.MessageView = MessageView;
    views.ActivationView = ActivationView;
    views.Processor = Processor;
    views.MessageLink = MessageLink;

    return sequenced;

}(SequenceD || {}));
