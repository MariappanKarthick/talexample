define(
    "sampleapp/appui/components/subtitlescomponent",
	[
		"antie/subtitles/timedtext",
		"antie/subtitles/ttmlparser",
		"antie/subtitles/errors/ttmlparseerror",
		"antie/widgets/subtitles"
	],
	function (
		TimedText,
		TtmlParser,
		TtmlParseError,
		Subtitles
	)
{
	"use strict";

	/**
	 * A widget used to display subtitles
	 *
	 * @class
	 * @extends antie.widgets.Subtitles
	 */
	var SubtitlesComponent = Subtitles.extend({

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
		 * Removes any event listeners and nullifies variables
		 */
		destroy: function destroy() {
			destroy.base.call(this);
			this._subtitleText = null;
		}
	});

	return SubtitlesComponent;
});
