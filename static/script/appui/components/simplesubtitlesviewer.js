/**
* @preserve Copyright (c) 2013 British Broadcasting Corporation
* (http://www.bbc.co.uk) and TAL Contributors (1)
*
* (1) TAL Contributors are listed in the AUTHORS file and at
*     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
*     not this notice.
*
* @license Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* All rights reserved
* Please contact us for an alternative licence
*/

/**
* @preserve Copyright (c) 2013 British Broadcasting Corporation
* (http://www.bbc.co.uk) and TAL Contributors (1)
*
* (1) TAL Contributors are listed in the AUTHORS file and at
*     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
*     not this notice.
*
* @license Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* All rights reserved
* Please contact us for an alternative licence
*/

define(
    "sampleapp/appui/components/simplesubtitlesviewer",
    [
      "antie/widgets/component",
      "antie/widgets/button",
      "antie/widgets/label",
      "antie/widgets/verticallist",
      "antie/videosource",
      "antie/devices/mediaplayer/mediaplayer",
      "antie/runtimecontext",
      "sampleapp/appui/components/subtitlescomponent"
    ],
    function (Component, Button, Label, VerticalList, VideoSource, MediaPlayer, RuntimeContext, SubtitlesComponent) {

      return Component.extend({
        init: function init () {
          var self = this;

          // It is important to call the constructor of the superclass
          init.base.call(this, "simplesubtitlesviewer");

          // Get a reference to the current application and device objects
          this._application = this.getCurrentApplication();
          this._device = this._application.getDevice();

          // Create a a label add a class to it, this class can be used as a CSS selector
          var description = new Label("Simple Video Component with Subtitles");
          description.addClass("description");
          this.appendChildWidget(description);

          // Create a horizontal list that contains buttons to control the video
          var playerControlButtons = new VerticalList("subtitlesPlayerButtons");

          var play = new Button('play');
          play.appendChildWidget(new Label('PLAY'));
          playerControlButtons.appendChildWidget(play);
          play.addEventListener('select', function(evt) {
            self.getPlayer().resume();
          });

          var pause = new Button('pause');
          pause.appendChildWidget(new Label('PAUSE'));
          playerControlButtons.appendChildWidget(pause);
          pause.addEventListener('select', function(evt) {
            self.getPlayer().pause();
          });

          var subOn = new Button('subOn');
          subOn.appendChildWidget(new Label('Sub ON'));
          playerControlButtons.appendChildWidget(subOn);
          subOn.addEventListener('select', function(evt) {
            if (!self._subtitlesComponent) {
              self._appendSubtitlesComponent();
            } else {
              //this._onPlaybackBarVisibilityChangeForSubtitle();
              self._subtitlesComponent.start();
            }
          });

          var subOff = new Button('subOff');
          subOff.appendChildWidget(new Label('Sub OFF'));
          playerControlButtons.appendChildWidget(subOff);
          subOff.addEventListener('select', function(evt) {
            if (self._subtitlesComponent) {
              self._subtitlesComponent.stop();
            }
          });

          var back = new Button('back');
          back.appendChildWidget(new Label('BACK'));
          playerControlButtons.appendChildWidget(back);
          back.addEventListener('select', function(evt) {
            // Make sure we destroy the player before exiting
            self.destroyPlayer();
            self.parentWidget.back();
          });

          // Append the player control buttons to the component
          this.appendChildWidget(playerControlButtons);

          // Add a 'beforerender' event listener to the component that takes care of video instantiation
          this.addEventListener("beforerender", function (evt) {
            self._onBeforeRender(evt);
          });
        },

        _onBeforeRender: function (ev) {
          // Create the device's video object, set the media sources and start loading the media
          var videoContainer = RuntimeContext.getCurrentApplication().getRootWidget().outputElement;
          var player = this.getPlayer()
          player.initialiseMedia('video', "static/mp4/testVideo.mp4", "video/mp4", videoContainer);
          player.beginPlayback();
        },

        getPlayer: function() {
          return RuntimeContext.getDevice().getMediaPlayer();
        },

        _appendSubtitlesComponent: function(){
          var self = this;
          var ttmlDocLoc = "http://localhost:1337/static/subs/testSubTitles.xml";

          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
              if (xhr.readyState === 4){
                  var ttmlDoc = xhr.responseXML;
                  self._subtitlesComponent = new SubtitlesComponent(ttmlDoc, self.getPlayer().getCurrentTime.bind(self.getPlayer()), 200, ttmlDocLoc);
                  self.appendChildWidget(self._subtitlesComponent);
                  //this._onPlaybackBarVisibilityChangeForSubtitle();
                  self._subtitlesComponent.start();
              }
          };
          xhr.open('GET', ttmlDocLoc);
          xhr.setRequestHeader('Accept', 'application/xml');
          xhr.send();

        },

        destroyPlayer: function() {
          this.getPlayer().stop();
          this.getPlayer().reset();
        },

        showBackground: function() {
          if (this._device.getPlayerEmbedMode() === Media.EMBED_MODE_BACKGROUND) {
            this._device.removeClassFromElement(document.body, 'background-none');
            this._application.getRootWidget().removeClass('background-none');
          }
        }
      });
    }
  );
