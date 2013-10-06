/* home page */

exports.index = function(req, res){
  res.render('index', 
  {

  	'text' : 'Welcome ', 
  	partials : 
  	{
  		header : 'header',
  		footer : 'footer'
  	} 


  });
};