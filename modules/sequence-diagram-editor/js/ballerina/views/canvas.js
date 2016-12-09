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
define(['log', 'lodash', 'jquery', 'd3', './../visitors/ast-visitor', 'd3utils'], function(log, _, $, d3, AstVisitor, D3Utils){

    var Canvas = function(container, viewOptions) {

        // viewOptions.diagram.height = _.get(viewOptions, "diagram.height", "100%");
        // viewOptions.diagram.width = _.get(viewOptions, "diagram.width", "100%");
        // viewOptions.diagram.padding =  _.get(viewOptions, "diagram.padding", 50);
        // viewOptions.diagram.viewBoxWidth =  _.get(viewOptions, "diagram.viewBoxWidth", 1000);
        // viewOptions.diagram.viewBoxHeight =  _.get(viewOptions, "diagram.viewBoxHeight", 1000);
        //
        // viewOptions.diagram.class = viewOptions.diagram.class || "diagram";
        // viewOptions.diagram.selector = viewOptions.diagram.selector || ".diagram";
        // viewOptions.diagram.wrapper = viewOptions.diagram.wrapper ||{};
        // // CHANGED
        // viewOptions.diagram.wrapperId = viewOptions.wrapperId || "diagramWrapper";
        // viewOptions.diagram.grid = viewOptions.diagram.grid || {};
        // viewOptions.diagram.grid.height = viewOptions.diagram.grid.height || 25;
        // viewOptions.diagram.grid.width = viewOptions.diagram.grid.width || 25;
        // this.viewOptions = viewOptions;
        //
        // this.model = model;
        // this.container = container;
        //
        // if (_.isUndefined(this.container)) {
        //     log.error("container is not defined");
        // }
        //
        // var d3Container = d3.select(this.container);
        // // wrap d3 with custom drawing apis
        // d3Container = D3Utils.decorate(d3Container);
        // var svg = d3Container.draw.svg(this.viewOptions.diagram);
        // this._definitions = svg.append("defs");
        // this._svg = svg;
        //
        // this._mainSVGGroup = this.d3svg.draw.group(this._svg).attr("id", this.viewOptions.diagram.wrapperId)
        //     .attr("width", "100%")
        //     .attr("height", "100%");
    };

    Canvas.prototype = Object.create(AstVisitor.prototype);
    Canvas.prototype.constructor = Canvas;

    Canvas.prototype.getSVG = function () {
        return this._svg;
    };

    Canvas.prototype.getMainWrapper = function () {
        return this._mainSVGGroup;
    };

    Canvas.prototype.drawAccordionCanvas = function (parent, options, id, name) {
        var serviceContainer = $('<div><svg class="service-container"></svg></div>');
        serviceContainer.attr('id', id);
        serviceContainer.attr('name', name);
        serviceContainer.addClass(_.get(options, 'cssClass.outer_box'));
        var canvas = serviceContainer;

        //draw a collapse accordion
        var outerDiv = $('<div></div>');
        outerDiv.addClass(_.get(options, 'cssClass.outer_div'));
        var panelHeading = $('<div></div>');
        panelHeading.attr('id', canvas[0].id + 3).attr('role', 'tab');
        var panelTitle = $('<h4></h4>');
        panelTitle.addClass(_.get(options, 'cssClass.panel_title'));
        var panelIcon = $('<i></i>');
        panelIcon.addClass(_.get(options, 'cssClass.panel_icon'));
        if (canvas[0].getAttribute('name') == "service") {
            panelIcon.addClass(_.get(options, 'cssClass.service_icon'));
        } else if (canvas[0].getAttribute('name') == "connector") {
            panelIcon.addClass(_.get(options, 'cssClass.connector_icon'));
        } else if (canvas[0].getAttribute('name') == "function") {
            panelIcon.addClass(_.get(options, 'cssClass.function_icon'));
        }
        panelTitle.append(panelIcon);
        var titleLink = $('<a>' + canvas[0].getAttribute('name') + '</a>');
        titleLink.addClass(_.get(options, 'cssClass.title_link'));
        //TODO: update href,aria-controls
        titleLink.attr('role', 'button').attr('data-toggle', 'collapse').attr('data-parent', "#accordion").attr('href', '#' + canvas[0].id).attr('aria-expanded', 'false').attr('aria-controls', canvas[0].id);
        panelTitle.append(titleLink);

        var panelRightIcon = $('<i></i>');
        panelRightIcon.addClass(_.get(options, 'cssClass.panel_right_icon'));
        panelRightIcon.attr('role', 'button').attr('data-toggle', 'collapse').attr('data-parent', "#accordion").attr('href', '#' + canvas[0].id).attr('aria-expanded', 'false').attr('aria-controls', canvas[0].id);
        panelTitle.append(panelRightIcon);

        panelHeading.append(panelTitle);

        titleLink.click(function () {
            $(this).parent().find('i.right-icon-clickable').toggleClass('fw-down fw-up');
        });

        panelRightIcon.click(function () {
            $(this).toggleClass('fw-down fw-up');
        });

        var bodyDiv = $('<div></div>');
        bodyDiv.addClass(_.get(options, 'cssClass.body_div'));
        bodyDiv.attr('id', canvas[0].id).attr('aria-labelledby', canvas[0].id + 3).attr('role', 'tabpanel');
        bodyDiv.addClass(_.get(options, 'cssClass.canvas'));
        bodyDiv.append(canvas);

        outerDiv.append(panelHeading);
        outerDiv.append(bodyDiv);

        // append to parent
        parent.append(outerDiv);
    };

    return Canvas;

});