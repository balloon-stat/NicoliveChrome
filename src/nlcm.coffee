$.nlcm = {}

$.nlcm.error = {}

$.nlcm.error.CloseLiveError = class
	constructor: (@message) ->

	toString: ->
		"CloseLiveError #{@message}"