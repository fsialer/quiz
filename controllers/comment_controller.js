var models=require('../models/models.js');
//GET /quizes/:quizId/comment/new
exports.load=function(req,res,next,commentId){
	models.Comment.find({
		where:{id:Number(commentId)}
	}).then(function(comment){
			if (comment) {
				req.comment=comment;
				next();
			}else{next(new Error('No existe commentId='+commentId));}
		}
		).catch(function(error){next(error)});
};
exports.new=function(req,res){
	res.render('comments/new.ejs',{quizId:req.params.quizId,errors:[]});
};

//POST /quizes/:quizId/comments
exports.create=function(req,res){
	var comment=models.Comment.build(
	{
		texto:req.body.comment.texto,
		QuizId:req.params.quizId
	}
		);

	comment.validate().then(function(err){
		if (err) {
			res.render('comments/new.ejs',
				{comment:comment,quizId:req.params.quizId,errors:err.errors});

		}else{
			comment //save: guarda en DB campo texto de comment
			.save()
			.then(function(){
				res.redirect('/quizes/'+req.params.quizId)
			})
		}//res.redirect:Redireccion HTTPa lista de preguntas
	}).catch(function(error){next(error)});
};
//POST /quizes/:quizId/comments/:comments/:commentId/publish
exports.publish=function(req,res){
	req.comment.publicado=true;
	req.comment.save({fields: ["publicado"]})
        .then( function(){ res.redirect('/quizes/'+req.params.quizId);})
        .catch(function(error){next(error)}); 
            // res.redirect: Redirección HTTP a lista de preguntas

};