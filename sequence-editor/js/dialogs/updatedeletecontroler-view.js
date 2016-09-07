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

var Dialogs = (function (dialogs) {
    var views = dialogs.Views || {};

    var udcontrolView = Backbone.View.extend({

        el: '#udcontroldiv',

        initialize: function () {
          this.listenTo(this.model, 'change', this.render);
          var controlDiv = this.$el;

          $("#delete-image").click(function(){
              console.log("deleted the model");
              controlDiv.removeClass("visible-button");
              controlDiv.addClass("hidden-button");
              if (selectedModel) {
                diagram.removeElement(selectedModel);
              }
          });

          $("#edit-image").click(function(){
              alert("Edit properties");
          });
        },

        render: function () {
          var isVisible = this.model.attributes.visible;
          var x = this.model.attributes.x;
          var y = this.model.attributes.y;
          var lifeline = this.model.attributes.lifeline;
          var udControlDiv = this.$el;//$('#udcontroldiv');
          if (isVisible) {
              udControlDiv.css({
                position:'absolute',
                top: y,
                left: x,
                zIndex:5000
              });
              udControlDiv.removeClass("hidden-button");
              udControlDiv.addClass("visible-button");
          } else {
              udControlDiv.removeClass("visible-button");
              udControlDiv.addClass("hidden-button");
          }
          return this;
        }
    });

    views.UpdateDeletedControlerView = udcontrolView;
    dialogs.Views = views;
    return dialogs;

} (Dialogs || {}));
