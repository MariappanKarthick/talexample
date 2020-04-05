define(
    "sampleapp/appui/components/subtitlescomponent",
	[
		"antie/subtitles/timedtext",
		"antie/subtitles/ttmlparser",
		"antie/subtitles/errors/ttmlparseerror",
		"antie/widgets/subtitles",
		//"btplayer/utility/DeviceConfigUtils"
	],
	function (
		TimedText,
		TtmlParser,
		TtmlParseError,
		Subtitles
		// DeviceConfigUtils,

		// Label,
		// ObjectFactory
	)
{
	"use strict";

	/**
	 * A widget used to display subtitles
	 *
	 * @class
	 * @extends antie.widgets.Subtitles
	 */
	var SubtitlesViewer = Subtitles.extend({

		/**
		 * Constructor
		 *
		 * @param {XMLDocument} ttmlDoc
		 *        the TTML source file parsed into an XML document
		 *
		 * @param {Function} getMediaTimeCallback
		 *        the function to determine the current time in seconds of the media playback
		 *
		 * @param {number} [mediaPollMilliseconds=200]
		 *        number of milliseconds between polls of the current media time
		 *
		 * @param {string} url
		 *        the URL of the TTML source file - for error reporting
		 */
		init: function init(ttmlDoc, getMediaTimeCallback, mediaPollMilliseconds, url) {
			init.base.call(this, null, this._xml2timedText(ttmlDoc, url), getMediaTimeCallback, mediaPollMilliseconds);
		},

		/**
		 * Parses an XML document into TTML.
		 *
		 * @param {XMLDocument} ttmlDoc
		 *        the TTML source file parsed into an XML document
		 *
		 * @param {string} url
		 *        the URL of the TTML source file - for error reporting
		 *
		 * @returns {antie.subtitles.TimedText} the XML parsed into timed text
		 * @private
		 */
		_xml2timedText: function _xml2timedText(ttmlDoc, url) {
			try {
				return new TtmlParser().parse(ttmlDoc);
			} catch (e) {
				if (e instanceof TtmlParseError) {
                    console.log("url is "+url);
                    console.log("message is "+e.message);
					return new TimedText(null, null);
				} else {
					throw e;   // Not expecting this, rethrow it (so that it fails unit tests)
				}
			}
		},

		/**
		 * Set the bottom value to allow space for the playbackBar before calling
		 * start on the subtitles superclass
		 */
		start: function start(){
			start.base.call(this);
		},

		/**
		 * Called when the playback bar's visiblity changes - adjusts the position
		 * and size of the area where subtitles can be drawn based on the playback bar's position
		 *
		 * @param {Number} bottom
		 * 			to set bottom of output element of subtitle viewer
		 */
		// onPlaybackBarVisibilityChange: function onPlaybackBarVisibilityChange(bottom) {
		// 	var deviceHeight = DeviceConfigUtils.getDeviceConfig().layouts[0].height;

		// 	// factor used to calculate the actual pixel value based on the screen resolution
		// 	// value of the multiplier factor = 1.5 for screen res 1080p, 1 for screen res 720p
		// 	var multiplier = deviceHeight/720;
		// 	var verticalSafeArea = SubtitlesViewer.DEFAULT_VERTICAL_SAFE_AREA * multiplier;
		// 	if(bottom === 0){
		// 		this.outputElement.style.bottom = verticalSafeArea;
		// 		this.outputElement.style.height = deviceHeight - 2 * verticalSafeArea;
		// 	} else {
		// 		this.outputElement.style.bottom = bottom;
		// 		this.outputElement.style.height = deviceHeight - verticalSafeArea - bottom;
		// 	}
		// },

		/**
		 * Removes any event listeners and nullifies variables
		 */
		destroy: function destroy() {
			destroy.base.call(this);
			this._subtitleText = null;
		}
	});

	SubtitlesViewer.DEFAULT_VERTICAL_SAFE_AREA = 36;

	return SubtitlesViewer;
});
