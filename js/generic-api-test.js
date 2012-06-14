/* Global counter for the total of parameters */
var ParamCounter = 0;

$(document).ready(function(){
	/* Make the request */
	$("#makeRequest").click(function(){
		$params = listParams();

		$.ajax({
			type: $('#call_method option:selected').text(),
			url: $('#base_url').val(),
			data: jQuery.parseJSON($params)
		}).done(function(response){
			$('#response_holder').text(formatResponse(response));
		})
		
	});
	/* Add parameter fields */
	$('#addParameter').click(function(){
		ParamCounter++;
		$html = '<div style="margin:0"><input type="text" class="parameter" id="param';
		$html+= ParamCounter+'" placeholder="param'+ParamCounter+'=value"/></div>';
		$('#parametersHolder').append( $html);
	})
	/* Resets the form for a new query */
	$('#resetFields').click(function(){

	})
})

/* Give the parameters the format for the ajax query */
function listParams(){
	var stack = '{';
	for($i=1; $i <= ParamCounter; $i++){
		/* Looks for '=' in every parameter field */
		if( $('#param'+$i).val().match('=') == null)
			alert('= not found in parameter '+$i);
		/* Adds parameter & value to 'stack' */
		else{
			$paramValue = $('#param'+$i).val().split('=');
			stack += '"'+ $paramValue[0] +'" : "'+ $paramValue[1] + '"';
			/* if it's not the last parameters, adds a comma */
			if($i < ParamCounter)
				stack += ', ';
		}
	}
	stack += '}';
	/* If values are empty, then stack = false */
	if(stack == '{}') stack = false;

	return stack;
}

/* Gives format to the response */
function formatResponse($longUglyString){
	$prettyString = '';
	for($i=1; $i< $longUglyString.length; $i++){
		switch($longUglyString[$i]){
			case '{': 
				$prettyString += '{\n'; 
				break;
			case '[':
				$prettyString += '[\n';
				break;
			case '"': 
				if($longUglyString[$i-1] == '{' || $longUglyString[$i-1] == ',' || $longUglyString[$i-1] == '[')
					$prettyString += '    "';
				else 
					$prettyString += '"';
				break;
			case ',': 
				if($longUglyString[$i-1] == '"')
					$prettyString += ',\n'; 
				else
					$prettyString += ',';
				break;
			case '}':
				$prettyString += '\n}';
				break;
			case ']':
				$prettyString += '\n]';
				break;
			default:
				$prettyString += $longUglyString[$i];
		}
	}

	return $prettyString;
}